// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

/* ─── Google Fonts injection ─── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const matLink = document.createElement("link");
matLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
matLink.rel = "stylesheet";
document.head.appendChild(matLink);

/* ─── Three.js CDN script injection ─── */
function loadScript(src) {
  return new Promise((res) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    document.head.appendChild(s);
  });
}

/* Global CSS scoped to body.radia-home-active so the neon theme does not leak
   into /privacy or /terms (which keep the original Tailwind theme). */
const GLOBAL_CSS = `
  :root {
    --bg-void:#010D08; --bg-deep:#021409; --bg-surface:#041D0E;
    --bg-card:rgba(6,40,20,0.6);
    --green-primary:#00A86B; --green-bright:#00FF88;
    --green-lime:#39FF14; --green-forest:#2D6A4F;
    --green-sage:#52B788; --green-teal:#00C9A7;
    --bright-dim:rgba(0,255,136,0.15); --bright-mid:rgba(0,255,136,0.4);
    --white:#EDFFF5; --muted:#5A8A6E;
    --border:rgba(0,255,136,0.12);
    --glow-strong:0 0 40px rgba(0,255,136,0.35),0 0 80px rgba(0,168,107,0.2);
    --glow-soft:0 0 20px rgba(0,255,136,0.15);
    --font-display:'Orbitron',monospace;
    --font-body:'Sora',sans-serif;
    --font-mono:'JetBrains Mono',monospace;
  }
  body.radia-home-active{background:var(--bg-void);color:var(--white);font-family:var(--font-body);overflow-x:hidden;cursor:none}
  body.radia-home-active ::selection{background:var(--bright-dim);color:var(--green-bright)}
  body.radia-home-active ::-webkit-scrollbar{width:4px}
  body.radia-home-active ::-webkit-scrollbar-track{background:var(--bg-void)}
  body.radia-home-active ::-webkit-scrollbar-thumb{background:var(--bright-mid);border-radius:2px}

  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
  @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-24px) rotate(3deg)}}
  @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.2)}50%{box-shadow:0 0 60px rgba(0,255,136,0.5),0 0 100px rgba(0,168,107,0.3)}}
  @keyframes scanline{0%{transform:translateY(-100%);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(100vh);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ring-pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:0.6}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}
  @keyframes data-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  .radia-cursor{position:fixed;width:20px;height:20px;border:2px solid var(--green-bright);border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.15s ease,opacity 0.15s ease;mix-blend-mode:difference}
  .radia-cursor.active{transform:scale(2.5);opacity:0.5}
  .radia-cursor-dot{position:fixed;width:5px;height:5px;background:var(--green-bright);border-radius:50%;pointer-events:none;z-index:9999;box-shadow:0 0 8px var(--green-bright)}

  .noise-overlay{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:1;opacity:0.4}

  .animate-on-scroll{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
  .animate-on-scroll.visible{opacity:1;transform:translateY(0)}

  .chat-messages-scroll::-webkit-scrollbar{width:3px}
  .chat-messages-scroll::-webkit-scrollbar-thumb{background:var(--bright-mid);border-radius:2px}
`;

/* ─── DATA ─── */
const CHAT_RESPONSES = {
  default: {
    a: "That's a great radiology question! For any projection, the key principles are: correct patient positioning, accurate CR direction, adequate collimation, and appropriate exposure technique. Would you like specifics on a particular view?",
    citation: "Bontrager & Lampignano · Textbook of Radiographic Positioning",
  },
  "pa chest": {
    a: "For a <strong>PA Chest projection</strong>: Patient stands facing the IR, chin rested on top, shoulders rolled forward to clear scapulae from lung fields. CR is directed horizontally to T7 level. Exposure on <strong>full inspiration</strong>. 10 posterior ribs should be visible on a diagnostic image.",
    citation: "Merrill's Atlas of Radiographic Positions · Vol. 1, Ch. 10",
  },
  scaphoid: {
    a: "Scaphoid fractures are notoriously occult on standard PA wrist views. The dedicated <strong>scaphoid series</strong> includes: PA with ulnar deviation, lateral, PA oblique, and the Stecher view (PA with CR angled 20° proximally). MRI remains gold standard if X-ray is negative with clinical suspicion.",
    citation: "Bontrager · 9th Ed. Ch. 4 · ACR Appropriateness Criteria 2023",
  },
  opg: {
    a: "OPG (Orthopantomogram) positioning criteria: Patient stands/sits with Frankfort Plane horizontal, midsagittal plane vertical, tongue on palate, teeth in occlusion in the bite block. Spine should not be superimposed on the anterior teeth. Ghost shadows of the spine indicate incorrect positioning.",
    citation: "White & Pharoah · Oral Radiology · 7th Ed. Ch. 8",
  },
};

const TICKER_ITEMS = [
  "Real-time AI Positioning Analysis",
  "3D Skeletal Overlay Guidance",
  "Instant Clinical Doubt Resolution",
  "Evidence-Based Citation Engine",
  "50,000+ Active Radiology Students",
  "80% Positioning Accuracy Rate",
  "68% Reduction in X-ray Retakes",
];

