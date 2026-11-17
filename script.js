/**
 * SHAIK MAGDUM - PORTFOLIO INTERACTION ENGINE
 * Crafted with the aesthetic and physics of tomdekoning.work:
 * - Playfair 'o' typographic replacement
 * - Star rotation with scroll-velocity coupling
 * - Custom trailing-light cursor canvas
 * - Three.js 3D electromagnetic field visualizer in footer
 * - Interactive project inspection modal with detailed specs
 * - Marquee scroll direction reactivity
 * - Smooth scroll reveal triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  initWrapLetterO();
  initStarRotation();
  initDrawPathCursorEffect();
  initMarqueeScroll();
  initThreeElectromagneticSphere();
  initProjectModals();
  initNavScroll();
  initHeroParallax();
});

/* --------------------------------------------------------------------------
   1. Typography: Replace 'o' / 'O' with Playfair Display italic 'o'
   -------------------------------------------------------------------------- */
function initWrapLetterO() {
  const selectors = ['.hero-giant-title', '.heading-2', '.heading-extreme', '.header-tagline', '.project-title', '.marquee-item'];
  
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Traverse text nodes to avoid destroying HTML tags
      wrapInNode(el);
    });
  });

  function wrapInNode(node) {
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue;
      if (/[oO]/.test(text)) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(/([oO])/g, '<span class="playfair-o">$1</span>');
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === 1 && !node.classList.contains('playfair-o') && !node.classList.contains('star-icon')) {
      Array.from(node.childNodes).forEach(child => wrapInNode(child));
    }
  }
}

/* --------------------------------------------------------------------------
   2. Geometric Star Icon: Scroll-driven velocity rotation
   -------------------------------------------------------------------------- */
