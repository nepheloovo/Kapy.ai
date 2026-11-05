import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  ArrowRight,
  ChevronUp,
  Menu as MenuIcon,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { copy, type Copy, type Lang } from './copy';

const asset = './assets/';
const repoUrl = 'https://github.com/nepheloovo/Kapy.ai';
const docsUrl = `${repoUrl}#readme`;

const aboveFoldAssets = [
  `${asset}kapy-icon.png`,
  `${asset}shots/kapy-workbench.png`,
  `${asset}kapy/sprite-type-a.png`,
  `${asset}kapy/sprite-type-b.png`,
  `${asset}skins/sky-ruins.jpg`,
  `${asset}skins/dusk-wall.jpg`,
  `${asset}skins/jade-grove.jpg`,
  `${asset}skins/blossom-bridge.jpg`,
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}

function useSectionProgress(ref: React.RefObject<HTMLElement>, enabled = true) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled, ref]);
  return progress;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LanguageToggle({ lang, onChange, dark = false }: { lang: Lang; onChange: (lang: Lang) => void; dark?: boolean }) {
  return (
    <div className={`language-toggle ${dark ? 'is-dark' : ''}`} role="group" aria-label="Language">
      <button className={lang === 'en' ? 'active' : ''} onClick={() => onChange('en')} type="button">
        EN
      </button>
      <span>/</span>
      <button className={lang === 'zh' ? 'active' : ''} onClick={() => onChange('zh')} type="button">
        中文
      </button>
    </div>
  );
}

function RollText({ children }: { children: string }) {
  return (
    <span className="roll-text" aria-hidden="true">
      {Array.from(children).map((char, index) => (
        <span className="roll-char" key={`${char}-${index}`}>
          <span>{char === ' ' ? '\u00a0' : char}</span>
          <span>{char === ' ' ? '\u00a0' : char}</span>
        </span>
      ))}
    </span>
  );
}

function CrossMarker({ className = '' }: { className?: string }) {
  return <span className={`cross-marker ${className}`} aria-hidden="true"><i /><i /></span>;
}

type Pose =
  | 'idle'
  | 'walk'
  | 'work'
  | 'paint'
  | 'repair'
  | 'carry'
  | 'play'
  | 'sleep'
  | 'celebrate'
  | 'coffee'
  | 'stretch'
  | 'type'
  | 'inspect'
  | 'sweep';

function SpriteAnimator({ pose, height = 72, interval = 220, className = '', alt = 'Kapy' }: { pose: Pose; height?: number; interval?: number; className?: string; alt?: string }) {
  const [frame, setFrame] = useState(0);
  const reduced = usePrefersReducedMotion();
  const frames = useMemo(() => {
    if (pose === 'walk') {
      return [
        `${asset}kapy/sprite-walk-a-a.png`,
        `${asset}kapy/sprite-walk-a-b.png`,
        `${asset}kapy/sprite-walk-b-a.png`,
        `${asset}kapy/sprite-walk-b-b.png`,
      ];
    }
    return [`${asset}kapy/sprite-${pose}-a.png`, `${asset}kapy/sprite-${pose}-b.png`];
  }, [pose]);
  useEffect(() => {
    if (reduced || frames.length < 2) return;
    const timer = window.setInterval(() => setFrame((value) => (value + 1) % frames.length), interval);
    return () => window.clearInterval(timer);
  }, [frames.length, interval, reduced]);
  useEffect(() => setFrame(0), [pose]);
  return <img className={`kapy-sprite ${className}`} src={frames[frame]} alt={alt} style={{ height }} />;
}

