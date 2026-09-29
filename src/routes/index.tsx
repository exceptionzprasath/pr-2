import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Heart, MessageCircle, MoreHorizontal, Play, SkipForward, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import editorial from '@/assets/create-editorial.jpg';

const FlowScene = lazy(() => import('@/components/FlowScene'));

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Jussflow — Create it. Let it flow.' },
    { name: 'description', content: 'From your first idea to your next big thing. Create, publish, connect, and grow in one continuous flow with Jussflow.' },
    { property: 'og:title', content: 'Jussflow — Create it. Let it flow.' },
    { property: 'og:description', content: 'Create, publish, connect, and grow in one continuous flow.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const stages = [
  { number: '01', title: 'Make something\nworth sharing.', label: 'CREATE', description: 'A thought becomes a post. A post becomes the start of something bigger.', motif: 'create' },
  { number: '02', title: 'Right place.\nRight moment.', label: 'SCHEDULE', description: 'Line up your best ideas, then let perfect timing do its thing.', motif: 'schedule' },
  { number: '03', title: 'Out into\nthe world.', label: 'PUBLISH', description: 'Your content moves from ready to live, without breaking your stride.', motif: 'publish' },
  { number: '04', title: 'The conversation\nstarts here.', label: 'ENGAGE', description: 'Every reaction is a signal. Every comment is an opening.', motif: 'engage' },
  { number: '05', title: 'Every message\nkeeps moving.', label: 'DM + AUTOMATE', description: 'One hello can become a thousand thoughtful next steps — all flowing naturally.', motif: 'dm' },
  { number: '06', title: 'A connection\ntakes shape.', label: 'CAPTURE', description: 'Turn meaningful conversations into people you really know.', motif: 'capture' },
  { number: '07', title: 'Stay close,\nwithout chasing.', label: 'FOLLOW UP', description: 'The right reminder, a timely reply, a human touch. Nothing falls through.', motif: 'follow' },
  { number: '08', title: 'People, not\nspreadsheets.', label: 'LEAD', description: 'Every relationship finds its place, with its whole story intact.', motif: 'lead' },
  { number: '09', title: 'See the bigger\npicture.', label: 'ANALYZE', description: 'Follow the signals. Find what works. Make every next move count.', motif: 'analyze' },
  { number: '10', title: 'And it all\nflows forward.', label: 'GROW', description: 'From one idea to endless possibilities. Everything is connected.', motif: 'grow' },
] as const;

function Motif({ kind }: { kind: typeof stages[number]['motif'] }) {
  if (kind === 'create' || kind === 'publish') return <div className="object-wrap post-object"><div className="post-top"><div className="post-avatar">j</div><span>jussflow.studio</span><MoreHorizontal size={17} /></div><img src={editorial} alt="Sculptural coral flower in a glass vase" width={1024} height={1024} loading="lazy" /><div className="post-bottom"><Heart size={17} /><MessageCircle size={17} /><span>Made to move.</span></div></div>;
  if (kind === 'schedule') return <div className="object-wrap calendar-object"><div className="calendar-head"><CalendarDays size={19} /> <span>June 2026</span><MoreHorizontal size={17} /></div><div className="calendar-grid">{['M','T','W','T','F','S','S',...Array.from({ length: 28 }, (_,i) => String(i+1))].map((d,i) => <span key={i} className={i === 24 ? 'chosen' : ''}>{d}</span>)}</div><div className="calendar-foot"><span className="status-dot" /> Ready for the right moment</div></div>;
  if (kind === 'engage') return <div className="motif-cloud"><span className="reaction reaction-one"><Heart fill="currentColor" size={31} /></span><span className="reaction reaction-two"><MessageCircle size={37} /></span><span className="reaction reaction-three"><Sparkles size={27} /></span><span className="reaction reaction-four">+1.2k</span></div>;
  if (kind === 'dm') return <div className="conversation"><div className="bubble bubble-in">Hey, I love this!</div><div className="bubble bubble-out">So glad you’re here.</div><div className="bubble bubble-out bubble-last">Let’s keep in touch <ArrowUpRight size={16} /></div><div className="conversation-dots"><i /><i /><i /></div></div>;
  if (kind === 'capture' || kind === 'lead') return <div className="profile-object"><div className="profile-avatar">A</div><div className="profile-lines"><strong>A new connection</strong><span>From a conversation to a relationship</span></div><div className="profile-rule" /><div className="profile-pills"><span>Interested</span><span>Connected</span><span>Growing</span></div><span className="profile-check"><Check size={19} /></span></div>;
  if (kind === 'follow') return <div className="touchpoints"><div><span><MessageCircle size={19} /></span> A warm hello <Check size={16} /></div><div><span><CalendarDays size={19} /></span> A timely reminder <Check size={16} /></div><div><span><Heart size={19} /></span> A personal touch <span className="pulse-point" /></div></div>;
  if (kind === 'analyze') return <div className="chart-object"><div className="chart-top"><span>The momentum</span><ArrowUpRight size={22} /></div><div className="chart-number">+148%<span>and rising</span></div><div className="chart-bars">{[25,39,35,52,46,69,61,77,72,91,83,100].map((h,i) => <span key={i} style={{ height: `${h}%` }} />)}</div></div>;
  return <div className="end-mark">∞</div>;
}

