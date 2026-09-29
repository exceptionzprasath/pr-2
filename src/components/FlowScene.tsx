import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = { progress: number; reducedMotion: boolean };

function center(t: number) {
  const u = t * Math.PI * 2;
  return new THREE.Vector3(
    1.8 + Math.sin(u * 1.25) * 2.3 + Math.sin(u * 3.1) * .45,
    5.5 - t * 24,
    Math.cos(u * 1.6) * 1.8
  );
}

function makeRibbon(offset: number, width: number, alpha: number) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const stops = ['#9d8aea', '#ed9ec1', '#ec9278', '#80d4d3', '#7bc5a8', '#a891e9'].map(c => new THREE.Color(c));
  const count = 420;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const p = center(t);
    const twist = t * Math.PI * 8 + offset;
    const lateral = new THREE.Vector3(Math.cos(twist), Math.sin(twist) * .42, Math.sin(twist));
    const w = width * (.72 + .28 * Math.sin(t * 27 + offset));
    const drift = new THREE.Vector3(Math.sin(t * 19 + offset) * .18, 0, Math.cos(t * 19 + offset) * .2);
    const a = p.clone().addScaledVector(lateral, w).add(drift);
    const b = p.clone().addScaledVector(lateral, -w).add(drift);
    positions.push(...a.toArray(), ...b.toArray());
    const segment = t * (stops.length - 1);
    const c = (stops[Math.floor(segment)] ?? new THREE.Color('#9d8aea')).clone().lerp(stops[Math.min(stops.length - 1, Math.floor(segment) + 1)] ?? new THREE.Color('#7bc5a8'), segment % 1);
    const highlight = c.clone().lerp(new THREE.Color('#ffffff'), .46);
    colors.push(...highlight.toArray(), ...c.toArray());
    if (i < count) {
      const k = i * 2;
      indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: alpha, depthWrite: false }));
}

export default function FlowScene({ progress, reducedMotion }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const motionRef = useRef(reducedMotion);
  useEffect(() => { progressRef.current = progress; motionRef.current = reducedMotion; }, [progress, reducedMotion]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0xffffff, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    const ribbon = makeRibbon(.2, .76, .75);
    const echo = makeRibbon(1.65, .46, .19);
    const highlight = makeRibbon(2.8, .18, .3);
    scene.add(ribbon, echo, highlight);

    const count = 125;
    const points = new Float32Array(count * 3);
    const shades = new Float32Array(count * 3);
    const palette = [new THREE.Color('#ba9de6'), new THREE.Color('#e5a3aa'), new THREE.Color('#76c9c7')];
    for (let i = 0; i < count; i++) shades.set((palette[i % 3] ?? new THREE.Color('#ba9de6')).toArray(), i * 3);
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(shades, 3));
    const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: .075, vertexColors: true, transparent: true, opacity: .8, depthWrite: false, sizeAttenuation: true }));
    scene.add(particles);

    let raf = 0;
    let current = progressRef.current;
    const clock = new THREE.Clock();
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = w < 700 ? 50 : 38;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const render = () => {
      const time = clock.getElapsedTime();
      current += (progressRef.current - current) * (motionRef.current ? 1 : .085);
      const focus = center(Math.min(.93, .035 + current * .9));
      const mobile = host.clientWidth < 700;
      camera.position.set(focus.x + (mobile ? 0 : -2.7), focus.y + .15, focus.z + (mobile ? 13.8 : 11.5));
      camera.lookAt(focus.x + (mobile ? 0 : .6), focus.y - .7, focus.z);
      ribbon.rotation.y = motionRef.current ? 0 : Math.sin(time * .12) * .055;
      echo.rotation.y = motionRef.current ? 0 : Math.cos(time * .17) * .08;
      for (let i = 0; i < count; i++) {
        const t = ((i / count + (motionRef.current ? 0 : time * (.006 + i % 4 * .0018))) % 1);
        const p = center(t);
        const angle = i * 2.4 + t * 22;
        const radius = .15 + (i % 7) * .14;
        points[i * 3] = p.x + Math.cos(angle) * radius;
        points[i * 3 + 1] = p.y + Math.sin(angle) * radius * .5;
        points[i * 3 + 2] = p.z + Math.sin(angle) * radius;
      }
      const positionAttribute = particleGeo.getAttribute('position');
      if (positionAttribute) positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      [ribbon, echo, highlight].forEach(mesh => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
      particleGeo.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={mount} className="flow-canvas" aria-hidden="true" />;
}