function RevealLines({ lines, className = '' }: { lines: readonly string[]; className?: string }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div className={`reveal-lines ${className}`} initial={reduced ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {lines.map((line, index) => (
        <span className="reveal-line-mask" key={`${line}-${index}`}>
          <motion.span
            className="reveal-line"
            variants={{ hidden: { y: '105%', rotate: 2 }, show: { y: '0%', rotate: 0 } }}
            transition={{ duration: 1, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

function Loader({ onDone, t }: { onDone: () => void; t: Copy }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 100 : 0);
  const [exiting, setExiting] = useState(false);
  const [yuzu, setYuzu] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    let mounted = true;
    const started = performance.now();
    const preload = aboveFoldAssets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    );
    const fontReady = document.fonts?.ready ?? Promise.resolve();
    const target = Promise.all([...preload, fontReady]).then(() => 100);
    let raf = 0;
    const loop = async () => {
      const loaded = await Promise.race([target, new Promise<number>((resolve) => window.setTimeout(() => resolve(100), 5200))]);
      if (!mounted) return;
      const elapsed = performance.now() - started;
      const timeProgress = Math.min(100, (elapsed / 1700) * 100);
      setProgress((current) => Math.min(100, Math.max(current + 1.8, Math.min(loaded, timeProgress))));
      if (loaded >= 100 && (elapsed > 1700 || timeProgress >= 100)) {
        setProgress(100);
        setYuzu(true);
        window.setTimeout(() => {
          setExiting(true);
          window.setTimeout(onDone, 920);
        }, 520);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [onDone, reduced]);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current = { x: (event.clientX / window.innerWidth - 0.5) * 28, y: (event.clientY / window.innerHeight - 0.5) * 28 };
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  if (reduced) return null;
  const digits = String(Math.floor(progress)).padStart(3, '0').split('').map(Number);
  const yuzuPattern = [
    0, 1, 0, 1, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0,
  ];
  return (
    <motion.div className="loader" animate={exiting ? { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' } : { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>
      <div className="loader-counter" aria-label={`${Math.floor(progress)} percent`}>
        {digits.map((digit, index) => (
          <span className="odometer" key={index}>
            <span style={{ transform: `translateY(-${digit * 10}%)` }}>{Array.from({ length: 10 }, (_, number) => <i key={number}>{number}</i>)}</span>
          </span>
        ))}
      </div>
      <div className={`loader-center ${yuzu ? 'is-yuzu' : ''}`} style={{ transform: `translate(-50%, -50%) rotate(${pointer.current.x * 0.5}deg)` }}>
        {!yuzu ? <div className="loader-bar">{Array.from({ length: 10 }, (_, index) => <i key={index} className={progress >= index * 10 ? 'filled' : ''} />)}</div> : <div className="yuzu-pixel">{yuzuPattern.map((filled, index) => <i key={index} className={filled ? (index === 1 || index === 3 ? 'leaf' : 'fruit') : ''} />)}</div>}
        <span className="loader-caption">{t.loading}</span>
      </div>
    </motion.div>
  );
}

function Header({ lang, onChange, t }: { lang: Lang; onChange: (lang: Lang) => void; t: Copy }) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [sound, setSound] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme="dark"]'));
    const observer = new IntersectionObserver((entries) => setDark(entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.18)), { threshold: [0, 0.18, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const scroll = () => setAtTop(window.scrollY < window.innerHeight * 0.4);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  const nav = [
    ['home', t.home],
    ['how', t.how],
    ['studio', t.navStudio],
    ['skins', t.skins],
    ['start', t.start],
  ] as const;
  return (
    <header className={`site-header ${dark ? 'is-dark' : ''}`}>
      <a className="brand" href="#home" aria-label="Kapy.ai home">
        <img src={`${asset}kapy-icon.png`} alt="Kapy.ai" />
        <span>Kapy.ai</span>
        <small>8-BIT</small>
      </a>
      <div className={`header-tagline ${atTop ? '' : 'is-hidden'}`}>
        <RevealLines lines={[t.tagline]} />
      </div>
      <div className="header-actions" ref={menuRef}>
        <LanguageToggle lang={lang} onChange={onChange} dark={dark} />
        <button className="sound-button icon-button" type="button" aria-label="Toggle ambient sound" onClick={() => setSound((value) => !value)}>
          {sound ? <Volume2 size={16} strokeWidth={1.6} /> : <VolumeX size={16} strokeWidth={1.6} />}
          <span className="sound-bars">{Array.from({ length: sound ? 3 : 1 }, (_, index) => <i key={index} />)}</span>
        </button>
        <a className="pill pill-dark header-get" href={repoUrl} target="_blank" rel="noreferrer" aria-label={t.getKapy}>
          <RollText>{`${t.getKapy} ●`}</RollText>
        </a>
        <button className="pill pill-light menu-trigger" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? t.close : t.menu}>
          <RollText>{menuOpen ? `${t.close} ✕` : `${t.menu} ••`}</RollText>
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="menu-stack" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
              <div className="menu-card menu-nav">
                {nav.map(([id, label]) => <button key={id} type="button" onClick={() => { setMenuOpen(false); scrollToId(id); }}><span>{label}</span>{id === 'home' && <i />}</button>)}
              </div>
              <div className="menu-card menu-github">
                <a href={repoUrl} target="_blank" rel="noreferrer"><strong>{t.star}</strong><span className="github-field">github.com/nepheloovo/Kapy.ai <ArrowRight size={14} /></span></a>
              </div>
              <a className="menu-card menu-docs" href={docsUrl} target="_blank" rel="noreferrer"><SpriteAnimator pose="idle" height={34} interval={260} alt="Kapy" /><span>{t.docs}</span><ArrowRight size={15} /></a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function VoxelCluster() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 9, y: 9, down: false });
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#17232B', 12, 24);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 14);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    host.appendChild(renderer.domElement);
    const hemi = new THREE.HemisphereLight('#FFFFFF', '#1A1A22', 1.2);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#FFF4E6', 2.4);
    key.position.set(5, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight('#8EC5E8', 0.6);
    fill.position.set(-6, -2, -4);
    scene.add(fill);
    const group = new THREE.Group();
    scene.add(group);
    const crossParts = Array.from({ length: 5 }, (_, index) => {
      const geometry = new RoundedBoxGeometry(1, 1, 1, 3, 0.16);
      const offsets = [[0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]][index];
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(offsets[0], offsets[1], offsets[2]));
      return geometry;
    });
    const crossGeometry = mergeGeometries(crossParts, false);
    const colors = ['#F3EEE2', '#14131A', '#FF8A1F', '#B07A45'];
    const pieces: THREE.Object3D[] = [];
    const count = window.innerWidth < 768 ? 26 : 38;
    for (let index = 0; index < count; index += 1) {
      const material = new THREE.MeshPhysicalMaterial({ color: colors[index % colors.length], roughness: index % 4 === 1 ? 0.18 : 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
      let object: THREE.Object3D;
      if (index % 7 === 0) {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), material);
        sphere.scale.y = 0.92;
        const leaf = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.28, 2, 0.05), new THREE.MeshPhysicalMaterial({ color: '#6FAE4E', roughness: 0.3 }));
        leaf.position.set(0.35, 0.55, 0);
        leaf.rotation.z = 0.5;
        const fruit = new THREE.Group();
        fruit.add(sphere, leaf);
        object = fruit;
      } else if (index % 3 === 0 && crossGeometry) {
        object = new THREE.Mesh(crossGeometry.clone(), material);
      } else {
        const geometry = new RoundedBoxGeometry(index % 2 ? 1.1 : 1.4, index % 2 ? 0.8 : 1.1, 0.85, 3, 0.14);
        object = new THREE.Mesh(geometry, material);
      }
      object.scale.setScalar(0.45 + Math.random() * 0.34);
      const radius = 6 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      object.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6, (Math.random() - 0.5) * 4);
      object.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      object.userData = { velocity: new THREE.Vector3(), target: new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.6), phase: Math.random() * Math.PI * 2 };
      group.add(object);
      pieces.push(object);
    }
    const resize = () => {
      const rect = host.getBoundingClientRect();
      camera.aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
    };
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const leave = () => { pointerRef.current.x = 9; pointerRef.current.y = 9; };
    const down = () => { pointerRef.current.down = true; };
    const up = () => { pointerRef.current.down = false; };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerdown', down);
    host.addEventListener('pointerleave', leave);
    window.addEventListener('pointerup', up);
    window.addEventListener('resize', resize);
    resize();
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
    observer.observe(host);
    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const dt = Math.min(0.05, clock.getDelta());
      if (visible && !reduced) {
        const pointer = pointerRef.current;
        pieces.forEach((piece) => {
          const data = piece.userData as { velocity: THREE.Vector3; target: THREE.Vector3; phase: number };
          const pull = data.target.clone().sub(piece.position).multiplyScalar(0.9 * dt);
          data.velocity.add(pull);
          const px = pointer.x * 4.4;
          const py = -pointer.y * 2.4;
          const dx = piece.position.x - px;
          const dy = piece.position.y - py;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 2.8) {
            const force = Math.pow(1 - distance / 2.8, 2) * 24 * dt;
            data.velocity.x += (dx / Math.max(distance, 0.2)) * force;
            data.velocity.y += (dy / Math.max(distance, 0.2)) * force;
            if (pointer.down) data.velocity.add(new THREE.Vector3(pointer.x * 0.04, -pointer.y * 0.04, 0));
          }
          data.velocity.multiplyScalar(Math.pow(0.9, dt * 60));
          piece.position.addScaledVector(data.velocity, dt * 5);
          piece.rotation.x += dt * (0.3 + data.phase * 0.04);
          piece.rotation.y += dt * (0.4 + data.phase * 0.04);
        });
        group.rotation.y += dt * 0.06;
        group.rotation.x += dt * 0.025;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', down);
      host.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('resize', resize);
      pieces.forEach((piece) => {
        piece.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
          else if (mesh.material) mesh.material.dispose();
        });
      });
      crossGeometry?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced]);
  return <div ref={hostRef} className="voxel-canvas" aria-label="Interactive voxel cluster" role="img" />;
}

