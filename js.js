// Wait for DOM
document.addEventListener('DOMContentLoaded', function () {

  // --- Initialize Vanta safely (destroy if already present) ---
  try {
    if (window.vantaEffect) {
      window.vantaEffect.destroy();
      window.vantaEffect = null;
    }

    // Slight delay can help in some live-reload setups
    window.vantaEffect = VANTA.GLOBE({
      el: "#vanta-hero",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x8eefff,     // primary
      color2: 0xed1ad4,    // secondary
      size: 0.7,
      backgroundColor: 0x021018 // darker behind globe
    });
  } catch (e) {
    // Vanta failed — keep fallback background; log for debug
    console.warn('Vanta init failed:', e);
  }

  // --- Social icon pop effect and accessibility feedback ---
  const icons = document.querySelectorAll('.social-icon');
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      icon.classList.add('pop');
      // remove class after animation
      setTimeout(() => icon.classList.remove('pop'), 380);
    });

    // keyboard accessible 'Enter' / 'Space'
    icon.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        icon.classList.add('pop');
        setTimeout(() => icon.classList.remove('pop'), 380);
        // also follow link
        const href = icon.getAttribute('href');
        if (href) window.open(href, '_blank', 'noopener');
      }
    });

    // make them focusable for keyboard users
    icon.setAttribute('tabindex', '0');
  });

  // --- Letter-by-letter typing animation for social labels ---
  const iconWrappers = document.querySelectorAll('.social-icon-wrapper');
  
  function typeLabel(element, text, speed = 60, timeoutRef) {
    // Clear any existing animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    element.textContent = '';
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        timeoutRef.current = null;
      }
    }
    type();
  }
  
  function clearLabel(element, timeoutRef) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    element.textContent = '';
  }
  
  iconWrappers.forEach(wrapper => {
    const icon = wrapper.querySelector('.social-icon');
    const label = wrapper.querySelector('.social-label');
    const labelText = icon.getAttribute('data-label') || '';
    const typingTimeout = { current: null };
    let touchTimer = null;
    
    // Mouse events
    icon.addEventListener('mouseenter', () => {
      clearLabel(label, typingTimeout);
      setTimeout(() => typeLabel(label, labelText, 60, typingTimeout), 50);
    });
    
    icon.addEventListener('mouseleave', () => {
      clearLabel(label, typingTimeout);
    });
    
    // Touch events
    icon.addEventListener('touchstart', (e) => {
      clearLabel(label, typingTimeout);
      setTimeout(() => typeLabel(label, labelText, 60, typingTimeout), 50);
      
      if (touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        clearLabel(label, typingTimeout);
      }, 3000);
    });
    
    icon.addEventListener('touchend', () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = setTimeout(() => {
          clearLabel(label, typingTimeout);
        }, 2000);
      }
    });
    
    // Focus events for keyboard navigation
    icon.addEventListener('focus', () => {
      clearLabel(label, typingTimeout);
      setTimeout(() => typeLabel(label, labelText, 60, typingTimeout), 50);
    });
    
    icon.addEventListener('blur', () => {
      clearLabel(label, typingTimeout);
    });
  });

});
