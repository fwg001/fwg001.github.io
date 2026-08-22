---
layout: none
title: "Config 2026 - Recap"
date: 2026-07-06
permalink: /blog/config-2026/
---

<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<div class="config-recap-post">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap');
  body {
    background: #0a0a0a;
    margin: 0;
  }
  .config-recap-post {
    font-family: Inter, sans-serif;
    color: #f5f2eb;
    background: #0a0a0a;
    line-height: 1.8;
    min-height: 100vh;
    padding-bottom: 24px;
    overflow-x: hidden;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
  }
  .config-recap-post * { box-sizing: border-box; }
  .config-recap-post .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .config-recap-post a { color: #8bbcff; text-decoration: underline; }
  .config-recap-post a:hover, .config-recap-post a:focus-visible { color: #b9d6ff; }
  .config-recap-post header {
    padding: clamp(40px, 6vw, 80px) clamp(24px, 6vw, 60px) clamp(24px, 5vw, 60px);
    border-bottom: 1px solid #2a2a2a;
  }
  .config-recap-post h1 {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(40px, 6vw, 96px);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.03em;
    color: #f5f2eb;
    margin: 0;
  }
  .config-recap-post .header-eyebrow {
    font-family: "Space Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #888880;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .config-recap-post .intro-strip {
    padding: clamp(28px, 5vw, 48px) clamp(24px, 6vw, 60px);
    border-bottom: 1px solid #2a2a2a;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(20px, 3vw, 40px);
    align-items: start;
  }
  .config-recap-post .intro-text {
    font-size: clamp(16px, 1.7vw, 18px);
    color: #aaa9a0;
    font-weight: 300;
    max-width: 680px;
  }
  .config-recap-post .intro-text.figma-frame {
    background: #111;
    border: 1px solid #252525;
    padding: 28px;
    margin-top: 8px;
  }
  .config-recap-post .numbered-list {
    list-style: none;
    counter-reset: step-count;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .config-recap-post .numbered-list li {
    counter-increment: step-count;
    position: relative;
    padding-left: 40px;
  }
  .config-recap-post .numbered-list li::before {
    content: "0" counter(step-count);
    position: absolute;
    left: 0;
    top: 1px;
    font-family: "Space Mono", monospace;
    font-weight: 700;
    font-size: 13px;
  }
  .config-recap-post .numbered-list li:nth-child(3n+1)::before { color: #F24E1E; }
  .config-recap-post .numbered-list li:nth-child(3n+2)::before { color: #1ABCFE; }
  .config-recap-post .numbered-list li:nth-child(3n+3)::before { color: #A259FF; }
  .config-recap-post .intro-text b { color: #f5f2eb; font-weight: 500; }
  .config-recap-post .photo-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 10px 10px 0 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.6);
    width: 100%;
  }
  .config-recap-post .intro-photo-card { max-width: 560px; margin-left: auto; }
  .config-recap-post .figma-frame {
    position: relative;
    outline: 1px dashed #0ACF83;
    outline-offset: 8px;
  }
  .config-recap-post .figma-frame .frame-label {
    position: absolute;
    top: -32px;
    left: -8px;
    font-family: "Space Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.05em;
    color: #0ACF83;
    background: #0a0a0a;
    border: 1px solid #0ACF83;
    padding: 2px 6px;
    white-space: nowrap;
  }
  .config-recap-post .figma-frame .frame-handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #0a0a0a;
    border: 2px solid #0ACF83;
    z-index: 2;
  }
  .config-recap-post .figma-frame .frame-handle.tl { top: -12px; left: -12px; }
  .config-recap-post .figma-frame .frame-handle.tr { top: -12px; right: -12px; }
  .config-recap-post .figma-frame .frame-handle.bl { bottom: -12px; left: -12px; }
  .config-recap-post .figma-frame .frame-handle.br { bottom: -12px; right: -12px; }
  .config-recap-post .wrap-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
  .config-recap-post .wrap-close {
    max-width: 560px;
    background: #111;
    border: 1px solid #252525;
    padding: 28px;
  }
  .config-recap-post .wrap-sign {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 4vw, 56px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #f5f2eb;
    max-width: 420px;
  }
  .config-recap-post .photo-frame {
    width: 100%;
    background: #1c1c1c;
    overflow: hidden;
    border-bottom: 1px solid #222;
    aspect-ratio: 3 / 2;
  }
  .config-recap-post .photo-frame img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  .config-recap-post .photo-caption { padding: 10px 6px 10px; background: #fff; }
  .config-recap-post .caption-title { font-family: "Space Mono", monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
  .config-recap-post .caption-sub { font-family: "Space Mono", monospace; font-size: 10px; color: #595959; }
  .config-recap-post .section-headline {
    font-family: "Space Mono", monospace;
    font-size: clamp(20px, 2.6vw, 34px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #f5f2eb;
    margin: 0;
    padding: clamp(28px, 4vw, 40px) clamp(24px, 6vw, 60px) 16px;
  }
  .config-recap-post .section-headline::before {
    content: "// ";
    color: #0ACF83;
  }
  .config-recap-post .photo-section {
    padding: clamp(24px, 4vw, 40px) clamp(24px, 6vw, 60px) clamp(32px, 5vw, 60px);
    border-top: 1px solid #2a2a2a;
    border-bottom: 1px solid #2a2a2a;
  }
  .config-recap-post .photo-layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: start; }
  .config-recap-post .photo-layout.reverse { grid-template-columns: 1fr 1.3fr; }
  .config-recap-post .photo-layout.full { grid-template-columns: 1fr; }
  .config-recap-post .photo-layout.pair { grid-template-columns: 1fr 1fr; }
  .config-recap-post .photo-layout.full .photo-card { max-width: none; }
  .config-recap-post .photo-layout.full .photo-frame { aspect-ratio: 16 / 7; }
  .config-recap-post .photo-layout.reverse .photo-card { order: 2; }
  .config-recap-post .photo-layout.reverse .photo-text { order: 1; }
  .config-recap-post .photo-text { display: flex; flex-direction: column; gap: 14px; }
  .config-recap-post .note-tag { font-family: "Space Mono", monospace; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #0ACF83; }
  .config-recap-post .note-body { font-size: clamp(16px, 1.7vw, 18px); line-height: 1.8; color: #aaa9a0; padding-left: 0; }
  .config-recap-post .note-body ul,
  .config-recap-post ul.note-body:not(.numbered-list) {
    list-style: none;
    padding-left: 0;
    margin: 10px 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .config-recap-post .note-body:not(.numbered-list) li,
  .config-recap-post ul.note-body:not(.numbered-list) li {
    position: relative;
    padding-left: 20px;
  }
  .config-recap-post .note-body:not(.numbered-list) li::before,
  .config-recap-post ul.note-body:not(.numbered-list) li::before {
    content: "—";
    position: absolute;
    left: 0;
    font-family: "Space Mono", monospace;
    font-weight: 700;
  }
  .config-recap-post .note-body:not(.numbered-list) li:nth-child(3n+1)::before,
  .config-recap-post ul.note-body:not(.numbered-list) li:nth-child(3n+1)::before { color: #F24E1E; }
  .config-recap-post .note-body:not(.numbered-list) li:nth-child(3n+2)::before,
  .config-recap-post ul.note-body:not(.numbered-list) li:nth-child(3n+2)::before { color: #1ABCFE; }
  .config-recap-post .note-body:not(.numbered-list) li:nth-child(3n+3)::before,
  .config-recap-post ul.note-body:not(.numbered-list) li:nth-child(3n+3)::before { color: #A259FF; }
  .config-recap-post .notes-section { 
    padding: clamp(24px, 4vw, 40px) clamp(24px, 6vw, 60px) clamp(32px, 5vw, 60px); 
    border-top: 1px solid #2a2a2a;
    border-bottom: 1px solid #2a2a2a; 
    display: grid; 
    grid-template-columns: repeat(2, minmax(0, 1fr)); 
    gap: 32px;
    width: 100%;
    margin: 0;
  }
  .config-recap-post .note-card { background: #111; border: 1px solid #252525; padding: 28px; display: flex; flex-direction: column; gap: 14px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); }
  .config-recap-post .note-card .note-tag {
    display: inline-block;
    align-self: flex-start;
    background: #A259FF;
    color: #0a0a0a;
    padding: 3px 10px;
    border-radius: 3px;
    letter-spacing: 0.05em;
  }
  .config-recap-post .note-card:nth-child(3n+1) .note-tag { background: #F24E1E; }
  .config-recap-post .note-card:nth-child(3n+2) .note-tag { background: #1ABCFE; }
  .config-recap-post .note-card:nth-child(3n+3) .note-tag { background: #A259FF; }
  .config-recap-post .notes-section .note-card:last-child { grid-column: 1 / -1; }
  .config-recap-post .notes-section .note-card:last-child .photo-frame,
  .config-recap-post .notes-section .note-card:last-child .note-body { max-width: 640px; }
  .config-recap-post .notes-section .note-card:last-child .photo-frame:last-child { aspect-ratio: 2 / 1; }
  .config-recap-post .note-title { font-family: "Space Grotesk", sans-serif; font-size: 22px; font-weight: 600; line-height: 1.2; color: #f5f2eb; margin: 0; }
  .config-recap-post .topic-link { font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #8bbcff; text-decoration: underline; align-self: flex-start; }
  .config-recap-post .note-divider { height: 1px; background: #1e1e1e; }
  .config-recap-post footer { padding: clamp(24px, 4vw, 40px) clamp(24px, 6vw, 60px); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .config-recap-post .footer-sig { font-family: "Space Mono", monospace; font-style: normal; font-size: 14px; letter-spacing: 0.05em; color: #0ACF83; }
  @media (max-width: 900px) {
    .config-recap-post .intro-strip { grid-template-columns: 1fr; }
    .config-recap-post .photo-layout, .config-recap-post .photo-layout.reverse, .config-recap-post .photo-layout.pair { grid-template-columns: 1fr; }
    .config-recap-post .photo-layout.reverse .photo-card, .config-recap-post .photo-layout.reverse .photo-text { order: initial; }
    .config-recap-post .notes-section { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .config-recap-post header,
    .config-recap-post .intro-strip,
    .config-recap-post .section-headline,
    .config-recap-post .photo-section,
    .config-recap-post .notes-section,
    .config-recap-post footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    .config-recap-post .note-card {
      padding: 20px;
    }

    .config-recap-post footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

<header>
  <div>
    <div class="header-eyebrow"><a href="/">Back to Carleton design</a></div>
    <h1>Config 2026 - Recap</h1>
  </div>
</header>

<main>
<div class="intro-strip">
  <div class="intro-text figma-frame">
    <div class="frame-label" aria-hidden="true">// INTRO</div>
    <ul class="numbered-list" role="list">
      <li>Three days at <b>Moscone Center, San Francisco</b>.</li>
      <li>Dozens of sessions, side conversations, and Figma product reveals.</li>
      <li>Here's what stuck — the sessions worth rewatching, the people worth following up with, and the ideas that hit. </li>
    </ul><!--more-->
    <span class="frame-handle tl"></span>
    <span class="frame-handle tr"></span>
    <span class="frame-handle bl"></span>
    <span class="frame-handle br"></span>
  </div>
  <div class="photo-card intro-photo-card">
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/badge.jpg' | relative_url }}" alt="Conference badge and lanyard with Config 2026 logo">
    </div>
    <div class="photo-caption">
      <div class="caption-title">Badge &amp; tote</div>
      <div class="caption-sub">Config is always strong on it's branding</div>
    </div>
  </div>
</div>

<h2 class="section-headline">Venue Vibes</h2>
<div class="photo-section">
  <div class="photo-layout pair">
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/venue-vibes.jpg' | relative_url }}" alt="Pics of the conference center themed inside and outside of Moscone">
      </div>
      <div class="photo-caption">
       <div class="caption-title">Fresh Config branding inside and out</div>
        <div class="caption-sub">Moscone Center San Francisco</div>
      </div>
    </div>
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/opening-day-lawn.jpg' | relative_url }}" alt="Group on the lawn outside the conference center">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Friends from the office :)</div>
        <div class="caption-sub">JPMC Payments teammates at Moscone Center</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">The iterative conference</span>
      <div class="note-body">Since the start, Config has grown like crazy each year at Moscone Center in San Francicisco. Each time I return the Figma team has put so much work into building a unique experience that feels fresh and intentional. It's a masterclass in conference design.</div>
    </div>
    <div class="photo-text">
      <span class="note-tag">Team learning</span>
      <div class="note-body">This year I joined with teammates and leaders from JPMorganChase's Payments Design team.</div>
    </div>
  </div>
</div>

<h2 class="section-headline">Off the Grid</h2>
<div class="photo-section">
  <div class="photo-layout reverse">
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/redwoods-collage.jpg' | relative_url }}" alt="Hiking the redwoods trail">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Hiking through the giant coastal redwoods ❤️</div>
        <div class="caption-sub">Muir Woods, Marin County</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">Escape to nature</span>
      <div class="note-body">My new favorite way to start a tech conference - escape tech and explore nature instead! <a href="https://www.linkedin.com/in/bencallahan/">Ben Callahan</a> organized a great group hike through the redwoods. Being surrounded by 2,000-year-old trees puts everything in perspective.</div>
    </div>
  </div>
</div>

<h2 class="section-headline">Fav Topics</h2>
<div class="notes-section">
  <div class="note-card">
    <span class="note-tag">Strategy + Culture</span>
    <h3 class="note-title">Design System Anarchy</h3>
    <a href="https://www.youtube.com/watch?v=lY3dhHTJGWQ&t=1s" class="topic-link">Watch the video<span class="visually-hidden">: Design System Anarchy</span></a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/anarchy.jpg' | relative_url }}" alt="DS Anarchy slides">
    </div>
    <div class="note-body">I loved this talk by <a href="https://www.linkedin.com/in/laurenloprete/">Lauren LoPrete</a>. It told a great story using punk music venues to teach principles for fostering creativity within structure. Key takeaways:
      <ul role="list">
        <li>Lauren says, "I didn't go to art school to become a cop," and she's always cared more about building the conditions for great work than policing who gets to make it.</li>
        <li>Design systems work has drifted into compliance work — teams meant to lower barriers and raise quality have started acting like gatekeepers, adding stricter standards, more approval gates, more process.</li>
        <li>AI tools are democratizing production the way the Xerox machine did for punk zines and flyers — when the means of production become this accessible, the scene grows, and you can't govern it the old way.</li>
        <li>Her framework — "design systems anarchy": modeled on how punk scenes built infrastructure for creative chaos instead of containing it; the venues that lasted had the clearest values and the most trust.</li>
        <li>Conviction as a container, not a cage — hold firmly to core principles, and let everything else flex.</li>
        <li>Build "scenes instead of systems, venues instead of vaults."</li>
        <li>A design system was never supposed to be permanent. It was supposed to be alive.</li>
      </ul>
    </div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/lauren.jpg' | relative_url }}" alt="Lauren owning the stage">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Workflow in collab</span>
    <h3 class="note-title">Reimagining NASA.gov for Earth's most important stories</h3>
    <a href="https://www.youtube.com/watch?v=GpACvdM6guc&t=17s" class="topic-link">Watch the video<span class="visually-hidden">: Reimagining NASA.gov for Earth's most important stories</span></a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/nasa.jpg' | relative_url }}" alt="NASA project highlight slides">
    </div>
    <div class="note-body"><a href="https://www.linkedin.com/in/benkshown/">Ben Shown</a> and <a href="https://www.linkedin.com/in/megan-greco-7328774a/">Megan Greco</a> got to design with the funnest team at NASA. Some highlights:
      <ul role="list">
        <li>NASA's redesign succeeded because it grounded decisions in <b>audience motivations</b>, not just demographics, using an alternative to personas, they called "Thinking Styles", to identify how people approach problems differently.</li>
        <li>The team used a research-led, low-fi-first process: large-scale survey work, in-depth interviews, rough concept exploration, and repeated stakeholder critique to get better strategic feedback faster.</li>
        <li>Outcome was not just a visual refresh but a scalable system: Horizon gave NASA a consistent design foundation across thousands of sites and supported products like NASA.gov, NASA+, and the Space App Challenge platform.</li>
      </ul>
      BTW, it was fun to see these "Thinking Styles" illustrated using Muppets characters: Miss Piggy is the Pragmatist, Beaker is the Learner, Gonzo is the Explorer, and Kermit is the Connector.
    </div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/muppets.jpg' | relative_url }}" alt="Muppets in the design process">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Service design with robots</span>
    <h3 class="note-title">Legibility by design</h3>
    <a href="https://www.youtube.com/watch?v=2zmW-L1jtjc" class="topic-link">Watch the video<span class="visually-hidden">: Legibility by design</span></a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/waymo.jpg' | relative_url }}" alt="Ryan showing off the pedestrian signals on a Waymo vehicle">
    </div>
    <div class="note-body"><a href="https://www.linkedin.com/in/ryanapowell/">Ryan Powell</a> shared how Waymo is designing for legibility in autonomous vehicles.
      <ul role="list">
        <li>The goal is to make the vehicle's intentions clear to pedestrians, cyclists, and other drivers.</li>
        <li>They are using a combination of visual signals, sounds, and vehicle behavior to communicate with the environment.</li>
        <li>One interesting point was how they are testing these signals in real-world scenarios to ensure they are intuitive and effective.</li>
        <li>It's a fascinating intersection of design, technology, and human behavior.</li>
      </ul>
      Of course, I had to include another Waymo ride while in SF. It was a fun experience to see the design decisions in action.
    </div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/robotride.jpg' | relative_url }}" alt="And I had to include a Waymo ride while in SF">
    </div>
  </div>
</div>

<h2 class="section-headline">Social networking</h2>
<div class="photo-section">
  <div class="photo-layout full">
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/social.jpg' | relative_url }}" alt="Social networking with design system friends">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Social events</div>
        <div class="caption-sub">Connecting with new and old friends</div>
      </div>
    </div>
    <div class="photo-text">
      <span class="note-tag">Meetups and friends</span>
      <ul class="note-body" role="list">
        <li>Breakfast walk at the Embarcadero with <a href="https://www.ecrudot.ai">Ecru dot</a> group (thanks <a href="https://www.linkedin.com/in/nanxin-zhao/">Peter</a>!)</li>
        <li>Afternoon Hike in the Redwoods (see above)</li>
        <li>After conference Dinner with the Design systems community (thanks <a href="https://www.linkedin.com/in/ben-callahan/">Ben</a>!)</li>
        <li>Thanks to <a href="https://www.linkedin.com/in/manuschau/">Manus Chau</a> for the daily analysis durring our commute.</li>
      </ul>
    </div>
  </div>
</div>

<h2 class="section-headline">Wrap up</h2>
<div class="photo-section">
  <div class="wrap-layout">
    <div class="photo-text wrap-close figma-frame">
      <div class="frame-label" aria-hidden="true">// EOF</div>
      <ul class="note-body numbered-list" role="list">
        <li>It was amazing to reconnect with friends and meet new folks while chatting about my favorite DS topics.</li>
        <li>Figma's announcements were interesting, but I think the best value is the inspiration from the community.</li>
      </ul>
      <span class="frame-handle tl"></span>
      <span class="frame-handle tr"></span>
      <span class="frame-handle bl"></span>
      <span class="frame-handle br"></span>
    </div>
    <div class="wrap-sign">See you all next time!</div>
  </div>
</div>
</main>

<footer>
  <span class="footer-sig">Config 2026 — Moscone, San Francisco</span>
  <a href="https://www.carletondesign.com/blog/">Back to Carleton Design/Writing</a>
</footer>
</div>