function Hero({ t, lang }: { t: Copy; lang: Lang }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setStage((value) => (value + 1) % 4), 1600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="hero-section" id="home" data-theme="light">
      <div className="hero-card-wrap">
        <div className="hero-card" data-cursor="blob">
          <VoxelCluster />
          <div className="hero-vignette" />
          <div className="status-chip"><span>●</span>{t.status.map((label, index) => <span className={stage === index ? 'active' : ''} key={label}>{label}{index < t.status.length - 1 ? ' → ' : ''}</span>)}</div>
          <SpriteAnimator pose="type" height={84} className="hero-kapy" alt={lang === 'zh' ? '正在工作的 Kapy' : 'Kapy typing'} />
        </div>
      </div>
      <div className="cross-row"><CrossMarker /><CrossMarker /><span><span>{t.scroll}</span><i /></span><CrossMarker /><CrossMarker /></div>
    </section>
  );
}

function ScrollRibbon({ progress }: { progress: number }) {
  const offset = 1 - Math.max(0, Math.min(1, progress));
  return (
    <svg className="scroll-ribbon" viewBox="0 0 1440 1100" preserveAspectRatio="none" aria-hidden="true">
      <path className="ribbon-base" d="M-30 280 C 250 180, 380 500, 680 330 S 880 420, 1040 620 C 1180 790, 1290 850, 1500 800" style={{ strokeDashoffset: offset }} />
      <path className="ribbon-mid" d="M-30 280 C 250 180, 380 500, 680 330 S 880 420, 1040 620 C 1180 790, 1290 850, 1500 800" style={{ strokeDashoffset: offset }} />
      <path className="ribbon-highlight" d="M-30 280 C 250 180, 380 500, 680 330 S 880 420, 1040 620 C 1180 790, 1290 850, 1500 800" style={{ strokeDashoffset: offset }} />
    </svg>
  );
}