function Intro({ onDone, reducedMotion }: { onDone: () => void; reducedMotion: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (reducedMotion) { onDone(); return; }
    const timers = [2000, 3400, 5400, 7200, 9800, 12000, 14800].map((delay, i) => window.setTimeout(() => i === 6 ? onDone() : setPhase(i + 1), delay));
    return () => timers.forEach(window.clearTimeout);
  }, [onDone, reducedMotion]);
  return <div className={`intro intro-phase-${phase}`} aria-label="Jussflow opening animation">
    <div className="intro-grain" />
    <div className="intro-trail" />
    <div className="intro-sparks">{Array.from({length: 24}, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
    <div className="intro-center"><span className="intro-jf">J</span><span className="intro-full">Jussflow</span><span className="intro-sub">Everything flows.</span></div>
    <span className="intro-caption">A NEW WAY TO MOVE FORWARD</span>
    <Button className="intro-skip" variant="ghost" onClick={onDone}>Skip intro <SkipForward size={16} /></Button>
    <div className="intro-progress"><span /></div>
  </div>;
}

function Index() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [intro, setIntro] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const main = mainRef.current;
      if (!main) return;
      const start = main.offsetTop;
      const max = Math.max(1, main.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / max));
      setProgress(p);
      setActive(Math.min(stages.length, Math.max(0, Math.round(p * (stages.length + .2)))));
      ticking = false;
    };
    const scroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); };
  }, []);
  useEffect(() => { document.body.classList.toggle('intro-open', intro && !reducedMotion); return () => document.body.classList.remove('intro-open'); }, [intro, reducedMotion]);
  const endIntro = () => setIntro(false);
  return <>
    {intro && !reducedMotion && <Intro key={replayKey} onDone={endIntro} reducedMotion={reducedMotion} />}
    <header className="site-header"><a href="#top" className="brand" aria-label="Jussflow home"><span className="brand-symbol">j<span>.</span></span><span className="brand-name">Jussflow</span></a><nav aria-label="Primary navigation"><a href="#journey">The flow</a><a href="#about">The idea</a></nav><Button variant="outline" size="sm" className="header-action" onClick={() => { setReplayKey(k => k + 1); setIntro(true); window.scrollTo({top:0, behavior:'instant'}); }}><Play size={13} fill="currentColor" /> Replay film</Button></header>
    <main ref={mainRef} id="top">
      <div className="scene-layer"><Suspense fallback={<div className="scene-fallback" />}>{mounted && <FlowScene progress={progress} reducedMotion={reducedMotion} />}</Suspense></div>
      <div className="scene-veil" />
      <section className="opening-section" aria-labelledby="opening-title"><div className="opening-copy"><p className="eyebrow"><span className="eyebrow-line" /> THE FUTURE IS IN MOTION</p><h1 id="opening-title">JUST<br /><em>FLOW.</em></h1><p className="opening-description">You create it.<br />We make everything after it flow.</p><a className="explore-link" href="#journey">Explore the flow <span><ArrowDown size={18} /></span></a></div><div className="opening-index"><span>01 / 11</span><span>SCROLL TO BEGIN <ArrowDown size={15} /></span></div><div className="opening-side">CREATE → AUTOMATE → CONNECT → GROW</div></section>
      <div id="journey" className="journey">
        {stages.map((stage, i) => <section className={`story-section story-${stage.motif} ${i % 2 ? 'story-right' : 'story-left'} ${active === i + 1 ? 'is-active' : ''}`} key={stage.number} aria-labelledby={`stage-${i}`}><div className="story-inner"><div className="story-copy"><p className="section-kicker"><span className="stage-number">{stage.number}</span><span className="kicker-rule" />{stage.label}</p><h2 id={`stage-${i}`}>{stage.title.split('\n').map((line,j) => <span key={j}>{line}<br /></span>)}</h2><p className="story-description">{stage.description}</p><span className="stage-step">{i < stages.length - 1 ? 'KEEP FLOWING' : 'THE FLOW NEVER ENDS'} <ArrowDown size={14} /></span></div><div className={`motif-container motif-${stage.motif}`}><Motif kind={stage.motif} /></div></div></section>)}
      </div>
      <section className="closing" id="about"><div className="closing-inner"><span className="section-kicker"><span className="stage-number">∞</span><span className="kicker-rule" /> THE WHOLE PICTURE</span><h2>It was always<br /><em>one flow.</em></h2><p>One idea. Infinite momentum. Everything you create, connect, and grow belongs to the same beautiful journey.</p><div className="closing-wordmark">Jussflow<span>.</span></div><a href="#top" className="back-link">Back to the beginning <ArrowRight size={18} /></a></div></section>
    </main>
    <footer className="site-footer"><span>© Jussflow 2026</span><span>CREATE IT. LET IT FLOW.</span><Button variant="ghost" size="sm" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>Back to top ↑</Button></footer>
    <div className="progress-track" aria-hidden="true"><span style={{ transform: `scaleY(${progress})` }} /></div>
  </>;
}