const STATS = [
  { target: 50000, label: "Radiology students\nactively using Radia" },
  { target: 80, label: "Positioning accuracy\nrate (% correct)" },
  { target: 68, label: "Reduction in X-ray\nretakes (% avg)" },
  { target: 120, label: "Radiographic positions\ncovered in the app" },
];

const STEPS = [
  { num: "01 / CAPTURE", icon: "📱", title: "Point Your Camera", desc: "Open Radia and point your phone camera at the patient or positioning phantom. Our AI activates instantly with no setup or calibration required." },
  { num: "02 / ANALYZE", icon: "🧠", title: "AI Reads the Position", desc: "Our deep learning model maps 120+ skeletal landmarks in real-time, comparing your positioning against thousands of validated radiographic standards." },
  { num: "03 / CORRECT", icon: "✅", title: "Get Live Corrections", desc: "See holographic overlays with precise angle corrections, rotation guidance, and positioning scores, all in real-time before you take the X-ray." },
];

const FEATURES = [
  { icon: "🎯", title: "Real-Time AI Positioning Correction", desc: "The centerpiece of Radia: live camera analysis that corrects patient positioning before you press the exposure button, reducing retakes by 68% on average. Our model tracks 122 anatomical landmarks at 30fps.", featured: true },
  { icon: "🤖", title: "AI Radiology Tutor", desc: "Powered by a medical-grade LLM fine-tuned on 10M+ radiology texts. Ask anything, get cited answers instantly." },
  { icon: "🦴", title: "3D Skeletal Mapping", desc: "Holographic 3D bone overlays projected live onto your camera feed, showing exactly what the X-ray beam will capture." },
  { icon: "📊", title: "Positioning Score Tracker", desc: "AI grades every positioning attempt with a 0–100 score and logs improvement over sessions for student growth visibility." },
  { icon: "📖", title: "120+ Position Library", desc: "Complete step-by-step guides for every standard radiographic position, from chest PA to complex trauma obliques." },
  { icon: "🏥", title: "Clinical Protocol Engine", desc: "Access DRLs, kVp/mAs guides, and clinical decision trees for each body part, approved and periodically updated." },
  { icon: "🧪", title: "Anatomy Quiz Mode", desc: "Interactive quizzes on skeletal anatomy, X-ray labeling, and pathology identification, AI-adaptive to your gaps." },
  { icon: "🔒", title: "HIPAA-Compliant & Secure", desc: "All AI processing is on-device or fully encrypted end-to-end. No patient data ever stored on our servers." },
];

const EDU_METRICS = [
  { val: "↓ 68%", label: "Average repeat exposure rate" },
  { val: "↑ 31%", label: "Practical assessment scores" },
  { val: "↑ 94%", label: "Student confidence rating" },
  { val: "4.9/5", label: "Educator satisfaction score" },
];

/* ─── Hooks ─── */
function useIntersection(ref, options) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);
  return visible;
}

function useAnimatedCounter(target, visible) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);

  if (target >= 10000) return Math.floor(value / 1000) + "K+";
  if (target === 80 || target === 68) return value + "%";
  return value + "+";
}

/* ─── Sub-components ─── */

function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 2.5 + "px";
        dotRef.current.style.top = e.clientY - 2.5 + "px";
      }
    };
    document.addEventListener("mousemove", onMove);
    let raf;
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.12;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = posRef.current.x - 10 + "px";
        cursorRef.current.style.top = posRef.current.y - 10 + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    const onEnter = () => cursorRef.current?.classList.add("active");
    const onLeave = () => cursorRef.current?.classList.remove("active");
    document.querySelectorAll("a,button,.step-card,.feature-card").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="radia-cursor" />
      <div ref={dotRef} className="radia-cursor-dot" />
    </>
  );
}