function Intro({ t, lang }: { t: Copy; lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  return (
    <section className="intro-section" id="how" ref={sectionRef}>
      <ScrollRibbon progress={progress} />
      <div className="section-grid intro-grid">
        <div className="intro-title"><RevealLines lines={t.introTitle} /></div>
        <div className="intro-copy">
          <p>{t.introBody}</p>
          <button className="pill pill-white" type="button" onClick={() => scrollToId('studio')}><span>●</span><RollText>{t.howButton}</RollText></button>
        </div>
        <div className="intro-media" data-cursor="blob">
          <img src={`${asset}shots/kapy-workbench.png`} alt={lang === 'zh' ? 'Kapy 工作台界面' : 'Kapy workbench interface'} loading="lazy" decoding="async" />
          <span />
        </div>
      </div>
    </section>
  );
}

const reelImages = [
  `${asset}shots/kapy-workbench.png`,
  `${asset}shots/home-sky-ruins.png`,
  `${asset}shots/home-blossom-bridge.png`,
  `${asset}shots/home-dusk-wall.png`,
  `${asset}shots/home-jade-grove.png`,
  `${asset}shots/kapy-banner.jpg`,
];

function ExpandingReel({ t, lang }: { t: Copy; lang: Lang }) {
  const trackRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(trackRef);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setImageIndex((value) => (value + 1) % reelImages.length), 2400);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setLightbox(false);
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  const expand = Math.min(1, progress / 0.55);
  const cardStyle = {
    left: `${14 - expand * 12}vw`,
    right: `${14 - expand * 12}vw`,
    top: `${24 - expand * 20}vh`,
    bottom: `${24 - expand * 20}vh`,
  };
  return (
    <section className="reel-track" ref={trackRef}>
      <div className="reel-stage">
        <div className="reel-card" style={cardStyle}>
          {reelImages.map((src, index) => <img key={src} src={src} alt={lang === 'zh' ? 'Kapy.ai 产品画面' : 'Kapy.ai product screen'} className={index === imageIndex ? 'active' : ''} loading="lazy" decoding="async" />)}
          <div className="reel-shade" />
          <CrossMarker className="reel-cross cross-a" /><CrossMarker className="reel-cross cross-b" /><CrossMarker className="reel-cross cross-c" /><CrossMarker className="reel-cross cross-d" />
          <div className="reel-overlay"><span style={{ transform: `translateX(${-12 + expand * 12}vw)` }}>{t.reelPlay}</span><button type="button" onClick={() => setLightbox(true)} aria-label={t.reelDemo}><span className="play-pill"><Play size={24} fill="currentColor" /></span></button><span style={{ transform: `translateX(${12 - expand * 12}vw)` }}>{t.reelDemo}</span></div>
        </div>
        <p className="reel-caption">{t.reelCaption}</p>
      </div>
      <AnimatePresence>
        {lightbox && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="lightbox-close" type="button" onClick={() => setLightbox(false)} aria-label="Close"><X /></button><img src={reelImages[imageIndex]} alt={t.reelCaption} /><p>{t.reelCaption}</p></motion.div>}
      </AnimatePresence>
    </section>
  );
}

