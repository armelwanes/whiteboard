/**
 * Particle Engine for whiteboard-anim
 * Provides particle effects system with physics simulation
 */

export class Particle {
  constructor(x, y, config = {}) {
    this.x = x;
    this.y = y;
    this.vx = config.vx || 0;
    this.vy = config.vy || 0;
    this.ax = config.ax || 0;
    this.ay = config.ay || 0.5; // gravity
    this.life = config.life || 1.0;
    this.decay = config.decay || 0.01;
    this.size = config.size || 5;
    this.color = config.color || '#ffffff';
    this.alpha = config.alpha || 1.0;
    this.rotation = config.rotation || 0;
    this.rotationSpeed = config.rotationSpeed || 0;
    this.shape = config.shape || 'circle'; // circle, square, triangle, star
  }

  update(deltaTime = 1) {
    // Update velocity with acceleration
    this.vx += this.ax * deltaTime;
    this.vy += this.ay * deltaTime;
    
    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;
    
    // Decay life
    this.life -= this.decay * deltaTime;
    
    // Update alpha based on life
    this.alpha = Math.max(0, this.life);
    
    return this.life > 0;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    switch (this.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'square':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.lineTo(this.size, this.size);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'star':
        this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
        ctx.fill();
        break;
        
      default:
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }
}

export class ParticleEmitter {
  constructor(x, y, config = {}) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.config = {
      rate: config.rate || 10, // particles per frame
      maxParticles: config.maxParticles || 100,
      particleConfig: config.particleConfig || {},
      spread: config.spread || Math.PI * 2,
      angle: config.angle || 0,
      speed: config.speed || 2,
      speedVariation: config.speedVariation || 1,
      duration: config.duration || -1, // -1 = infinite
      ...config
    };
    this.time = 0;
    this.active = true;
  }

  emit(count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.config.maxParticles) break;
      
      const angle = this.config.angle + (Math.random() - 0.5) * this.config.spread;
      const speed = this.config.speed + (Math.random() - 0.5) * this.config.speedVariation;
      
      const particle = new Particle(this.x, this.y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ...this.config.particleConfig
      });
      
      this.particles.push(particle);
    }
  }

  update(deltaTime = 1) {
    if (this.active) {
      this.emit(this.config.rate * deltaTime);
    }
    
    this.time += deltaTime;
    
    if (this.config.duration > 0 && this.time >= this.config.duration) {
      this.active = false;
    }
    
    // Update all particles and remove dead ones
    this.particles = this.particles.filter(particle => particle.update(deltaTime));
  }

  draw(ctx) {
    this.particles.forEach(particle => particle.draw(ctx));
  }

  stop() {
    this.active = false;
  }

  reset() {
    this.particles = [];
    this.time = 0;
    this.active = true;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  isComplete() {
    return !this.active && this.particles.length === 0;
  }
}

export class ParticleSystem {
  constructor() {
    this.emitters = [];
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.lastTime = Date.now();
  }

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  addEmitter(emitter) {
    this.emitters.push(emitter);
    return emitter;
  }

  removeEmitter(emitter) {
    const index = this.emitters.indexOf(emitter);
    if (index > -1) {
      this.emitters.splice(index, 1);
    }
  }

  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 16.67; // Normalize to 60fps
    this.lastTime = now;

    // Update all emitters
    this.emitters.forEach(emitter => emitter.update(deltaTime));
    
    // Remove completed emitters
    this.emitters = this.emitters.filter(emitter => !emitter.isComplete());
  }

  draw() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all emitters
    this.emitters.forEach(emitter => emitter.draw(this.ctx));
  }

  start() {
    if (this.animationFrame) return;
    
    const animate = () => {
      this.update();
      this.draw();
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  clear() {
    this.emitters = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy() {
    this.stop();
    this.clear();
    this.canvas = null;
    this.ctx = null;
  }
}

export default ParticleSystem;