/* ─── Neon Navbar (home only, uses react-router Link) ─── */
function NeonNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    padding: scrolled ? "12px 0" : "18px 0",
    background: scrolled ? "rgba(1,13,8,0.95)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid var(--border)" : "none",
    transition: "all 0.4s ease",
  };

  const scrollTo = (anchor) => {
    setMenuOpen(false);
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = ["How It Works", "Live AI", "AI Tutor", "Features", "For Educators"];
  const navAnchors = ["#how-it-works", "#live-ai", "#ai-tutor", "#features", "#educators"];

  return (
    <nav style={navStyle} aria-label="Main navigation">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="Radia Logo" style={{ height: 36, width: "auto", objectFit: "contain" }}
            onError={(e) => { e.currentTarget.style.display = "none"; const next = e.currentTarget.nextSibling; if (next) next.style.display = "flex"; }}
          />
          <div style={{ display: "none", width: 36, height: 36, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", borderRadius: 10, alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 900, color: "var(--bg-void)", boxShadow: "0 0 20px rgba(0,255,136,0.3)" }}>Rx</div>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="radia-desktop-nav">
          {navLinks.map((label, i) => (
            <li key={label}>
              <a href={navAnchors[i]} onClick={(e) => { e.preventDefault(); scrollTo(navAnchors[i]); }}
                style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/privacy"
              style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/terms"
              style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
              Terms
            </Link>
          </li>
          <li>
            <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download
              style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", color: "var(--bg-void)", padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "0.72rem", letterSpacing: "0.05em", textDecoration: "none", boxShadow: "0 0 20px rgba(0,255,136,0.3)", transition: "all 0.3s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l14 8.5c.5.3.5 1.2 0 1.5l-14 8.5c-.5.3-1.5.3-1.5-.5z"/>
              </svg>
              Download APK
            </a>
          </li>
        </ul>

        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 5 }}
          className="radia-hamburger">
          {[0, 1, 2].map((i) => <span key={i} style={{ display: "block", width: 24, height: 2, background: "var(--green-bright)", borderRadius: 1 }} />)}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(2,20,9,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "20px 24px" }}>
          {navLinks.map((label, i) => (
            <a key={label} href={navAnchors[i]} onClick={(e) => { e.preventDefault(); scrollTo(navAnchors[i]); setMenuOpen(false); }}
              style={{ display: "block", padding: "12px 0", color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
              {label}
            </a>
          ))}
          <Link to="/privacy" onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 0", color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
            Privacy Policy
          </Link>
          <Link to="/terms" onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 0", color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
            Terms of Service
          </Link>
          <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download
            style={{ display: "block", padding: "12px 0", color: "var(--green-bright)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
            Download APK
          </a>
        </div>
      )}

      <style>{`
        @media(max-width:900px){.radia-desktop-nav{display:none!important}.radia-hamburger{display:flex!important}}
      `}</style>
    </nav>
  );
}

function HeroCanvas() {
  const canvasRef = useRef(null);
  const [threeReady, setThreeReady] = useState(false);

  useEffect(() => {
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js").then(() => setThreeReady(true));
  }, []);

  useEffect(() => {
    if (!threeReady || !window.THREE) return;
    const THREE = window.THREE;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 80);

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 60;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 30;
      const v = Math.floor(Math.random() * 4);
      if (v === 0) { colors[i*3]=0; colors[i*3+1]=1; colors[i*3+2]=0.53; }
      else if (v === 1) { colors[i*3]=0.22; colors[i*3+1]=1; colors[i*3+2]=0.08; }
      else if (v === 2) { colors[i*3]=0; colors[i*3+1]=0.79; colors[i*3+2]=0.65; }
      else { colors[i*3]=0.18; colors[i*3+1]=0.42; colors[i*3+2]=0.31; }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.4, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true }));
    scene.add(particles);

    const skeletonGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.35 });
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.7 });
    const mkLine = (pts) => { const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p))); return new THREE.Line(g, lineMat); };
    const mkDot = (x, y, z, r = 0.6) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), dotMat); m.position.set(x, y, z); return m; };
    const S = 3.2;
    skeletonGroup.add(mkLine([[0,10*S,0],[0,0,0],[0,-5*S,0]]));
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5*S*0.32,12,12), new THREE.MeshBasicMaterial({color:0x00FF88,wireframe:true,transparent:true,opacity:0.2}));
    headMesh.position.set(0,11.5*S*0.32,0); skeletonGroup.add(headMesh);
    skeletonGroup.add(mkLine([[-9*S*0.32,8*S*0.32,0],[9*S*0.32,8*S*0.32,0]]));
    skeletonGroup.add(mkLine([[-9*S*0.32,8*S*0.32,0],[-11*S*0.32,0,0]]));
    skeletonGroup.add(mkLine([[9*S*0.32,8*S*0.32,0],[11*S*0.32,0,0]]));
    skeletonGroup.add(mkLine([[-11*S*0.32,0,0],[-10*S*0.32,-7*S*0.32,0]]));
    skeletonGroup.add(mkLine([[11*S*0.32,0,0],[10*S*0.32,-7*S*0.32,0]]));
    const pelvis = new THREE.Mesh(new THREE.TorusGeometry(5*S*0.32,0.3,6,20), new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:0.2}));
    pelvis.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI/2));
    pelvis.position.set(0,-5*S*0.32,0); skeletonGroup.add(pelvis);
    skeletonGroup.add(mkLine([[-4*S*0.32,-5*S*0.32,0],[-5*S*0.32,-14*S*0.32,0]]));
    skeletonGroup.add(mkLine([[4*S*0.32,-5*S*0.32,0],[5*S*0.32,-14*S*0.32,0]]));
    skeletonGroup.add(mkLine([[-5*S*0.32,-14*S*0.32,0],[-4.5*S*0.32,-22*S*0.32,0]]));
    skeletonGroup.add(mkLine([[5*S*0.32,-14*S*0.32,0],[4.5*S*0.32,-22*S*0.32,0]]));
    [[0,11.5*S*0.32,0],[0,8*S*0.32,0],[0,4*S*0.32,0],[0,0,0],[-9*S*0.32,8*S*0.32,0],[9*S*0.32,8*S*0.32,0],[-5*S*0.32,-14*S*0.32,0],[5*S*0.32,-14*S*0.32,0]].forEach(p=>skeletonGroup.add(mkDot(...p)));
    skeletonGroup.position.set(18,0,0); scene.add(skeletonGroup);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(14,0.1,6,60), new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:0.15}));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(20,0.08,6,60), new THREE.MeshBasicMaterial({color:0x00A86B,transparent:true,opacity:0.1}));
    ring1.position.set(18,0,0); ring2.position.set(18,0,0); scene.add(ring1,ring2);

    let t = 0, rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.005;
      skeletonGroup.rotation.y = t*0.3;
      ring1.rotation.z = t*0.5; ring2.rotation.z = -t*0.3;
      ring1.rotation.x = Math.sin(t*0.4)*0.2; ring2.rotation.x = Math.cos(t*0.3)*0.15;
      particles.rotation.y = t*0.04; particles.rotation.x = t*0.02;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); };
    window.addEventListener("resize", onResize);
    const onMouse = (e) => { const mx=(e.clientX/window.innerWidth-0.5)*10; const my=(e.clientY/window.innerHeight-0.5)*-8; camera.position.x+=(mx-camera.position.x)*0.04; camera.position.y+=(my-camera.position.y)*0.04; };
    document.addEventListener("mousemove", onMouse);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize",onResize); document.removeEventListener("mousemove",onMouse); renderer.dispose(); };
  }, [threeReady]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} aria-hidden="true" />;
}

