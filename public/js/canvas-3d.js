/**
 * 3D Ambient Particle & Floating Canvas Engine
 * Renders glowing ambient food particles, light rays and subtle 3D food spheres
 */
(function() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const emojis = ['🍕', '🍔', '🍚', '🥟', '🍰', '🍹', '🥘', '🥞', '🌶️', '🧀'];
  let mouse = { x: -1000, y: -1000, targetX: 0, targetY: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 50;
      this.size = Math.random() * 20 + 14;
      this.speedY = -(Math.random() * 0.4 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.35 + 0.15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.isGlowingOrb = Math.random() > 0.6;
      this.glowColor = Math.random() > 0.5 ? 'rgba(255, 87, 34,' : 'rgba(255, 152, 0,';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      // Subtle mouse avoidance
      const dx = mouse.targetX - this.x;
      const dy = mouse.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= (dx / dist) * 1.5;
        this.y -= (dy / dist) * 1.5;
      }

      if (this.y < -50 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isGlowingOrb) {
        // Glowing 3D particle orb
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, `${this.glowColor} ${this.opacity * 0.8})`);
        grad.addColorStop(0.5, `${this.glowColor} ${this.opacity * 0.3})`);
        grad.addColorStop(1, `${this.glowColor} 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Floating translucent food emoji with subtle shadow
        ctx.globalAlpha = this.opacity * 0.7;
        ctx.font = `${Math.floor(this.size)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255, 87, 34, 0.4)';
        ctx.shadowBlur = 12;
        ctx.fillText(this.emoji, 0, 0);
      }

      ctx.restore();
    }
  }

  // Generate 32 particles
  const count = Math.min(32, Math.floor(window.innerWidth / 40));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw
    for (let p of particles) {
      p.update();
      p.draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