function initStarRotation() {
  const stars = document.querySelectorAll('.star-icon');
  if (!stars.length) return;

  let currentRotation = 0;
  let lastScrollY = window.scrollY;
  let targetSpeed = 0.5;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    targetSpeed = 0.5 + Math.min(delta * 0.2, 8);
    lastScrollY = window.scrollY;
  }, { passive: true });

  function animate() {
    currentRotation = (currentRotation + targetSpeed) % 360;
    targetSpeed += (0.5 - targetSpeed) * 0.05; // smooth friction back to idle
    stars.forEach(star => {
      star.style.transform = `rotate(${currentRotation}deg)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. Custom Glowing Cursor & Trailing Light Path
   -------------------------------------------------------------------------- */
function initDrawPathCursorEffect() {
  const dot = document.querySelector('[data-cursor-dot]');
  const canvas = document.querySelector('[data-cursor-canvas]');
  if (!dot || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -100, y: -100 };
  const points = [];
  const maxPoints = 24;

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    dot.style.left = `${mouse.x}px`;
    dot.style.top = `${mouse.y}px`;
    points.push({ x: mouse.x, y: mouse.y, age: 0 });
  });

  // Scale dot on interactive hover
  const interactives = document.querySelectorAll('a, button, .project-card, .skill-pill');
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(2.6)';
      dot.style.backgroundColor = '#E7E1D7';
    });
    item.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      dot.style.backgroundColor = '#F34213';
    });
  });

  function renderTrail() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      points[i].age++;
    }
    while (points.length && points[0].age > maxPoints) {
      points.shift();
    }

    if (points.length > 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.strokeStyle = 'rgba(243, 66, 19, 0.45)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#F34213';
      ctx.shadowBlur = 12;
      ctx.stroke();
    }

    requestAnimationFrame(renderTrail);
  }
  renderTrail();
}

/* --------------------------------------------------------------------------
   4. Parallax Depth on Hero Portrait
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const heroWrapper = document.querySelector('.hero-image-wrapper');
  if (!heroWrapper) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
  });

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const scale = 1 + scrolled * 0.0003;
      const opacity = 1 - scrolled * 0.0012;
      heroWrapper.style.opacity = Math.max(0, opacity);
      heroWrapper.style.transform = `translate3d(${currentX}px, ${scrolled * 0.25 + currentY}px, 0) scale(${scale})`;
    }
  }, { passive: true });

  function tick() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    if (window.scrollY < window.innerHeight) {
      const scrolled = window.scrollY;
      const scale = 1 + scrolled * 0.0003;
      heroWrapper.style.transform = `translate3d(${currentX}px, ${scrolled * 0.25 + currentY}px, 0) scale(${scale})`;
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* --------------------------------------------------------------------------
   5. Interactive Infinite Marquee with Scroll Direction Reaction
   -------------------------------------------------------------------------- */
function initMarqueeScroll() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  let lastY = window.scrollY;
  let direction = 1; // 1 = forward (left), -1 = reverse (right)
  let baseSpeed = 1.2;
  let boost = 0;
  let position = 0;

  window.addEventListener('scroll', () => {
    const diff = window.scrollY - lastY;
    if (Math.abs(diff) > 1) {
      direction = diff > 0 ? 1 : -1;
      boost = Math.min(Math.abs(diff) * 0.2, 12);
    }
    lastY = window.scrollY;
  }, { passive: true });

  // Clone marquee content to make it seamless
  const original = track.innerHTML;
  track.innerHTML = original + original + original;

  function loop() {
    boost += (0 - boost) * 0.06;
    const speed = (baseSpeed + boost) * direction;
    position += speed;

    const singleWidth = track.scrollWidth / 3;
    if (position >= singleWidth) position -= singleWidth;
    if (position <= 0) position += singleWidth;

    track.style.transform = `translate3d(-${position}px, 0, 0)`;
    requestAnimationFrame(loop);
  }
  // Disable default CSS animation when JS loop takes over
  track.style.animation = 'none';
  loop();
}

/* --------------------------------------------------------------------------
   6. Three.js: 3D Electromagnetic Torus / Antenna Wave Visualizer in Footer
   -------------------------------------------------------------------------- */
function initThreeElectromagneticSphere() {
  const container = document.getElementById('footer-three-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Outer Torus radiation pattern
  const torusGeo = new THREE.TorusGeometry(8, 2.5, 18, 50);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xF34213,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torus);

  // Inner Monopole Antenna Core (Cone)
  const coneGeo = new THREE.ConeGeometry(2, 6, 16, 2, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xE7E1D7,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = -1;
  scene.add(cone);

  // Ground plane grid disc
  const discGeo = new THREE.CircleGeometry(6, 24);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0xF34213,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = Math.PI / 2;
  disc.position.y = -4;
  scene.add(disc);

  // Mouse interaction
  let targetRotX = 0.4;
  let targetRotY = 0.2;
  window.addEventListener('mousemove', e => {
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 1.5;
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 1.5;
  });

  function animate() {
    torus.rotation.x += (targetRotX - torus.rotation.x) * 0.05 + 0.003;
    torus.rotation.y += (targetRotY - torus.rotation.y) * 0.05 + 0.006;
    torus.rotation.z += 0.002;

    cone.rotation.y -= 0.008;
    disc.rotation.z += 0.004;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Project Inspection Modal
   -------------------------------------------------------------------------- */
const projectData = {
  '5g-patch': {
    title: 'Star-Shaped Monopole Patch Antenna for 5G mmWave',
    subtitle: 'High-Frequency Electromagnetic Simulation (30 GHz)',
    tool: 'CST Studio Suite',
    category: '5G mmWave / Microstrip Patch Design',
    img: 'project-5g-patch.jpg',
    specs: [
      { label: 'Center Frequency', val: '30 GHz' },
      { label: 'Return Loss (S11)', val: '-22.61 dB' },
      { label: 'VSWR', val: '1.16' },
      { label: 'Bandwidth', val: '4.26 GHz (27.74–32 GHz)' },
      { label: 'Peak Realized Gain', val: '4.36 dBi' },
      { label: 'Substrate', val: 'Rogers RT/duroid 5880' }
    ],
    description: `
      <p>Designed and simulated a compact star-shaped monopole patch antenna using <strong>CST Studio Suite</strong> specifically optimized for 5G mmWave wireless front-ends operating at <strong>30 GHz</strong>.</p>
      <br>
      <p><strong>Key Technical Highlights:</strong></p>
      <ul style="padding-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-muted);">
        <li>Engineered star-shaped geometrical perturbations to induce multi-resonant surface current modes, broadening impedance matching bandwidth by 4.26 GHz.</li>
        <li>Achieved remarkable return loss of <strong>S11 = -22.61 dB</strong> with Voltage Standing Wave Ratio of <strong>VSWR = 1.16</strong> at 30 GHz, ensuring near-zero reflection loss.</li>
        <li>Characterized complete 3D far-field radiation patterns, E-plane / H-plane co-polarization, cross-polarization discrimination, and radiation efficiency in CST Microwave Studio.</li>
        <li>Evaluated dielectric loss tangents and microstrip feedline matching for reliable fabrication on high-frequency laminates.</li>
      </ul>
    `
  },
  'monopole-dlrl': {
    title: 'Design of Monopole Antenna & Study of L/D Ratio',
    subtitle: 'Summer Internship Research at DLRL (DRDO), Hyderabad',
    tool: 'CST Studio Suite',
    category: 'Defence R&D / Conical Monopole',
    img: 'project-monopole-dlrl.jpg',
    specs: [
      { label: 'Frequency Band', val: '1 – 3 GHz' },
      { label: 'Return Loss (S11)', val: '-17 dB' },
      { label: 'VSWR Target', val: '≤ 2.5:1' },
      { label: 'Peak Directivity', val: '~3.0 dBi' },
      { label: 'Organization', val: 'DLRL Hyderabad' },
      { label: 'Geometry', val: 'Conical Monopole' }
    ],
    description: `
      <p>Completed intensive research during Summer Internship in the <strong>Antenna Division at Defence Electronics Research Laboratory (DLRL, DRDO)</strong>, Hyderabad.</p>
      <br>
      <p><strong>Key Technical Highlights:</strong></p>
      <ul style="padding-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-muted);">
        <li>Designed and simulated a conical broadband monopole antenna using <strong>CST Studio Suite</strong> to systematically investigate the effect of Length-to-Diameter (L/D) ratios on impedance bandwidth.</li>
        <li>Demonstrated that optimal conical flaring creates a gradual characteristic impedance taper, significantly smoothing capacitive reactance at the feed.</li>
        <li>Achieved continuous operation from <strong>1 to 3 GHz</strong> with <strong>S11 = -17 dB</strong> and <strong>VSWR ≤ 2.5:1</strong> across the entire bandwidth.</li>
        <li>Extracted radiation patterns showing omnidirectional toroidal coverage in the azimuth plane with consistent peak gain of ~3 dBi.</li>
      </ul>
    `
  },
  'smart-factory': {
    title: 'Smart Factory Monitoring System',
    subtitle: 'Industrial IoT Telemetry & Predictive Maintenance',
    tool: 'Arduino UNO • MQTT • ThingsBoard',
    category: 'Industrial IoT / Cloud Telemetry',
    img: 'project-smart-factory.jpg',
    specs: [
      { label: 'Microcontroller', val: 'Arduino UNO / ESP8266' },
      { label: 'Protocol', val: 'MQTT Broker' },
      { label: 'Cloud Platform', val: 'ThingsBoard IoT' },
      { label: 'Telemetry', val: 'Vibration & Thermal' },
      { label: 'Automation', val: 'Relay-based Trip' },
      { label: 'Latency', val: '< 120 ms' }
    ],
    description: `
      <p>Engineered an end-to-end IoT industrial monitoring and telemetry architecture utilizing <strong>Arduino UNO</strong>, <strong>MQTT lightweight protocol</strong>, and <strong>ThingsBoard Cloud</strong> dashboard.</p>
      <br>
      <p><strong>Key Technical Highlights:</strong></p>
      <ul style="padding-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-muted);">
        <li>Interfaced real-time vibration, temperature, current, and environmental telemetry sensors to continuously monitor machinery health.</li>
        <li>Transmitted high-frequency telemetry over publish-subscribe MQTT brokers to cloud-hosted dashboards for real-time visualization.</li>
        <li>Implemented autonomous threshold logic and relay-based emergency shutdown circuits for immediate hardware fault isolation.</li>
      </ul>
    `
  },
  'uav-telemetry': {
    title: 'Unmanned Aerial Vehicles (UAV) Telemetry & Avionics',
    subtitle: 'C-DAC Certified Bootcamp (Grade A)',
    tool: 'C-DAC Bootcamp • RF Communication',
    category: 'Aerospace & RF Telemetry',
    img: 'project-uav-telemetry.jpg',
    specs: [
      { label: 'Certification', val: 'C-DAC Grade A' },
      { label: 'Link Type', val: 'Bidirectional RF Link' },
      { label: 'Flight Control', val: 'Avionics & Gyro Fusion' },
      { label: 'Telemetry', val: 'Barometric & GPS' },
      { label: 'Integration', val: 'IoT Mission Planner' },
      { label: 'Range Band', val: 'ISM 2.4 / 5.8 GHz' }
    ],
    description: `
      <p>Graduated with <strong>Grade A</strong> honors from the intensive <strong>C-DAC Unmanned Aerial Vehicles (UAV) Bootcamp</strong>.</p>
      <br>
      <p><strong>Key Technical Highlights:</strong></p>
      <ul style="padding-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-muted);">
        <li>Gained hands-on proficiency in UAV frame aerodynamics, electronic speed controllers (ESC), brushless DC motors, and flight controllers.</li>
        <li>Analyzed RF transceiver links, line-of-sight propagation, antenna placement to avoid fuselage shadowing, and telemetry data-link integrity.</li>
        <li>Configured fail-safe return-to-launch (RTL) protocols triggered on RSSI signal degradation and telemetry timeouts.</li>
      </ul>
    `
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalTool = document.getElementById('modal-tool');
  const modalImg = document.getElementById('modal-img');
  const modalSpecs = document.getElementById('modal-specs');
  const modalBody = document.getElementById('modal-body');

  if (!modal) return;

  document.querySelectorAll('[data-project-key]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-project-key');
      const item = projectData[key];
      if (!item) return;

      modalTitle.textContent = item.title;
      modalSubtitle.textContent = item.subtitle;
      modalTool.textContent = item.tool;
      modalImg.src = item.img;
      modalImg.alt = item.title;

      modalSpecs.innerHTML = item.specs.map(s => `
        <div class="metric-box">
          <div class="metric-val">${s.val}</div>
          <div class="metric-label">${s.label}</div>
        </div>
      `).join('');

      modalBody.innerHTML = item.description;

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* --------------------------------------------------------------------------
   8. Navigation Reveal & Active Highlighting on Scroll
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > 120 && currentY > lastY) {
      // scrolling down - subtle translate
      nav.style.transform = 'translateY(-15px)';
      nav.style.opacity = '0.85';
    } else {
      // scrolling up
      nav.style.transform = 'translateY(0)';
      nav.style.opacity = '1';
    }
    lastY = currentY;
  }, { passive: true });
}