const studioAssets = [
  { image: `${asset}skins/sky-ruins.jpg`, pose: 'work' as Pose },
  { image: `${asset}skins/dusk-wall.jpg`, pose: 'type' as Pose },
  { image: `${asset}skins/jade-grove.jpg`, pose: 'inspect' as Pose },
  { image: `${asset}skins/blossom-bridge.jpg`, pose: 'play' as Pose },
  { image: `${asset}shots/kapy-banner.jpg` },
  { image: `${asset}shots/kapy-workbench.png` },
];

function Studio({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section className="studio-section" id="studio">
      <div className="section-grid studio-head"><RevealLines lines={[t.studioTitle]} /><p>{t.studioKicker}</p></div>
      <div className="studio-grid">
        {t.studio.map((item, index) => {
          const [tag, title, description] = item;
          const media = studioAssets[index];
          return <motion.article className="studio-card" key={tag} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <div className="studio-image" data-cursor="blob"><img src={media.image} alt={title} loading="lazy" decoding="async" />{media.pose && <SpriteAnimator pose={media.pose} height={150} className="studio-kapy" alt={`Kapy ${title}`} />}<div className="studio-image-shade" /></div>
            <div className="studio-tag">{tag}</div>
            <div className="studio-title-row"><ArrowRight size={24} /><h3>{title}</h3></div>
            <p>{description}</p>
          </motion.article>;
        })}
      </div>
    </section>
  );
}

