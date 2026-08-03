---
layout: post
title: "Config 2026 - Recap"
date: 2026-08-02
permalink: /blog/config-2026/
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Config 2026 — Field Notes</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital@0;1&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --off-black: #111111;
    --border: #2a2a2a;
    --white: #f5f2eb;
    --warm-white: #ede8dd;
    --dim: #888880;
    --dim-min: #7e7e76; /* minimum AA-passing neutral on --black (4.5:1) */
    --accent: #e8c547;
    --red: #c93b2a;
    --film: rgba(255,255,255,0.03);
    --body-copy-size: 18px;
    --body-copy-color: #aaa9a0;
    --body-copy-line-height: 1.8;
  }

  html { background: var(--black); color: var(--white); }

  a {
    color: #8bbcff;
    text-decoration: underline;
  }

  a:hover,
  a:focus-visible {
    color: #b9d6ff;
    text-decoration-thickness: 2px;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--black);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* grain overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: 0.6;
  }

  /* ── HEADER ── */
  header {
    padding: 80px 60px 60px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 40px;
  }

  .header-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--dim);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 400;
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: var(--white);
  }

  h1 em {
    font-style: italic;
    color: var(--accent);
  }

  .header-meta {
    text-align: right;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--dim);
    line-height: 2;
    letter-spacing: 0.05em;
  }

  .header-meta strong {
    display: block;
    color: var(--white);
    font-size: 13px;
  }

  /* ── INTRO STRIP ── */
  .intro-strip {
    padding: 48px 60px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    align-items: start;
  }

  .intro-text {
    grid-column: 1;
    font-size: var(--body-copy-size);
    line-height: var(--body-copy-line-height);
    color: var(--body-copy-color);
    font-weight: 300;
    max-width: 680px;
  }

  .intro-text strong, .intro-text b { color: var(--white); font-weight: 500; }
  .intro-text ul { padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }

  .intro-photo-card {
    grid-column: 2;
    justify-self: end;
    max-width: 560px;
    width: 100%;
    margin-left: auto;
  }

  .intro-photo-card .photo-frame {
    aspect-ratio: 3975 / 3390;
  }

  .stat-block {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-left: 40px;
    border-left: 1px solid var(--border);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
  }

  .stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--dim);
    text-transform: uppercase;
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dim);
    padding: 32px 60px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .section-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 4vw, 54px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--white);
    margin: 20px 60px 0;
    max-width: 12ch;
  }

  /* ── PHOTO SECTION ── */
  /* Standardized on two crop ratios only: wide (3:2) for landscape moments, tall (3:4) for portrait moments. */
  .photo-section {
    padding: 40px 60px 60px;
    border-bottom: 1px solid var(--border);
  }

  .photo-layout {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 48px;
    align-items: center;
  }

  .photo-layout.reverse { grid-template-columns: 1fr 1.3fr; }
  .photo-layout.reverse .photo-card { order: 2; }
  .photo-layout.reverse .photo-text { order: 1; }

  /* Photo card / polaroid */
  .photo-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: none;
    padding: 10px 10px 0 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 12px rgba(0,0,0,0.6);
    width: 100%;
  }

  .photo-layout .photo-card.vibes-card {
    max-width: 840px;
    width: 100%;
    margin: 0 auto;
  }

  .photo-frame {
    width: 100%;
    background: #1c1c1c;
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid #222;
    display: block;
  }

  .photo-frame img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    display: block;
    object-fit: cover;
  }

  .photo-caption {
    padding: 10px 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: #fff;
  }

  .photo-frame img,
  .intro-photo-card img {
    cursor: zoom-in;
  }

  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 2000;
  }

  .lightbox.open {
    display: flex;
  }

  .lightbox img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }

  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 24px;
    color: #ffffff;
    font-size: 32px;
    cursor: pointer;
    line-height: 1;
    background: rgba(0, 0, 0, 0.75);
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 999px;
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  }

  .lightbox-close:hover,
  .lightbox-close:focus-visible {
    background: rgba(0, 0, 0, 0.95);
    border-color: #ffffff;
    outline: none;
  }

  .caption-title {
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
    background: transparent;
    width: 100%;
    font-family: inherit;
  }

  .caption-sub {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: #595959;
    background: transparent;
    width: 100%;
  }

  .photo-text {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .photo-text .note-tag {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0.8;
  }

  .photo-text .note-body {
    font-size: var(--body-copy-size);
    line-height: var(--body-copy-line-height);
    color: var(--body-copy-color);
    background: transparent;
    width: 100%;
    font-family: 'Inter', sans-serif;
    min-height: 60px;
  }

  /* Film strip accent */
  .film-strip {
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      var(--accent) 0px, var(--accent) 12px,
      transparent 12px, transparent 18px
    );
    opacity: 0.6;
    margin-bottom: 24px;
  }

  /* ── NOTES / TOPICS ── */
  .notes-section {
    padding: 40px 60px 60px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .note-card {
    background: #111;
    border: 1px solid #252525;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color 0.2s;
  }

  .note-card:hover { border-color: #3a3a3a; }

  .note-tag {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0.8;
  }

  .note-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.2;
    color: var(--white);
    background: transparent;
    width: 100%;
    font-family: 'Playfair Display', serif;
  }

  .topic-link {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8bbcff;
    text-decoration: underline;
    align-self: flex-start;
  }

  .topic-link:hover,
  .topic-link:focus-visible {
    color: #b9d6ff;
  }

  .note-body {
    font-size: var(--body-copy-size);
    line-height: var(--body-copy-line-height);
    color: var(--body-copy-color);
    background: transparent;
    width: 100%;
    font-family: 'Inter', sans-serif;
    min-height: 80px;
  }

  .note-divider {
    height: 1px;
    background: #1e1e1e;
  }

  /* ── MEETUPS ── */
  .meetups-section {
    padding: 40px 60px 60px;
    border-bottom: 1px solid var(--border);
  }

  .meetup-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .meetup-row {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    align-items: center;
    gap: 32px;
    padding: 22px 0;
    border-bottom: 1px solid #1a1a1a;
    transition: background 0.15s;
  }

  .meetup-row:hover { background: rgba(255,255,255,0.01); }
  .meetup-row:last-child { border-bottom: none; }

  .meetup-num {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--dim-min);
    letter-spacing: 0.1em;
  }

  .meetup-info { display: flex; flex-direction: column; gap: 4px; }

  .meetup-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--white);
    background: transparent;
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .meetup-detail {
    font-size: 13px;
    color: var(--dim);
    background: transparent;
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .meetup-badge {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 5px 10px;
    border: 1px solid #2a2a2a;
    color: var(--dim-min);
    white-space: nowrap;
    background: transparent;
    text-align: center;
  }

  /* ── ADD ROW BUTTON ── */
  .add-row-btn {
    background: none;
    border: 1px dashed #555;
    color: var(--dim-min);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 14px;
    width: 100%;
    cursor: pointer;
    margin-top: 12px;
    transition: border-color 0.2s, color 0.2s;
  }

  .add-row-btn:hover { border-color: #888; color: var(--white); }

  /* ── FOOTER ── */
  footer {
    padding: 40px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-sig {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 16px;
    color: var(--dim-min);
  }

  .footer-mono {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--dim-min);
    letter-spacing: 0.1em;
  }

  .header-eyebrow,
  .header-meta,
  .stat-label,
  .section-label,
  .caption-sub,
  .photo-text .note-tag,
  .note-tag,
  .meetup-num,
  .meetup-badge,
  .add-row-btn,
  .footer-mono {
    font-size: 12px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    header { padding: 48px 28px 40px; grid-template-columns: 1fr; }
    .header-meta { text-align: left; }
    .intro-strip { padding: 32px 28px; grid-template-columns: 1fr; }
    .intro-text { grid-column: span 1; }
    .stat-block { padding-left: 0; border-left: none; border-top: 1px solid var(--border); padding-top: 24px; flex-direction: row; flex-wrap: wrap; gap: 24px; }
    .section-label, .photo-section, .notes-section, .meetups-section, footer { padding-left: 28px; padding-right: 28px; }
    .photo-layout, .photo-layout.reverse { grid-template-columns: 1fr; }
    .photo-layout.reverse .photo-card, .photo-layout.reverse .photo-text { order: initial; }
    .notes-section { grid-template-columns: 1fr; }
    .meetup-row { grid-template-columns: 48px 1fr; }
    .meetup-badge { display: none; }
  }
</style>
</head>
<body>

<!-- ── HEADER ── -->
<header>
  <div>
    <div class="header-eyebrow">Figma Config 2026 &nbsp;·&nbsp; Field Notes</div>
    <h1>Config 2026 - Recap<br></h1>
  </div>
</header>

<!-- ── INTRO ── -->
<div class="intro-strip">
  <div class="intro-text">
    <ul>
      <li>Three days at <b>Moscone Center, San Francisco</b>.</li>
      <li>Dozens of sessions, side conversations, and Figma product reveals.</li>
      <li>Here's what stuck — the sessions worth rewatching, the people worth following up with, and the ideas that are already changing how we work.</li>
    </ul><!--more-->
  </div>
  <div class="photo-card intro-photo-card">
    <div class="photo-frame">
      <img src="/assets/posts/config-recap/badge.jpg" alt="Conference badge and lanyard with Config 2026 logo">
    </div>
    <div class="photo-caption">
      <div class="caption-title">Badge & tote energy</div>
      <div class="caption-sub">Config is always strong on branding</div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════ -->
<!-- 01 — Venue vibes -->
<!-- ══════════════════════════════════ -->
<h2 class="section-headline">Venue Vibes</h2>
<div class="photo-section">
  <div class="film-strip"></div>
  <div class="photo-layout">
    <div class="photo-card vibes-card">
      <div class="photo-frame opening">
        <img src="/assets/posts/config-recap/venue-vibes.jpg" alt="Pics of the conference center themed inside and outside of Moscone">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Friends from the office :)</div>
        <div class="caption-sub">JPMC Payments teammates at Moscone Center</div>
      </div>
    </div>
    <div class="photo-card vibes-card">
      <div class="photo-frame opening">
        <img src="/assets/posts/config-recap/opening-day-lawn.jpg" alt="Group on the lawn outside the conference center">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Fresh Config branding inside and out!</div>
        <div class="caption-sub">Moscone Center San Francisco</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">The iterative conference</span>
      <div class="note-body">Since the start, Congif has grown like crazy each year at Moscone Center in San Francicisco. Each time I return the Figma team has put so much work into building a unique experience. In <a href="https://www.carletondesign.com/2023/06/23/config/">2023</a> they made it huge, and the crowds became an issue. Then next time logistics where improved, <a href="https://www.carletondesign.com/2024/06/29/config/">2024</a> was the start of AI and the Config brand expression was everywhere. I would say 2026 was even more optimized.</div>
    </div>
    <div class="photo-text">
      <span class="note-tag">Team learning</span>
      <div class="note-body">This year I joined with teammates and leaders from JPMorganChase's Payments Design team.</div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════ -->
<!-- 03 — Off the Grid -->
<!-- ══════════════════════════════════ -->

<h2 class="section-headline">Off the Grid</h2>
<div class="photo-section">
  <div class="film-strip"></div>
  <div class="photo-layout reverse">
    <div class="photo-card">
      <div class="photo-frame redwoods">
        <img src="/assets/posts/config-recap/redwoods-collage.jpg" alt="Hiking the redwoods trail">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Hiking through the giant costal redwoods ❤️</div>
        <div class="caption-sub">Muir Woods, Marin County</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">ESCAPE TO NATURE</span>
      <div class="note-body">My new favorite way to start a tech conference - escape tech and explore nature instead!<br><br><a href="https://www.linkedin.com/in/bencallahan/">Ben Callahan</a> organized a group hike through majestic redwoods at <a href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.nps.gov/muwo/&ved=2ahUKEwiXmYbZ47yVAxUnGTQIHU8aC5EQFnoECEgQAQ&usg=AOvVaw12mDuzbxE_nEXFSPduTvtn">Muir Woods National Monument</a>. These huge trees don't have deep roots like you would expect. Instead they have shallow roots that are interconnected so the trees can hold each other steady - a wonderful lesson for us.<br><br>Thanks to Ben (with sponsors <a href="https://sparkbox.com">Sparkbox</a>, <a href="https://southleft.com/ai-design-systems/">Southleft</a>, and <a href="https://aianddesign.systems">Brad Frost's AI course</a>) for providing a great event. If you're in the design system space, check out the <a href="https://bencallahan.com/redwoods">Redwoods community</a>.<br><br></div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════ -->
<!-- 02 — FAV TOPICS -->
<!-- ══════════════════════════════════ -->
<h2 class="section-headline">Fav Topics</h2>
<div class="notes-section">

  <div class="note-card">
    <span class="note-tag">Strategy + Culture</span>
    <div class="note-title">Design System Anarchy</div>
    <a href="https://www.youtube.com/watch?v=lY3dhHTJGWQ&t=1s" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/anarchy.jpg" alt="DS Anarchy slides">
    </div>
    <div class="note-body">
      I loved this talk by <a href="https://www.linkedin.com/in/laurenloprete/" target="_blank">Lauren LoPrete</a>. It told a great story using punk music venues to teach principles for fostering creativity.
      <ul style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        <li>Lauren says, “I didn’t go to art school to become a cop,” and she’s always cared more about building the conditions for great work than policing who gets to make it.</li>
        <li>Design systems work has drifted into compliance work — teams meant to lower barriers and raise quality have started acting like gatekeepers, adding stricter standards, more approval gates, and more process.</li>
        <li>AI tools are democratizing production the way the Xerox machine did for punk zines and flyers — when the means of production become this accessible, the scene grows, and you can’t govern your way out of that.</li>
        <li>Her framework — “design systems anarchy”: modeled on how punk scenes built infrastructure for creative chaos instead of containing it; the venues that lasted had the clearest values and the most genuine trust in the people they served.</li>
        <li>Conviction as a container, not a cage — hold firmly to core principles, and let everything else flex.</li>
        <li>Build “scenes instead of systems, venues instead of vaults.”</li>
        <li>A design system was never supposed to be permanent. It was supposed to be alive. Teams that hold the line against change will become irrelevant; teams that embrace it will be the ones that matter.</li>
      </ul>
    </div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/lauren.jpg" alt="Lauren owning the stage">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Workflow in collab</span>
    <div class="note-title">Reimagining NASA.gov for Earth’s most important stories</div>
    <a href="https://www.youtube.com/watch?v=GpACvdM6guc&t=17s" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/nasa.jpg" alt="NASA project highlight slides">
    </div>
    <div class="note-body">
      <a href="https://www.linkedin.com/in/benkshown/" target="_blank">Ben Shown</a> & <a href="https://www.linkedin.com/in/megan-greco-7328774a/" target="_blank">Megan Greco</a> got to design with the funnest client - NASA. Of course it was a serious project but I can only imagine it was so fun to use the photo archive of planets and spacecraft for their designs. 
      <ul style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        <li>NASA’s redesign succeeded because it grounded decisions in <b>audience motivations</b>, not just demographics, using an alternative to personas, they called 'Thinking Styles', to identify the underserved pragmatist as the key design driver.</li>
        <li>The team used a research-led, low-fi-first process: large-scale survey work, in-depth interviews, rough concept exploration, and repeated stakeholder critique to get better strategic feedback and build agency-wide ownership.</li>
        <li>Outcome was not just a visual refresh but a scalable system: Horizon gave NASA a consistent design foundation across thousands of sites and supported products like NASA.gov, NASA+, and the Kids site while preserving range for different audiences.</li>
      </ul>
       <br>BTW, It was fun to see these 'Thinking Styles' illustrated using Muppets charactes: Miss Piggy is the Pragmatist, Beaker is the Learner, Gonzo is the Explorer, and Kermit is the Connector. 
    </div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/muppets.jpg" alt="Muppets in the design process">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Service design with robots</span>
    <div class="note-title">Legibility by design</div>
    <a href="https://www.youtube.com/watch?v=2zmW-L1jtjc" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/waymo.jpg" alt="Ryan showing off the pedestrian signals on a Waymo vehicle">
    </div>
    <div class="note-body">
      <a href="https://www.linkedin.com/in/ryanapowell/" target="_blank">Ryan Powell</a> shared how Waymo is designing for legibility in autonomous vehicles.
      <ul style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        <li> The goal is to make the vehicle's intentions clear to pedestrians, cyclists, and other drivers.</li>
        <li>They are using a combination of visual signals, sounds, and vehicle behavior to communicate with the environment.</li>
        <li>One interesting point was how they are testing these signals in real-world scenarios to ensure they are intuitive and effective.</li>
        <li>It's a fascinating intersection of design, technology, and human behavior. My industrial design brain loves to see how hardware and software work together to improve experiences like this.</li>
      </ul>
      Of course, I had to include another Waymo ride while in SF. It was a fun experience to see the design decisions in action.
    </div>
    <div class="photo-frame lauren">
        <img src="/assets/posts/config-recap/robotride.jpg" alt="And I had to include a Waymo ride while in SF">
    </div>
  </div>

</div>

<!-- ══════════════════════════════════ -->
<!-- 04 — Socials -->
<!-- ══════════════════════════════════ -->
<h2 class="section-headline">Social networking</h2>
<div class="photo-section">
  <div class="film-strip"></div>
  <div class="photo-layout">
    <div class="photo-card">
      <div class="photo-frame dinner">
        <img src="/assets/posts/config-recap/social.jpg" alt="Social networking with design system friends">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Social events</div>
        <div class="caption-sub">Connecting with new and old friends</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">Meetups and friends</span>
      <ul class="note-body" style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        <li>Breakfast walk at the Embarcadero with <a href="https://www.ecrudot.ai">Ecru dot</a> group (thanks <a href="https://www.linkedin.com/in/nanxin-zhao/">Peter</a>!)</li>
        <li>Afternoon Hike in the Redwoods (see above)</li>
        <li>After conference Dinner with the Design systems community (thanks <a href="https://www.linkedin.com/in/ben-callahan/">Ben</a>!)</li>
        <li>Thanks to <a href="https://www.linkedin.com/in/manuschau/">Manus Chau</a> for the daily analysis durring our commute.</li>
      </ul>

    </div>
  </div>
</div>

 <!-- ══════════════════════════════════ -->
<!-- 04 — Wrap up -->
<!-- ══════════════════════════════════ -->
<h2 class="section-headline">Wrap up</h2>
<div class="photo-section">
  <div class="film-strip"></div>
  <div class="photo-text">
      <ul class="note-body" style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        <li>It was amazing to reconnect with friends and meet new folks while chatting about my favorite DS topics. </li>
        <li>Figma's announcements were interesting, but I think the best value is the inspiration from the community.</li>
      </ul>
      See you all next time!
    </div>
  </div>
</div>

<!-- ── FOOTER ── -->
<footer>
  <span class="footer-sig">Config 2026 — Moscone, San Francisco</span>
  <a href="https://www.carletondesign.com/blog/">Back to Carleton Design/Writing</a>

</footer>

<script>
  // ── ADD MEETUP ROW ──
  let meetupCount = 3;
</script>
<div class="lightbox" id="lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image viewer">×</button>
  <img id="lightbox-image" alt="Expanded photo">
</div>

<script>
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeButton = document.querySelector('.lightbox-close');

  document.querySelectorAll('.photo-frame img, .intro-photo-card img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
</script>
</body>
</html>

