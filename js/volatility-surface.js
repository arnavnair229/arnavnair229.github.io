/**
 * US Health Volatility Surface (Data-Driven)
 *
 * Renders a real implied volatility surface computed from CDC BRFSS obesity data.
 * Model: Threshold Digital Option on Logit(Obesity Prevalence)
 *
 * X-axis: Obesity Threshold (Strike K) — 25% to 45%
 * Y-axis: Horizon (Maturity T) — 1 to 10 years
 * Z-axis: Implied Sigma (logit scale)
 *
 * Loads data from data/health-surface-data.json and interpolates
 * to a denser mesh for smooth rendering.
 */

class VolatilitySurface {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.surface = null;
    this.surfaceGroup = null; // Group for surface + axes (rotates together)
    this.surfaceData = null;
    this.baseHeights = null; // Store computed heights for animation
    this.time = 0;

    this.config = {
      // Render grid is denser than data grid for smooth visuals
      renderGrid: this.isMobile() ? { x: 20, y: 12 } : { x: 40, y: 24 },
      rotation: { x: 0.0002, y: 0.0003 },
      waveSpeed: 0.0008,
      waveAmplitude: 0.15,
      color: 0xffffff,
      opacity: 0.85,
      // Scale factors to map data to 3D space
      scaleX: 12,  // spread of strike axis
      scaleY: 10,  // spread of maturity axis
      scaleZ: 20,  // height multiplier for sigma values (v2 surface has smaller sigma range)
    };
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  async init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();

    // Load real data, fall back to synthetic if fetch fails
    try {
      const resp = await fetch('data/health-surface-data.json');
      this.surfaceData = await resp.json();
      console.log('Loaded health surface data:', this.surfaceData.metadata.title);
    } catch (e) {
      console.warn('Could not load surface data, using synthetic fallback');
      this.surfaceData = null;
    }

