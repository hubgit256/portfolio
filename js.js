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

});
