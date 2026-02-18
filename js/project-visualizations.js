/**
 * D3.js Project Visualizations
 *
 * Interactive visualizations that appear on hover over project cards.
 * - KalmanViz: Spread evolution chart with entry/exit signals
 * - MarkovViz: Transition matrix heatmap and state distribution
 */

// ================================
// Base Visualization Class
// ================================
class BaseViz {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.svg = null;
    this.data = null;
    this.margin = { top: 15, right: 15, bottom: 25, left: 40 };
    this.width = 300 - this.margin.left - this.margin.right;
    this.height = 200 - this.margin.top - this.margin.bottom;
  }

  async loadData(url) {
    try {
      const response = await fetch(url);
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error(`Error loading data from ${url}:`, error);
      return null;
    }
  }

  createSVG() {
    this.svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// ================================
// Kalman Filter Visualization
// ================================
class KalmanViz extends BaseViz {
  constructor(containerId) {
    super(containerId);
    this.init();
  }

  async init() {
    await this.loadData('data/kalman-data.json');
    if (this.data) {
      this.render();
    }
  }

  render() {
    this.clear();
    this.createSVG();

    const { spread, signals } = this.data;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(spread, d => d.time)])
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(spread, d => d.value) - 0.1, d3.max(spread, d => d.value) + 0.1])
      .range([this.height, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add zero line
    this.svg.append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Add shaded regions for entry zones
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', yScale(0.5) - yScale(0.8))
      .attr('transform', `translate(0, ${yScale(0.8)})`)
      .attr('fill', '#ff4c4c')
      .attr('opacity', 0.1);

    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', yScale(-0.5))
      .attr('width', this.width)
      .attr('height', yScale(-0.5) - yScale(-0.8))
      .attr('fill', '#4cff4c')
      .attr('opacity', 0.1);

    // Draw the spread line
    this.svg.append('path')
      .datum(spread)
      .attr('fill', 'none')
      .attr('stroke', '#ff4c4c')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add signal markers
    signals.forEach(signal => {
      const color = signal.type === 'short' ? '#ff4c4c' :
                   signal.type === 'long' ? '#4cff4c' : '#ffcc00';
      const symbol = signal.type === 'short' ? '▼' :
                    signal.type === 'long' ? '▲' : '×';

      this.svg.append('text')
        .attr('x', xScale(signal.time))
        .attr('y', yScale(signal.value) - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(symbol);
    });

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(xAxis)
      .attr('color', '#888')
      .selectAll('text')
      .attr('fill', '#ccc');

    this.svg.append('g')
      .call(yAxis)
      .attr('color', '#888')
      .selectAll('text')
      .attr('fill', '#ccc');

    // Add axis labels
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#aaa')
      .attr('font-size', '10px')
      .text('Time (days)');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.height / 2)
      .attr('y', -28)
      .attr('text-anchor', 'middle')
      .attr('fill', '#aaa')
      .attr('font-size', '10px')
      .text('Spread');

    // Add title
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff4c4c')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('Kalman Filter Spread Tracking');
  }
}

// ================================
// Markov Chain Visualization
// ================================
class MarkovViz extends BaseViz {
  constructor(containerId) {
    super(containerId);
    this.init();
  }

  async init() {
    await this.loadData('data/markov-data.json');
    if (this.data) {
      this.render();
    }
  }

  render() {
    this.clear();
    this.createSVG();

    const { transitionMatrix, states, stateDistribution } = this.data;

    // Split the visualization into two parts: heatmap (top) and bar chart (bottom)
    const heatmapHeight = Math.max(this.height * 0.55, 60);
    const barChartHeight = Math.max(this.height * 0.35, 40);
    const gap = this.height * 0.10;

    // ========== Transition Matrix Heatmap ==========
    const cellSize = Math.min(this.width / 2.5, heatmapHeight / 2.5);
    const heatmapGroup = this.svg.append('g');

    // Color scale for transition probabilities
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateReds);

    // Create cells
    transitionMatrix.forEach((row, i) => {
      row.forEach((value, j) => {
        const x = j * cellSize + (this.width - cellSize * 2) / 2;
        const y = i * cellSize;

        // Cell rectangle
        heatmapGroup.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', colorScale(value))
          .attr('stroke', '#333')
          .attr('stroke-width', 1);

        // Probability text
        heatmapGroup.append('text')
          .attr('x', x + cellSize / 2)
          .attr('y', y + cellSize / 2 + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', value > 0.5 ? '#fff' : '#333')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .text(value.toFixed(2));
      });
    });

    // Add state labels
    states.forEach((state, i) => {
      // Row labels (left)
      heatmapGroup.append('text')
        .attr('x', (this.width - cellSize * 2) / 2 - 5)
        .attr('y', i * cellSize + cellSize / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#ccc')
        .attr('font-size', '9px')
        .text(state.split(' ')[0]); // Just "Up" or "Down"

      // Column labels (top)
      heatmapGroup.append('text')
        .attr('x', i * cellSize + cellSize / 2 + (this.width - cellSize * 2) / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ccc')
        .attr('font-size', '9px')
        .text(state.split(' ')[0]);
    });

    // Heatmap title
    heatmapGroup.append('text')
      .attr('x', this.width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff4c4c')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('Transition Probability Matrix');

    // ========== State Distribution Bar Chart ==========
    const barChartGroup = this.svg.append('g')
      .attr('transform', `translate(0, ${heatmapHeight + gap})`);

    const barWidth = this.width / stateDistribution.length - 10;
    const barScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, barChartHeight]);

    stateDistribution.forEach((d, i) => {
      const x = i * (barWidth + 10) + (this.width - (barWidth + 10) * stateDistribution.length + 10) / 2;
      const barHeight = Math.max(0, barScale(d.probability)); // Ensure non-negative

      // Bar
      barChartGroup.append('rect')
        .attr('x', x)
        .attr('y', Math.max(0, barChartHeight - barHeight)) // Ensure non-negative y
        .attr('width', Math.max(0, barWidth)) // Ensure non-negative width
        .attr('height', barHeight)
        .attr('fill', i === 0 ? '#4cff4c' : '#ff4c4c')
        .attr('opacity', 0.7);

      // Percentage label
      barChartGroup.append('text')
        .attr('x', x + barWidth / 2)
        .attr('y', barChartHeight - barHeight - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ccc')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(`${(d.probability * 100).toFixed(1)}%`);

      // State label
      barChartGroup.append('text')
        .attr('x', x + barWidth / 2)
        .attr('y', barChartHeight + 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#aaa')
        .attr('font-size', '9px')
        .text(d.state.split(' ')[0]);
    });

    // Bar chart title
    barChartGroup.append('text')
      .attr('x', this.width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#aaa')
      .attr('font-size', '9px')
      .text('Steady-State Distribution');
  }
}