    this.createSurface();
    this.handleResize();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0d0d0d, 15, 50);
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    this.camera.position.set(9, 7, 11);
    this.camera.lookAt(0, 1, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: !this.isMobile()
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0d0d0d, 1);
  }

  /**
   * Bilinear interpolation on the data grid to get sigma at any (u, v)
   * u = normalized strike position [0,1], v = normalized maturity position [0,1]
   */
  interpolateSigma(u, v, grid, nRows, nCols) {
    // Map to grid indices
    const gx = u * (nCols - 1);
    const gy = v * (nRows - 1);

    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(x0 + 1, nCols - 1);
    const y1 = Math.min(y0 + 1, nRows - 1);

    const fx = gx - x0;
    const fy = gy - y0;

    // Bilinear interpolation
    const v00 = grid[y0][x0];
    const v10 = grid[y0][x1];
    const v01 = grid[y1][x0];
    const v11 = grid[y1][x1];

    return (1 - fx) * (1 - fy) * v00 +
           fx * (1 - fy) * v10 +
           (1 - fx) * fy * v01 +
           fx * fy * v11;
  }

  /**
   * Creates a text sprite (always faces camera) for axis labels
   */
  createTextSprite(text, position, { scale = 1, color = 'rgba(255, 76, 76, 0.85)', fontSize = 36 } = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(4 * scale, 1 * scale, 1);

    return sprite;
  }

  /**
   * Adds 3D axis lines and labels to the surface group.
   * Axes are placed on the near edges (front + right) for camera visibility.
   *
   * Coordinate mapping:
   *   Three.js X = Strike K (25%-45%)   spans -halfX to +halfX
   *   Three.js Z = Maturity T (1-10y)   spans -halfZ to +halfZ
   *   Three.js Y = Implied σ (height)
   */
  createAxes() {
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0xff4c4c,
      opacity: 0.6,
      transparent: true
    });

    const halfX = this.config.scaleX / 2; // 6
    const halfZ = this.config.scaleY / 2; // 5
    const maxH = Math.max(...this.baseHeights.filter(h => h > 0));

    const addLine = (from, to) => {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...from),
        new THREE.Vector3(...to)
      ]);
      this.surfaceGroup.add(new THREE.Line(geom, axisMaterial));
    };

    // X-axis (Strike K) along the front edge (Z = +halfZ, nearest to camera)
    addLine([-halfX, 0, halfZ], [halfX, 0, halfZ]);
    // Z-axis (Maturity T) along the right edge (X = +halfX)
    addLine([halfX, 0, -halfZ], [halfX, 0, halfZ]);
    // Y-axis (Implied σ) vertical at the front-right corner
    addLine([halfX, 0, halfZ], [halfX, maxH * 1.15, halfZ]);

    // Small tick lines along each axis
    const tickLen = 0.25;
    // Strike ticks (perpendicular into Z)
    const strikeTicks = [
      { u: 0, label: '25%' },
      { u: 4/8, label: '35%' },
      { u: 1, label: '45%' }
    ];
    strikeTicks.forEach(({ u, label }) => {
      const x = (u - 0.5) * this.config.scaleX;
      addLine([x, 0, halfZ], [x, 0, halfZ + tickLen]);
      this.surfaceGroup.add(this.createTextSprite(label,
        new THREE.Vector3(x, -0.4, halfZ + 1.0),
        { scale: 0.35, color: 'rgba(255, 255, 255, 0.55)' }
      ));
    });

    // Maturity ticks (perpendicular into X)
    // Grid rows: [1y, 2y, 3y, 5y, 7y, 10y] → v = row/5
    const maturityTicks = [
      { v: 0, label: '1y' },
      { v: 3/5, label: '5y' },
      { v: 1, label: '10y' }
    ];
    maturityTicks.forEach(({ v, label }) => {
      const z = (v - 0.5) * this.config.scaleY;
      addLine([halfX, 0, z], [halfX + tickLen, 0, z]);
      this.surfaceGroup.add(this.createTextSprite(label,
        new THREE.Vector3(halfX + 1.0, -0.4, z),
        { scale: 0.35, color: 'rgba(255, 255, 255, 0.55)' }
      ));
    });

    // Main axis labels
    const labelOpts = { scale: 0.7, color: 'rgba(255, 76, 76, 0.85)' };

    this.surfaceGroup.add(this.createTextSprite(
      'Obesity Threshold (Strike K)',
      new THREE.Vector3(0, -1.0, halfZ + 2.0),
      labelOpts
    ));
    this.surfaceGroup.add(this.createTextSprite(
      'Horizon (Maturity T)',
      new THREE.Vector3(halfX + 2.5, -1.0, 0),
      labelOpts
    ));
    this.surfaceGroup.add(this.createTextSprite(
      'Implied \u03C3',
      new THREE.Vector3(halfX + 1.5, maxH * 0.6, halfZ + 1.0),
      { scale: 0.6, color: 'rgba(255, 76, 76, 0.85)' }
    ));
  }

  /**
   * Creates the volatility surface from real CDC-derived data
   */
  createSurface() {
    this.surfaceGroup = new THREE.Group();

    const { x: gridX, y: gridY } = this.config.renderGrid;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    const grid = this.surfaceData ? this.surfaceData.surface.grid : null;
    const nRows = grid ? grid.length : 0;
    const nCols = grid ? grid[0].length : 0;

    this.baseHeights = [];

    for (let i = 0; i <= gridY; i++) {
      for (let j = 0; j <= gridX; j++) {
        const u = j / gridX; // strike axis [0,1]
        const v = i / gridY; // maturity axis [0,1]

        // Map to 3D space (centered)
        const x = (u - 0.5) * this.config.scaleX;
        const y = (v - 0.5) * this.config.scaleY;

        let z;
        if (grid) {
          // Interpolate real data
          const sigma = this.interpolateSigma(u, v, grid, nRows, nCols);
          z = sigma * this.config.scaleZ;
        } else {
          // Synthetic fallback
          const smile = Math.pow((u - 0.5) * 2, 2) * 1.5;
          const term = v * 0.5;
          z = (smile + term) * 2;
        }

        this.baseHeights.push(z);
        vertices.push(x, z, y); // z and y swapped for Three.js orientation
      }
    }

    // Generate wireframe indices
    for (let i = 0; i < gridY; i++) {
      for (let j = 0; j < gridX; j++) {
        const a = i * (gridX + 1) + j;
        const b = a + gridX + 1;
        indices.push(a, b);
        indices.push(a, a + 1);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    const material = new THREE.LineBasicMaterial({
      color: this.config.color,
      opacity: this.config.opacity,
      transparent: true,
      linewidth: 1
    });

    this.surface = new THREE.LineSegments(geometry, material);
    this.surfaceGroup.add(this.surface);

    // Add 3D axes and labels
    this.createAxes();

    this.scene.add(this.surfaceGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
  }

  /**
   * Animation loop — subtle wave on top of real data
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += this.config.waveSpeed;

    if (this.surfaceGroup && this.baseHeights) {
      this.surfaceGroup.rotation.x += this.config.rotation.x;
      this.surfaceGroup.rotation.y += this.config.rotation.y;

      const positions = this.surface.geometry.attributes.position.array;
      const { x: gridX, y: gridY } = this.config.renderGrid;

      for (let i = 0; i <= gridY; i++) {
        for (let j = 0; j <= gridX; j++) {
          const idx = i * (gridX + 1) + j;
          const posIdx = idx * 3;
          const u = j / gridX;
          const v = i / gridY;

          // Base height from real data
          const baseZ = this.baseHeights[idx];

          // Subtle wave animation
          const wave = Math.sin(u * Math.PI * 3 + this.time) *
                      Math.cos(v * Math.PI * 2 + this.time * 0.7) *
                      this.config.waveAmplitude;

          positions[posIdx + 1] = baseZ + wave;
        }
      }

      this.surface.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  dispose() {
    if (this.surface) {
      this.surface.geometry.dispose();
      this.surface.material.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
