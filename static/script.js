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
});
