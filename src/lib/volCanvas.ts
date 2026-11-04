import { maturities, sigmaAt, strikes, validCols } from "./surface";

const VS = `attribute vec3 p; uniform mat4 m; uniform float t; varying float h; varying float d;
void main(){ vec3 q=p; q.y+=0.09*sin(p.x*1.1+t)*cos(p.z*0.9+t*0.7);
  h=p.y; vec4 c=m*vec4(q,1.0); d=c.w; gl_Position=c; }`;
const FS = `precision mediump float; varying float h; varying float d;
void main(){ float f=clamp((26.0-d)/15.0,0.25,1.0); float a=clamp(h/3.2,0.0,1.0);
  gl_FragColor=vec4(mix(vec3(0.09,0.08,0.06),vec3(0.70,0.16,0.09),a),0.8*f); }`;

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
}
function mul(a: number[], b: number[]) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
}
const rotX = (a: number) => [1, 0, 0, 0, 0, Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1];
const rotY = (a: number) => [Math.cos(a), 0, -Math.sin(a), 0, 0, 1, 0, 0, Math.sin(a), 0, Math.cos(a), 0, 0, 0, 0, 1];
const DISTANCE = -17;
const trans = (x: number, y: number, z: number) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];

/** One static frame of the same geometry on a 2D canvas, for devices without a real GPU. */
function drawStatic(canvas: HTMLCanvasElement, verts: number[], idx: number[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const paint = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const m = mul(perspective(0.9, w / h, 0.1, 100), mul(trans(0, -1.4, DISTANCE), mul(rotX(0.5), rotY(-0.7))));
    const project = (i: number) => {
      const [x, y, z] = [verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2]];
      const c = m[3] * x + m[7] * y + m[11] * z + m[15];
      return [((m[0] * x + m[4] * y + m[8] * z + m[12]) / c + 1) * canvas.width / 2,
        (1 - (m[1] * x + m[5] * y + m[9] * z + m[13]) / c) * canvas.height / 2] as const;
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(22,21,15,0.45)";
    ctx.lineWidth = dpr * 0.75;
    ctx.beginPath();
    for (let i = 0; i < idx.length; i += 2) {
      const a = project(idx[i]);
      const b = project(idx[i + 1]);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
  };
  paint();
  new ResizeObserver(paint).observe(canvas);
}

/** Wireframe of the real surface, inside its figure. One static frame when there is no hardware-accelerated WebGL. */
export function startVolCanvas(canvas: HTMLCanvasElement, reduced: boolean) {
  const cols = 28;
  const rows = 18;
  const kMin = strikes[validCols[0]];
  const kMax = strikes[validCols[validCols.length - 1]];
  const tMin = maturities[0];
  const tMax = maturities[maturities.length - 1];

  const verts: number[] = [];
  const idx: number[] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const v = r / rows;
      verts.push((u - 0.5) * 13, sigmaAt(kMin + u * (kMax - kMin), tMin + v * (tMax - tMin)) * 20, (v - 0.5) * 11);
    }
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const a = r * (cols + 1) + c;
      if (c < cols) idx.push(a, a + 1);
      if (r < rows) idx.push(a, a + cols + 1);
    }

  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power", failIfMajorPerformanceCaveat: true });
  if (!gl) { drawStatic(canvas, verts, idx); return; }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
  const uM = gl.getUniformLocation(prog, "m");
  const uT = gl.getUniformLocation(prog, "t");
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let aspect = 1;
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = w / h;
  };
  resize();

  let px = 0, py = 0, tx = 0, ty = 0, raf = 0, last = 0, onScreen = true;
  const draw = (now: number) => {
    px += (tx - px) * 0.04;
    py += (ty - py) * 0.04;
    const time = reduced ? 0 : now * 0.00025;
    const view = mul(trans(0, -1.4, DISTANCE), mul(rotX(0.5 + py * 0.08), rotY(-0.7 + Math.sin(time * 0.6) * 0.14 + px * 0.2)));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(uM, false, new Float32Array(mul(perspective(0.9, aspect, 0.1, 100), view)));
    gl.uniform1f(uT, time * 4);
    gl.drawElements(gl.LINES, idx.length, gl.UNSIGNED_SHORT, 0);
  };
  new ResizeObserver(() => { resize(); if (reduced) draw(0); }).observe(canvas);
  if (reduced) { draw(0); return; }

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < 33) return;
    last = now;
    draw(now);
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    if (onScreen && !document.hidden) raf = requestAnimationFrame(loop);
  };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(canvas);
  sync();
}