const skinAssets = [
  { scene: `${asset}skins/sky-ruins.jpg`, shot: `${asset}shots/home-sky-ruins.png` },
  { scene: `${asset}skins/blossom-bridge.jpg`, shot: `${asset}shots/home-blossom-bridge.png` },
  { scene: `${asset}skins/dusk-wall.jpg`, shot: `${asset}shots/home-dusk-wall.png` },
  { scene: `${asset}skins/jade-grove.jpg`, shot: `${asset}shots/home-jade-grove.png` },
];

function Skins({ t, lang }: { t: Copy; lang: Lang }) {
  const trackRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(trackRef);
  return (
    <section className="skins-track" id="skins" ref={trackRef}>
      <div className="skins-stage">
        <div className="section-grid skins-head"><h2>{t.pickTitle}</h2><p>{t.pickKicker}</p></div>
        <div className="skins-rail" style={{ transform: `translate3d(${window.innerWidth < 768 ? 0 : -progress * 66}vw, 0, 0)` }}>
          {skinAssets.map((skin, index) => {
            const [name, swatches] = t.worlds[index];
            return <article className="skin-panel" key={name} style={{ backgroundImage: `url(${skin.scene})` }}>
              <div className="skin-panel-shade" />
              <img className="skin-shot" src={skin.shot} alt={`${name} Kapy.ai home`} loading="lazy" decoding="async" />
              <div className="skin-meta"><h3>{name}</h3><span>{swatches.map((swatch) => <i key={swatch} style={{ backgroundColor: swatch }} />)}</span></div>
            </article>;
          })}
        </div>
        <div className="skin-walk" style={{ left: `calc(${progress * 100}% - 48px)` }}><SpriteAnimator pose="walk" height={96} interval={130} alt={lang === 'zh' ? '走路的 Kapy' : 'Kapy walking'} /></div>
        <div className="skin-progress"><span style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} /><div>{[1, 2, 3, 4].map((number) => <span key={number}>0{number}</span>)}</div></div>
      </div>
    </section>
  );
}