function AnimatedCounter({ target, label }) {
  const ref = useRef(null);
  const visible = useIntersection(ref, { threshold: 0.5 });
  const value = useAnimatedCounter(target, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 900, color: "var(--green-bright)", letterSpacing: "-0.02em", textShadow: "0 0 30px rgba(0,255,136,0.4)" }}>{value}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-line" }}>{label}</div>
    </div>
  );
}

function ScrollReveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useIntersection(ref, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
  return (
    <div ref={ref} className={`animate-on-scroll${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function ChatSection() {
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello! I'm your AI Radiology Tutor. Ask me anything about radiographic positioning, anatomy, pathology, or clinical protocols, and I'll give you cited, expert answers instantly. 🩻", citation: null },
    { type: "user", text: "What is the correct CR angle for a lateral knee projection?", citation: null },
    { type: "ai", text: "For a <strong>lateral knee projection</strong>, the central ray is directed <strong>perpendicular to the IR</strong> (0° angle) with the patient in a true lateral position. The knee should be flexed 20–30°, with the IR placed at the level of the knee joint.<div style='margin-top:8px;font-size:0.75rem;color:var(--green-bright)'>Key landmark: Medial femoral condyle should project 5mm posterior to lateral condyle.</div>", citation: "Bontrager's Handbook · 9th Ed. · Ch. 6, p.212" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = useCallback((text) => {
    const val = (text || input).trim();
    if (!val) return;
    setInput("");
    setMessages((m) => [...m, { type: "user", text: val, citation: null }]);
    setTyping(true);
    const key = val.toLowerCase();
    let response = CHAT_RESPONSES.default;
    for (const [k, v] of Object.entries(CHAT_RESPONSES)) {
      if (k !== "default" && key.includes(k)) { response = v; break; }
    }
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { type: "ai", text: response.a, citation: response.citation }]);
    }, 1200);
  }, [input]);

  const MsgAvatar = ({ type }) => (
    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, background: type === "ai" ? "linear-gradient(135deg,var(--green-primary),var(--green-bright))" : "rgba(255,255,255,0.1)", color: type === "ai" ? "var(--bg-void)" : "var(--muted)", fontFamily: type === "ai" ? "var(--font-display)" : "inherit" }}>
      {type === "ai" ? "Rx" : "You"}
    </div>
  );

  return (
    <section id="ai-tutor" style={{ padding: "100px 0", background: "linear-gradient(180deg,var(--bg-void),rgba(0,255,136,0.03),var(--bg-void))" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <ScrollReveal style={{ textAlign: "center", marginBottom: 70 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8 }}>AI Intelligence</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Meet Your AI <span style={{ color: "var(--green-bright)" }}>Radiology Tutor</span></h2>
          <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Ask anything. Get cited, visual, expert-level answers instantly on anatomy, positioning, pathology, and clinical protocols.</p>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="radia-chat-grid">
          <ScrollReveal>
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.4)", animation: "float 5.5s 1s ease-in-out infinite" }}>
              <div style={{ padding: "16px 20px", background: "rgba(0,255,136,0.04)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.65rem", fontWeight: 700, color: "var(--bg-void)", boxShadow: "0 0 16px rgba(0,255,136,0.3)" }}>Rx</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, color: "var(--white)" }}>Radia AI Tutor</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--green-bright)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 5, height: 5, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 6px var(--green-bright)", display: "inline-block" }} />
                    Online · Responds instantly
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>GPT-4 + Med-RAG</div>
              </div>
              <div className="chat-messages-scroll" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 280, maxHeight: 340, overflowY: "auto" }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: msg.type === "user" ? "row-reverse" : "row" }}>
                    <MsgAvatar type={msg.type} />
                    <div style={{ maxWidth: "75%", padding: "11px 14px", borderRadius: 16, fontSize: "0.8rem", lineHeight: 1.55, background: msg.type === "ai" ? "rgba(0,168,107,0.12)" : "rgba(0,255,136,0.08)", border: msg.type === "ai" ? "1px solid rgba(0,168,107,0.25)" : "1px solid rgba(0,255,136,0.2)", color: "var(--white)", borderBottomLeftRadius: msg.type === "ai" ? 4 : 16, borderBottomRightRadius: msg.type === "user" ? 4 : 16 }}>
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                      {msg.citation && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, padding: "5px 8px", background: "rgba(0,255,136,0.06)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--green-bright)" }}>📚 {msg.citation}</div>}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <MsgAvatar type="ai" />
                    <div style={{ padding: "11px 14px", borderRadius: 16, background: "rgba(0,168,107,0.12)", border: "1px solid rgba(0,168,107,0.25)", display: "flex", gap: 5, alignItems: "center" }}>
                      {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 6, height: 6, background: "var(--green-bright)", borderRadius: "50%", display: "inline-block", animation: `blink 0.8s ${d}s infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ padding: "0 20px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["PA Chest position?", "Scaphoid fracture views", "OPG criteria"].map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} style={{ padding: "5px 10px", background: "rgba(0,168,107,0.08)", border: "1px solid rgba(0,168,107,0.2)", borderRadius: 100, fontSize: "0.68rem", color: "var(--muted)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.3s", fontFamily: "inherit" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--green-bright)"; e.currentTarget.style.color = "var(--green-bright)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,168,107,0.2)"; e.currentTarget.style.color = "var(--muted)"; }}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask any radiology question..." aria-label="Type your radiology question"
                  style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: "0.8rem", outline: "none" }} />
                <button onClick={() => sendMessage()} aria-label="Send"
                  style={{ width: 40, height: 40, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8, marginBottom: 12 }}>Capabilities</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.2 }}>Your 24/7 Clinical<br /><span style={{ color: "var(--green-bright)" }}>Knowledge Engine</span></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📚", title: "Evidence-Based Citations", desc: "Every answer comes with citations from Bontrager, Merrill's, and peer-reviewed radiology journals, so you learn, not just get answers." },
                { icon: "🔬", title: "Visual Explanations", desc: "AI generates labeled anatomical diagrams, projection charts, and 3D structure maps right inside the chat to reinforce concepts visually." },
                { icon: "⚡", title: "Instant. Always On.", desc: "No waiting for a professor or senior. Ask at 2am during exam prep and get a clinically accurate response in under 3 seconds." },
                { icon: "🎯", title: "Adaptive Learning Path", desc: "Radia tracks your weak areas and proactively quizzes you on positions, anatomy, and pathology to close knowledge gaps before exams." },
              ].map((c) => (
                <div key={c.title} style={{ padding: "20px 24px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", gap: 16, alignItems: "flex-start", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,168,107,0.2),rgba(0,255,136,0.1))", border: "1px solid rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, marginBottom: 4, letterSpacing: "0.03em" }}>{c.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
      <style>{`@media(max-width:900px){.radia-chat-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─── HomePage ─── */
function HomePage() {
  const [showBackTop, setShowBackTop] = useState(false);
  const [heroParallax, setHeroParallax] = useState({ y: 0, opacity: 1 });

  useEffect(() => {
    let style = document.getElementById("radia-global-css");
    let injected = false;
    if (!style) {
      style = document.createElement("style");
      style.id = "radia-global-css";
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
      injected = true;
    }
    document.body.classList.add("radia-home-active");
    return () => {
      document.body.classList.remove("radia-home-active");
      if (injected) style?.remove();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY;
      setShowBackTop(s > 60);
      setHeroParallax({ y: s * 0.3, opacity: Math.max(0, 1 - s / 700) });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div style={{ background: "var(--bg-void)", color: "var(--white)", fontFamily: "var(--font-body)", overflowX: "hidden", minHeight: "100vh" }}>
      <div className="noise-overlay" />
      <CustomCursor />

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
        style={{ position: "fixed", bottom: 32, right: 32, width: 44, height: 44, background: "rgba(6,40,20,0.9)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 100, opacity: showBackTop ? 1 : 0, pointerEvents: showBackTop ? "all" : "none", transition: "all 0.3s", color: "var(--green-bright)", fontSize: "1.1rem", backdropFilter: "blur(10px)" }}>↑</button>

      <NeonNavbar />

      {/* HERO */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <HeroCanvas />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 1, maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--green-bright),transparent)", animation: "scanline 6s linear infinite", zIndex: 2, opacity: 0.4 }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 60, transform: `translateY(${heroParallax.y}px)`, opacity: heroParallax.opacity, transition: "none" }} className="radia-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 100, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--green-bright)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 28, animation: "fadeInUp 0.8s ease forwards" }}>
              <span style={{ width: 6, height: 6, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 8px var(--green-bright)", animation: "blink 2s ease infinite" }} />
              AI-POWERED RADIOLOGY PLATFORM
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20, animation: "fadeInUp 0.8s 0.15s ease both" }}>
              Master Radiology<br />with <span style={{ background: "linear-gradient(135deg,var(--green-bright),var(--green-lime),var(--green-teal),var(--green-bright))", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }}>AI Intelligence</span><br />Live. Correct. Learn.
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 460, marginBottom: 40, animation: "fadeInUp 0.8s 0.3s ease both" }}>
              <strong style={{ color: "var(--white)" }}>Real-time AI positioning correction, instant doubt resolution,</strong> and an AI tutor that never sleeps. Built exclusively for radiology students and professionals.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, animation: "fadeInUp 0.8s 0.35s ease both", flexWrap: "wrap" }}>
              {[["50K+", "Students"], ["80%", "Accuracy"]].map(([num, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 100 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--green-bright)" }}>{num}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 48, animation: "fadeInUp 0.8s 0.45s ease both" }}>
              <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", color: "var(--bg-void)", fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(0,255,136,0.3),0 8px 32px rgba(0,168,107,0.3)", animation: "pulse-glow 3s ease infinite", position: "relative", overflow: "hidden" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 16l4-4h-3V4h-2v8H8l4 4zm9 4H3v-2h18v2z"/>
                </svg>
                Download APK
              </a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo("#how-it-works"); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", background: "transparent", color: "var(--white)", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none", borderRadius: 12, border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--green-bright)"; e.currentTarget.style.color = "var(--green-bright)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--white)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                See How It Works
              </a>
            </div>

            <div style={{ animation: "fadeInUp 0.8s 0.6s ease both" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 14 }}>TRUSTED BY STUDENTS FROM</p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                {["AIIMS Delhi", "KMC Manipal", "PGIMER", "CMC Vellore", "JIPMER"].map((name) => (
                  <div key={name} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{name}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeInUp 0.8s 0.3s ease both" }}>
            <div style={{ position: "relative", animation: "floatSlow 6s ease-in-out infinite" }}>
              {[300, 420, 540].map((size, i) => (
                <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(0,255,136,0.2)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `ring-pulse 3s ${i}s ease infinite` }} />
              ))}
              {[
                { style: { top: "10%", left: "-30%" }, label: "POSITIONING", value: "OPTIMAL ✓", anim: "float 4s 0s ease-in-out infinite" },
                { style: { top: "50%", right: "-25%" }, label: "AI CONFIDENCE", value: "97.4%", anim: "float 4s 1.5s ease-in-out infinite" },
                { style: { bottom: "15%", left: "-20%" }, label: "RETAKE RATE", value: "↓ 68%", anim: "float 4s 0.8s ease-in-out infinite" },
              ].map((chip) => (
                <div key={chip.label} style={{ position: "absolute", background: "rgba(6,40,20,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "8px 12px", zIndex: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.4),0 0 16px rgba(0,255,136,0.1)", animation: chip.anim, ...chip.style }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 2 }}>{chip.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, color: "var(--green-bright)" }}>{chip.value}</div>
                </div>
              ))}
              <div style={{ width: 240, background: "linear-gradient(145deg,#0a1f12,#041508)", borderRadius: 36, padding: 10, border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 0 0 1px rgba(0,0,0,0.5),0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)", zIndex: 10, position: "relative" }}>
                <div style={{ background: "#010d06", borderRadius: 28, overflow: "hidden", aspectRatio: "9/19", position: "relative" }}>
                  <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 80, height: 24, background: "#000", borderRadius: 12, zIndex: 5 }} />
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ background: "linear-gradient(180deg,rgba(0,255,136,0.08),transparent)", padding: "36px 12px 12px", borderBottom: "1px solid rgba(0,255,136,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, color: "var(--green-bright)", letterSpacing: "0.2em" }}>RADIA</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.45rem", color: "var(--green-bright)" }}>
                        <span style={{ width: 5, height: 5, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 6px var(--green-bright)", animation: "blink 1.5s ease infinite" }} />
                        AI LIVE
                      </span>
                    </div>
                    <div style={{ flex: 1, position: "relative", background: "#061209", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--green-bright),transparent)", animation: "scanline 2.5s linear infinite", opacity: 0.7 }} />
                      <div style={{ position: "absolute", inset: 10, border: "1.5px solid rgba(0,255,136,0.3)", borderRadius: 4 }} />
                      <div style={{ position: "absolute", top: "20%", left: "15%", width: "70%", height: "55%", border: "1.5px solid var(--green-bright)", borderRadius: 4, boxShadow: "0 0 12px rgba(0,255,136,0.3)" }}>
                        {[["20%","50%"],["50%","25%"],["50%","75%"],["75%","50%"]].map(([t,l], i) => (
                          <div key={i} style={{ position: "absolute", width: 4, height: 4, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 6px var(--green-bright)", top: t, left: l, transform: "translate(-50%,-50%)" }} />
                        ))}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: "linear-gradient(0deg,rgba(0,255,136,0.1),transparent)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 12px var(--green-bright)", animation: "blink 1.2s ease infinite" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--green-bright)", letterSpacing: "0.15em" }}>ANALYZING POSITION...</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 12px", background: "rgba(0,255,136,0.06)", borderTop: "1px solid rgba(0,255,136,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 20, height: 20, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.45rem", color: "var(--bg-void)", fontWeight: 700, flexShrink: 0 }}>AI</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.42rem", color: "var(--green-bright)", lineHeight: 1.5 }}>Rotate left 3°. Shoulder elevation detected.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.radia-hero-grid{grid-template-columns:1fr!important;text-align:center}}`}</style>
      </section>

      {/* TICKER */}
      <div style={{ background: "rgba(0,255,136,0.04)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "12px 0", overflow: "hidden" }} aria-hidden="true">
        <div style={{ display: "flex", gap: 60, animation: "data-scroll 25s linear infinite", width: "max-content" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
              <span style={{ color: "var(--green-bright)", fontSize: "1rem" }}>◆</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "100px 0", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <ScrollReveal style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8 }}>Process</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>How Radia <span style={{ color: "var(--green-bright)" }}>Works</span></h2>
            <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Three simple steps to transform how you learn and practice radiographic positioning, powered by AI that sees what you see.</p>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, position: "relative" }} className="radia-steps-grid">
            <div style={{ position: "absolute", top: 60, left: "calc(16.6% + 12px)", right: "calc(16.6% + 12px)", height: 1, background: "linear-gradient(90deg,transparent,var(--green-bright),transparent)", opacity: 0.3 }} />
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.title} delay={0.1 * (i + 1)}>
                <div className="step-card" style={{ background: "var(--bg-card)", backdropFilter: "blur(20px)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", position: "relative", transition: "all 0.4s ease", cursor: "pointer", overflow: "hidden" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", fontWeight: 700, color: "var(--green-bright)", letterSpacing: "0.3em", marginBottom: 20, opacity: 0.6 }}>{s.num}</div>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,rgba(0,168,107,0.2),rgba(0,255,136,0.1))", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", marginBottom: 24 }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, marginBottom: 12, letterSpacing: "0.03em" }}>{s.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.radia-steps-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* STATS */}
      <div style={{ padding: "60px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(0,168,107,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }} className="radia-stats-grid">
          {STATS.map((s) => <AnimatedCounter key={s.target} target={s.target} label={s.label} />)}
        </div>
        <style>{`@media(max-width:600px){.radia-stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </div>

      {/* LIVE AI */}
      <section id="live-ai" style={{ padding: "100px 0", background: "linear-gradient(180deg,var(--bg-void),rgba(0,168,107,0.05),var(--bg-void))" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <ScrollReveal style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8 }}>Core Technology</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Live AI <span style={{ color: "var(--green-bright)" }}>Positioning Engine</span></h2>
            <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Point. Detect. Correct. In real-time. Our AI sees what you see and tells you exactly how to adjust before you expose the patient to radiation.</p>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="radia-live-grid">
            <ScrollReveal>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8, marginBottom: 12 }}>How It Sees</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.2 }}>122 Anatomical<br /><span style={{ color: "var(--green-bright)" }}>Landmarks Tracked</span></h3>
              <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>Our custom-trained vision model identifies and tracks 122 skeletal keypoints at 30fps, mapping bone structures, joint angles, and body orientation in real-time from your phone camera.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                {[["30 FPS","Real-time tracking"],["122","Skeletal landmarks"],["<50ms","AI response time"],["80%","Detection accuracy"]].map(([val,label]) => (
                  <div key={label} style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, transition: "all 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--green-bright)", letterSpacing: "-0.02em" }}>{val}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", aspectRatio: "4/3", position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,168,107,0.08),rgba(0,255,136,0.03))" }} />
                <div style={{ position: "absolute", left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,transparent,var(--green-bright),transparent)", animation: "scanline 3s linear infinite", opacity: 0.6 }} />
                <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }}>
                  {[[200,40],[200,120],[200,200],[140,80],[260,80],[140,160],[260,160],[130,220],[270,220],[160,240],[240,240]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill="#00FF88" opacity="0.8">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur={`${1+i*0.2}s`} repeatCount="indefinite"/>
                    </circle>
                  ))}
                  {[[200,40,200,120],[200,120,200,200],[200,120,140,80],[200,120,260,80],[140,80,140,160],[260,80,260,160],[200,200,140,160],[200,200,260,160],[140,160,130,220],[260,160,270,220],[130,220,160,240],[270,220,240,240]].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00FF88" strokeWidth="1.5" opacity="0.4"/>
                  ))}
                </svg>
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(0,168,107,0.15)", border: "1px solid rgba(0,168,107,0.3)", borderRadius: 100 }}>
                  <span style={{ width: 6, height: 6, background: "var(--green-bright)", borderRadius: "50%", boxShadow: "0 0 8px var(--green-bright)", animation: "blink 1.5s ease infinite", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--green-bright)", letterSpacing: "0.1em" }}>LIVE DETECTION</span>
                </div>
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, padding: "12px 16px", background: "rgba(1,13,8,0.9)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(0,255,136,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, background: "var(--green-lime)", borderRadius: "50%", boxShadow: "0 0 8px var(--green-lime)", animation: "pulse-glow 2s ease infinite" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--green-bright)", letterSpacing: "0.1em", fontWeight: 700 }}>POSITIONING SCORE: 87/100</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>⚠ Rotate shoulder 4° internally · Tilt chin 2° down</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <style>{`@media(max-width:900px){.radia-live-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* AI TUTOR */}
      <ChatSection />

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <ScrollReveal style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8 }}>Everything You Need</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Built for <span style={{ color: "var(--green-bright)" }}>Radiology Excellence</span></h2>
            <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Every feature purpose-built for radiology students and professionals, from first-year students to clinical trainers.</p>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="radia-features-grid">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={0.05 * (i + 1)}>
                <div className="feature-card" style={{ background: f.featured ? "linear-gradient(135deg,rgba(0,168,107,0.15),rgba(0,255,136,0.05))" : "var(--bg-card)", border: f.featured ? "1px solid rgba(0,255,136,0.25)" : "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", transition: "all 0.3s", cursor: "pointer", gridColumn: f.featured ? "span 2" : "span 1", height: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = f.featured ? "rgba(0,255,136,0.25)" : "var(--border)"; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: f.featured ? "linear-gradient(135deg,rgba(0,168,107,0.3),rgba(0,255,136,0.15))" : "linear-gradient(135deg,rgba(0,168,107,0.15),rgba(0,255,136,0.08))", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{f.icon}</div>
                    <div style={{ flex: 1 }}>
                      {f.featured && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--green-bright)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6, opacity: 0.8 }}>⭐ Flagship Feature</div>}
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: f.featured ? "1rem" : "0.88rem", fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em", lineHeight: 1.3 }}>{f.title}</h3>
                      <p style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.65 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.radia-features-grid{grid-template-columns:1fr!important}.radia-features-grid .feature-card{grid-column:span 1!important}}`}</style>
      </section>

      {/* FOR EDUCATORS */}
      <section id="educators" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="radia-educators-grid">
            <ScrollReveal>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8, marginBottom: 12 }}>For Institutions</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.2 }}>
                Scale Clinical Training<br /><span style={{ color: "var(--green-bright)" }}>Across Your Department</span>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 40, maxWidth: 460 }}>Radia gives department heads and clinical educators a unified platform to monitor student progress, identify weaknesses, and improve department-wide positioning accuracy, all in real-time.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["Batch progress tracking with visual analytics","Customizable positioning exam assignments","Department-wide retake rate dashboard","Integration with existing LMS platforms"].map((feature) => (
                  <div key={feature} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="var(--green-bright)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>{feature}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40 }}>
                <a href="mailto:rhyhedronelectronics@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", color: "var(--bg-void)", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", borderRadius: 12, boxShadow: "0 0 24px rgba(0,255,136,0.25)" }}>
                  Request Institution Demo
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {EDU_METRICS.map((m) => (
                  <div key={m.label} style={{ padding: 24, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, textAlign: "center", transition: "all 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--green-bright)" }}>{m.val}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 12 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--green-bright)", marginBottom: 8 }}>PARTNER INSTITUTION</div>
                <div style={{ fontSize: "0.88rem", color: "var(--white)", fontStyle: "italic", lineHeight: 1.6 }}>"Radia is the most impactful educational technology we've adopted in 15 years of radiology training."</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>HOD Radiology, AIIMS New Delhi</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <style>{`@media(max-width:900px){.radia-educators-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* DOWNLOAD */}
      <section id="download" style={{ padding: "120px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(circle,rgba(0,168,107,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--green-bright)", textTransform: "uppercase", opacity: 0.8, marginBottom: 16 }}>Start Learning Today</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Download Radia.<br /><span style={{ color: "var(--green-bright)", textShadow: "0 0 20px rgba(0,255,136,0.6),0 0 60px rgba(0,255,136,0.2)" }}>Free Forever.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.7 }}>Join 50,000+ radiology students mastering positioning with AI. No credit card. No limits. Just better radiology.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
              <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderRadius: 14, textDecoration: "none", color: "var(--white)", minWidth: 200, transition: "all 0.3s", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,136,0.12)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,255,136,0.06)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.25)"; }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--green-bright)" }}>
                  <path d="M12 16l4-4h-3V4h-2v8H8l4 4zm9 4H3v-2h18v2z"/>
                </svg>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>DOWNLOAD</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700 }}>Direct APK</div>
                </div>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "60px 0 30px", background: "var(--bg-deep)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="radia-footer-grid">
            <div>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 12 }}>
                <img src="/logo.png" alt="Radia" style={{ height: 32, width: "auto", objectFit: "contain" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; const next = e.currentTarget.nextSibling; if (next) next.style.display = "flex"; }}
                />
                <div style={{ display: "none", width: 36, height: 36, background: "linear-gradient(135deg,var(--green-primary),var(--green-bright))", borderRadius: 10, alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 900, color: "var(--bg-void)", boxShadow: "0 0 20px rgba(0,255,136,0.3)" }}>Rx</div>
              </Link>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, margin: "14px 0 20px", maxWidth: 280 }}>Radia is an AI-powered mobile application helping radiology students and professionals master perfect radiographic positioning through real-time AI guidance and intelligent clinical education.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["𝕏","In","Li","▶"].map((icon) => (
                  <a key={icon} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", textDecoration: "none", color: "var(--muted)", transition: "all 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--green-bright)"; e.currentTarget.style.color = "var(--green-bright)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["Live AI Positioning","AI Tutor","Features","For Institutions","Pricing","Changelog"] },
              { title: "Resources", links: ["Position Library","Anatomy Guides","Study Plans","Blog","Webinars","API Docs"] },
              { title: "Company", links: ["About Us","Careers","Press Kit","Contact","Partners","Research"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--white)", marginBottom: 18 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: "0.83rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.3s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>© 2025 Radia Technologies Pvt. Ltd. All rights reserved.</p>
            <nav style={{ display: "flex", gap: 20 }}>
              <Link to="/privacy" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                Terms of Service
              </Link>
              <a href="#" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                Cookie Policy
              </a>
              <a href="#" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                HIPAA Compliance
              </a>
            </nav>
          </div>
        </div>
        <style>{`
          @media(max-width:768px){.radia-footer-grid{grid-template-columns:1fr 1fr!important}}
          @media(max-width:480px){.radia-footer-grid{grid-template-columns:1fr!important}}
        `}</style>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
