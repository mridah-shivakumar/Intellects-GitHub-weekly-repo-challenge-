/* ==========================================================================
   INTELLECTS CLUB - SRM RAMAPURAM (Dept. of AIML)
   Interactive Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ Intellects Club Application Initialized - SRM Ramapuram Dept of AIML');

  // 1. Sticky Glass Navbar Scroll Effect
  const navbar = document.querySelector('.header-navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open') ? 'ri-close-line' : 'ri-menu-3-line';
      }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-3-line';
      });
    });
  }

  // 3. Neon Stat Counter Animation for GitHub Challenge
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const isInfinite = stat.getAttribute('data-infinite') === 'true';
      
      if (isInfinite) {
        stat.innerText = '∞';
        return;
      }

      let count = 0;
      const speed = target / 30; // 30 steps

      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.innerText = Math.ceil(count);
          setTimeout(updateCount, 40);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  };

  // Trigger Stat Animation when section in viewport
  const spotlightSection = document.getElementById('github-challenge');
  if (spotlightSection) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateStats();
          animated = true;
        }
      });
    }, { threshold: 0.3 });
    observer.observe(spotlightSection);
  }

  // 4. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  // 5. Generative Pixel Art Canvas Backdrop System
  const initPixelCanvas = () => {
    const canvas = document.getElementById('pixel-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');

    let width = 0;
    let height = 0;
    let gridNodes = [];
    const step = 22;       // Grid spacing in pixels
    const baseSize = 8;    // Baseline 8px pixel dimension
    const interactionRadius = 120;

    const mouse = { x: -1000, y: -1000, active: false };

    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      createGrid();
    };

    const createGrid = () => {
      gridNodes = [];
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step + step / 2;
          const y = r * step + step / 2;
          
          // Alternate baseline color palette: Deep Violet & Cyan
          const isViolet = (c + r) % 2 === 0;
          gridNodes.push({
            x,
            y,
            baseAlpha: 0.08,
            alpha: 0.08,
            currentSize: baseSize,
            targetSize: baseSize,
            baseColor: isViolet ? { r: 168, g: 85, b: 247 } : { r: 6, g: 182, b: 212 },
            activeColor: { r: 255, g: 42, b: 133 } // Pink/Magenta highlight (#ff2a85)
          });
        }
      }
    };

    const updateEvents = () => {
      const handlePointerMove = (e) => {
        const rect = heroSection.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;
      };

      const handlePointerLeave = () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      };

      heroSection.addEventListener('mousemove', handlePointerMove);
      heroSection.addEventListener('touchmove', handlePointerMove, { passive: true });
      heroSection.addEventListener('mouseleave', handlePointerLeave);
      window.addEventListener('resize', resizeCanvas);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < gridNodes.length; i++) {
        const node = gridNodes[i];
        
        let dist = 99999;
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        if (dist < interactionRadius) {
          const factor = 1 - (dist / interactionRadius);
          const smoothFactor = factor * factor;
          
          node.targetAlpha = 0.08 + smoothFactor * 0.82; // Vibrancy boost up to ~0.9
          node.targetSize = baseSize + smoothFactor * 5;  // Size distortion expansion
          
          // Color transition towards neon pink (#ff2a85)
          node.color = {
            r: Math.round(node.baseColor.r + (node.activeColor.r - node.baseColor.r) * smoothFactor),
            g: Math.round(node.baseColor.g + (node.activeColor.g - node.baseColor.g) * smoothFactor),
            b: Math.round(node.baseColor.b + (node.activeColor.b - node.baseColor.b) * smoothFactor)
          };
        } else {
          node.targetAlpha = node.baseAlpha;
          node.targetSize = baseSize;
          node.color = node.baseColor;
        }

        // Smooth decay interpolation
        node.alpha += (node.targetAlpha - node.alpha) * 0.1;
        node.currentSize += (node.targetSize - node.currentSize) * 0.12;

        const halfSize = node.currentSize / 2;
        ctx.fillStyle = `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${node.alpha})`;
        ctx.fillRect(node.x - halfSize, node.y - halfSize, node.currentSize, node.currentSize);
      }

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    updateEvents();
    requestAnimationFrame(animate);
  };

  initPixelCanvas();
});