function PixelTunnel({ progress }: { progress: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const reduced = usePrefersReducedMotion();
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0E0D12');
    scene.fog = new THREE.Fog('#0E0D12', 6, 34);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    const textures = [`${asset}skins/sky-ruins.jpg`, `${asset}skins/blossom-bridge.jpg`, `${asset}skins/dusk-wall.jpg`, `${asset}skins/jade-grove.jpg`].map((src) => new THREE.TextureLoader().load(src));
    const planes: THREE.Mesh[] = [];
    textures.forEach((texture, textureIndex) => texture.colorSpace = THREE.SRGBColorSpace);
    for (let index = 0; index < 12; index += 1) {
      const material = new THREE.MeshBasicMaterial({ map: textures[index % textures.length], transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 10.7), material);
      plane.position.set(index % 2 ? 3.5 : -3.5, index % 3 === 0 ? 1.2 : -1.2, -6 - index * 6);
      plane.rotation.z = index % 2 ? 0.06 : -0.06;
      scene.add(plane);
      planes.push(plane);
    }
    const dustGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const dustMaterial = new THREE.MeshBasicMaterial({ color: '#8EC5E8', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const dust = new THREE.InstancedMesh(dustGeometry, dustMaterial, 260);
    const dummy = new THREE.Object3D();
    for (let index = 0; index < 260; index += 1) {
      const side = index % 4;
      const depth = -4 - Math.random() * 78;
      const span = 8 + Math.random() * 5;
      dummy.position.set(side === 0 ? -span : side === 1 ? span : (Math.random() - 0.5) * span * 2, side === 2 ? -span * 0.55 : side === 3 ? span * 0.55 : (Math.random() - 0.5) * span, depth);
      const scale = 0.45 + Math.random() * 1.4;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      dust.setMatrixAt(index, dummy.matrix);
    }
    scene.add(dust);
    const resize = () => {
      const rect = host.getBoundingClientRect();
      camera.aspect = rect.width / Math.max(1, rect.height);
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
    };
    window.addEventListener('resize', resize);
    resize();
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
    observer.observe(host);
    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const dt = clock.getDelta();
      if (visible && !reduced) {
        const p = progressRef.current;
        camera.position.z = 2 - p * 74;
        camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.08;
        planes.forEach((plane) => {
          const distance = Math.abs(plane.position.z - camera.position.z);
          const opacity = Math.min(1, Math.max(0, (distance - 2) / 22));
          (plane.material as THREE.MeshBasicMaterial).opacity = opacity * 0.78;
        });
        dust.rotation.z += dt * 0.015;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      planes.forEach((plane) => { plane.geometry.dispose(); (plane.material as THREE.Material).dispose(); });
      textures.forEach((texture) => texture.dispose());
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced]);
  return <div ref={hostRef} className="tunnel-canvas" />;
}

function WorldFlythrough({ t }: { t: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  return (
    <section className="world-track" id="world" data-theme="dark" ref={sectionRef}>
      <div className="world-stage"><PixelTunnel progress={progress} /><div className="world-vignette" /><div className="world-glow" />
        <div className="world-words">{t.worldWords.map((word, index) => { const start = 0.1 + index * 0.25; const local = Math.min(1, Math.max(0, (progress - start) / 0.25)); return <div className={`world-word world-word-${index}`} key={word} style={{ opacity: local > 0 && local < 0.95 ? Math.min(1, local * 3) : 0, transform: `scale(${local > 0.72 ? 1 + (local - 0.72) * 2.3 : 1})`, filter: `blur(${local > 0.72 ? (local - 0.72) * 45 : 0}px)` }}>{word}</div>; })}</div>
        <div className="world-progress-label">{String(Math.round(progress * 100)).padStart(3, '0')}</div>
      </div>
    </section>
  );
}

const stickerPositions = [
  [4, 12, -8], [14, 30, 10], [6, 52, 6], [16, 72, -12], [5, 86, 8], [24, 88, -6], [20, 8, 12], [11, 92, -10],
  [84, 10, 15], [94, 26, -18], [82, 34, 12], [92, 50, -5], [80, 62, 16], [93, 72, -16], [84, 88, -5], [74, 92, 8],
  [70, 8, -8], [30, 6, 14], [36, 92, -11], [62, 90, 7], [26, 50, -10], [74, 46, 8],
];

function StickerField() {
  const [active, setActive] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const stickerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="sticker-field" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top }); }}>
    {stickerPositions.map(([left, top, rotate], index) => {
      const cell = index % 12;
      const cellX = cell % 4;
      const cellY = Math.floor(cell / 4);
      const dx = ((pointer.x / Math.max(1, window.innerWidth)) * 2 - 1) * (index % 2 ? -6 : 6);
      const dy = ((pointer.y / Math.max(1, window.innerHeight)) * 2 - 1) * (index % 3 ? 3 : -3);
      return <button ref={(node) => { stickerRefs.current[index] = node; }} key={index} className={`sticker sticker-${index} ${active === index ? 'is-popping' : ''}`} type="button" aria-label={`Sticker ${index + 1}`} onClick={() => { setActive(index); window.setTimeout(() => setActive(null), 380); }} style={{ backgroundImage: `url(${asset}stickers/sticker-sheet.png)`, left: `${left}%`, top: `${top}%`, backgroundPosition: `${cellX * 33.333333}% ${cellY * 50}%`, transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${rotate}deg)` }} />;
    })}
  </div>;
}

function Cta({ t, lang }: { t: Copy; lang: Lang }) {
  const [hover, setHover] = useState(false);
  return (
    <section className="cta-section" id="start" data-theme="dark">
      <StickerField />
      <CrossMarker className="cta-cross cta-cross-a" /><CrossMarker className="cta-cross cta-cross-b" /><CrossMarker className="cta-cross cta-cross-c" />
      <div className="cta-content">
        <p>{t.ctaKicker}</p>
        <h2 aria-label={t.ctaTitle.join(" ")} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{t.ctaTitle.map((line) => <span key={line}><RollText>{hover ? line : line}</RollText></span>)}</h2>
        <SpriteAnimator pose={hover ? 'stretch' : 'celebrate'} height={260} interval={260} className="cta-kapy" alt={lang === 'zh' ? '庆祝的 Kapy' : 'Celebrating Kapy'} />
        <div className="cta-actions"><a className="pill pill-yuzu" href={repoUrl} target="_blank" rel="noreferrer"><RollText>{`${t.ctaGet} ↗`}</RollText></a><a className="pill pill-outline" href={docsUrl} target="_blank" rel="noreferrer"><RollText>{t.ctaDocs}</RollText></a></div>
      </div>
      <div className="cta-scroll">CONTINUE TO SCROLL ↓</div>
    </section>
  );
}

function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || !window.matchMedia('(pointer:fine)').matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const points: { x: number; y: number; t: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth * window.devicePixelRatio; canvas.height = window.innerHeight * window.devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0); };
    const move = (event: PointerEvent) => { points.push({ x: event.clientX, y: event.clientY, t: performance.now() }); if (points.length > 26) points.shift(); };
    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const now = performance.now();
      while (points.length && now - points[0].t > 450) points.shift();
      for (let index = 1; index < points.length; index += 1) {
        const point = points[index];
        const previous = points[index - 1];
        const alpha = index / points.length;
        context.strokeStyle = `rgba(255,138,31,${alpha * 0.32})`;
        context.lineWidth = alpha * 8;
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(point.x, point.y);
        context.stroke();
      }
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
    const raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, [reduced]);
  return <canvas className="cursor-trail" ref={canvasRef} aria-hidden="true" />;
}

function Footer({ lang, onChange, t }: { lang: Lang; onChange: (lang: Lang) => void; t: Copy }) {
  return (
    <footer className="site-footer" data-theme="light">
      <div className="footer-wordmark">Kapy<span className="footer-dot">.</span>ai</div>
      <div className="footer-grid">
        <div><small>{t.product}</small><a href="#how">{t.footerHow}</a><a href="#studio">{t.footerStudio}</a><a href="#skins">{t.footerSkins}</a></div>
        <div><small>{t.openSource}</small><a href={repoUrl} target="_blank" rel="noreferrer">{t.github}</a><a href={docsUrl} target="_blank" rel="noreferrer">{t.readme}</a><a href={`${repoUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">{t.license}</a></div>
        <div><small>{t.requirements}</small>{t.requirementsList.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="footer-language"><LanguageToggle lang={lang} onChange={onChange} /><SpriteAnimator pose="coffee" height={50} interval={260} alt="Kapy drinking coffee" /></div>
      </div>
      <div className="footer-bottom"><span>{t.legal}</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ChevronUp size={15} />{t.backTop}</button></div>
    </footer>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
  const [loaded, setLoaded] = useState(false);
  const t = copy[lang];
  useLenis();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <>
    {!loaded && <Loader t={t} onDone={() => setLoaded(true)} />}
    <CursorTrail />
    <Header lang={lang} onChange={setLang} t={t} />
    <main>
      <Hero t={t} lang={lang} />
      <Intro t={t} lang={lang} />
      <ExpandingReel t={t} lang={lang} />
      <Studio t={t} lang={lang} />
      <Skins t={t} lang={lang} />
      <WorldFlythrough t={t} />
      <Cta t={t} lang={lang} />
    </main>
    <Footer lang={lang} onChange={setLang} t={t} />
    {!loaded && <div className="page-under-loader" aria-hidden="true" />}
  </>;
}
