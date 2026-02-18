/**
 * Main Application Initialization
 *
 * Coordinates the Three.js volatility surface and D3.js visualizations.
 * Sets up event listeners and handles responsive behavior.
 */

// Global instances
let volatilitySurface = null;
let kalmanViz = null;
let markovViz = null;

// Debounce helper for hover events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Wait for libraries to load, then initialize
function initializeWhenReady() {
  // Check if libraries are loaded
  if (typeof THREE === 'undefined' || typeof d3 === 'undefined') {
    console.log('Waiting for libraries to load...');
    setTimeout(initializeWhenReady, 100);
    return;
  }

  console.log('Initializing Quant Portfolio...');

  // Initialize Three.js volatility surface (async — loads real CDC data)
  try {
    volatilitySurface = new VolatilitySurface('volatility-canvas');
    volatilitySurface.init().then(() => {
      console.log('✓ Three.js volatility surface initialized');
    });
  } catch (error) {
    console.error('Error initializing Three.js surface:', error);
  }

  // Initialize D3.js visualizations
  try {
    kalmanViz = new KalmanViz('kalman-viz');
    markovViz = new MarkovViz('markov-viz');
    console.log('✓ D3.js visualizations initialized');
  } catch (error) {
    console.error('Error initializing D3.js visualizations:', error);
  }

  // Setup hover interactions for project cards
  setupProjectInteractions();

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('✓ Portfolio initialization complete');
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', initializeWhenReady);

/**
 * Setup hover interactions for project cards
 */
function setupProjectInteractions() {
  const projectCards = document.querySelectorAll('.project[data-project]');

  projectCards.forEach(card => {
    const projectType = card.getAttribute('data-project');
    const vizContainer = card.querySelector('.viz-container');

    if (!vizContainer) return;

    // Desktop: use hover
    if (window.innerWidth > 768) {
      let isHovering = false;

      card.addEventListener('mouseenter', debounce(() => {
        isHovering = true;
        setTimeout(() => {
          if (isHovering) {
            vizContainer.style.opacity = '1';
            vizContainer.style.pointerEvents = 'auto';
          }
        }, 100);
      }, 50));

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        vizContainer.style.opacity = '0';
        vizContainer.style.pointerEvents = 'none';
      });
    } else {
      // Mobile: use tap to toggle
      let isVisible = false;

      card.addEventListener('click', (e) => {
        // Don't toggle if clicking on a link
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          return;
        }

        isVisible = !isVisible;

        if (isVisible) {
          vizContainer.style.opacity = '1';
          vizContainer.style.pointerEvents = 'auto';
        } else {
          vizContainer.style.opacity = '0';
          vizContainer.style.pointerEvents = 'none';
        }

        e.preventDefault();
      });
    }
  });
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(() => {
  console.log('Window resized, updating layout...');

  // Recreate project interactions based on new screen size
  setupProjectInteractions();
}, 250));

/**
 * Handle visibility change (pause animations when tab is not visible)
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Tab hidden, pausing animations');
    // Optionally pause Three.js animation here
  } else {
    console.log('Tab visible, resuming animations');
    // Resume animations
  }
});

/**
 * Error handler for missing dependencies
 */
window.addEventListener('error', (e) => {
  if (e.message.includes('THREE') || e.message.includes('d3')) {
    console.error('Missing dependency:', e.message);
    console.error('Please ensure Three.js and D3.js are loaded from CDN');
  }
});

// Export for debugging (optional)
if (typeof window !== 'undefined') {
  window.portfolioApp = {
    volatilitySurface,
    kalmanViz,
    markovViz,
    version: '1.0.0'
  };
}
