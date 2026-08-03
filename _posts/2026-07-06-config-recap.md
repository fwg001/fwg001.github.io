---
layout: post
title: "Config 2026 - Recap"
date: 2026-08-02
permalink: /blog/config-2026/
---

<div class="config-recap-post">
<style>
  .config-recap-post {
    font-family: Inter, sans-serif;
    color: #f5f2eb;
    background: #0a0a0a;
    line-height: 1.8;
    max-width: 1400px;
    margin: 0 auto;
    padding-bottom: 24px;
  }
  .config-recap-post * { box-sizing: border-box; }
  .config-recap-post a { color: #8bbcff; text-decoration: underline; }
  .config-recap-post a:hover, .config-recap-post a:focus-visible { color: #b9d6ff; }
  .config-recap-post header { padding: 80px 60px 60px; border-bottom: 1px solid #2a2a2a; }
  .config-recap-post h1 {
    font-family: "Playfair Display", serif;
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 400;
    line-height: 0.92;
    letter-spacing: -0.02em;
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
    padding: 48px 60px;
    border-bottom: 1px solid #2a2a2a;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    align-items: start;
  }
  .config-recap-post .intro-text {
    font-size: 18px;
    color: #aaa9a0;
    font-weight: 300;
    max-width: 680px;
  }
  .config-recap-post .intro-text ul {
    padding-left: 20px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
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
  .config-recap-post .caption-title { font-size: 13px; font-weight: 500; color: #1a1a1a; }
  .config-recap-post .caption-sub { font-family: "Space Mono", monospace; font-size: 10px; color: #595959; }
  .config-recap-post .section-headline {
    font-family: "Playfair Display", serif;
    font-size: clamp(32px, 4vw, 54px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #f5f2eb;
    margin: 20px 60px 0;
  }
  .config-recap-post .photo-section { padding: 40px 60px 60px; border-bottom: 1px solid #2a2a2a; }
  .config-recap-post .photo-layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: start; }
  .config-recap-post .photo-layout.reverse { grid-template-columns: 1fr 1.3fr; }
  .config-recap-post .photo-layout.reverse .photo-card { order: 2; }
  .config-recap-post .photo-layout.reverse .photo-text { order: 1; }
  .config-recap-post .photo-text { display: flex; flex-direction: column; gap: 14px; }
  .config-recap-post .note-tag { font-family: "Space Mono", monospace; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8c547; }
  .config-recap-post .note-body { font-size: 18px; line-height: 1.8; color: #aaa9a0; padding-left: 0; }
  .config-recap-post .notes-section { padding: 40px 60px 60px; border-bottom: 1px solid #2a2a2a; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .config-recap-post .note-card { background: #111; border: 1px solid #252525; padding: 28px; display: flex; flex-direction: column; gap: 14px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); }
  .config-recap-post .note-title { font-family: "Playfair Display", serif; font-size: 22px; font-weight: 400; line-height: 1.2; color: #f5f2eb; }
  .config-recap-post .topic-link { font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #8bbcff; text-decoration: underline; align-self: flex-start; }
  .config-recap-post .note-divider { height: 1px; background: #1e1e1e; }
  .config-recap-post footer { padding: 40px 60px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .config-recap-post .footer-sig { font-family: "Playfair Display", serif; font-style: italic; font-size: 16px; color: #7e7e76; }
  @media (max-width: 900px) {
    .config-recap-post header, .config-recap-post .intro-strip, .config-recap-post .section-headline, .config-recap-post .photo-section, .config-recap-post .notes-section, .config-recap-post footer { padding-left: 28px; padding-right: 28px; }
    .config-recap-post .intro-strip { grid-template-columns: 1fr; }
    .config-recap-post .photo-layout, .config-recap-post .photo-layout.reverse { grid-template-columns: 1fr; }
    .config-recap-post .photo-layout.reverse .photo-card, .config-recap-post .photo-layout.reverse .photo-text { order: initial; }
    .config-recap-post .notes-section { grid-template-columns: 1fr; }
  }
</style>

<header>
  <div>
    <div class="header-eyebrow">Figma Config 2026 · Field Notes</div>
    <h1>Config 2026 - Recap</h1>
  </div>
</header>

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
      <img src="{{ '/assets/posts/config-recap/badge.jpg' | relative_url }}" alt="Conference badge and lanyard with Config 2026 logo">
    </div>
    <div class="photo-caption">
      <div class="caption-title">Badge &amp; tote energy</div>
      <div class="caption-sub">Config is always strong on branding</div>
    </div>
  </div>
</div>

<h2 class="section-headline">Venue Vibes</h2>
<div class="photo-section">
  <div class="photo-layout">
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/venue-vibes.jpg' | relative_url }}" alt="Pics of the conference center themed inside and outside of Moscone">
      </div>
      <div class="photo-caption">
        <div class="caption-title">Friends from the office :)</div>
        <div class="caption-sub">JPMC Payments teammates at Moscone Center</div>
      </div>
    </div>
    <div class="photo-card">
      <div class="photo-frame">
        <img src="{{ '/assets/posts/config-recap/opening-day-lawn.jpg' | relative_url }}" alt="Group on the lawn outside the conference center">
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
      <div class="note-body">My new favorite way to start a tech conference - escape tech and explore nature instead! <a href="https://www.linkedin.com/in/bencallahan/">Ben Callahan</a> organized a group hike through majestic redwoods at <a href="https://www.nps.gov/muwo/">Muir Woods National Monument</a>. These huge trees don't have deep roots like you would expect. Instead they have shallow roots that are interconnected so the trees can hold each other steady - a wonderful lesson for us.<br><br>Thanks to Ben (with sponsors <a href="https://sparkbox.com">Sparkbox</a>, <a href="https://southleft.com/ai-design-systems/">Southleft</a>, and <a href="https://aianddesign.systems">Brad Frost's AI course</a>) for providing a great event. If you're in the design system space, check out the <a href="https://bencallahan.com/redwoods">Redwoods community</a>.</div>
    </div>
  </div>
</div>

<h2 class="section-headline">Fav Topics</h2>
<div class="notes-section">
  <div class="note-card">
    <span class="note-tag">Strategy + Culture</span>
    <div class="note-title">Design System Anarchy</div>
    <a href="https://www.youtube.com/watch?v=lY3dhHTJGWQ&t=1s" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/anarchy.jpg' | relative_url }}" alt="DS Anarchy slides">
    </div>
    <div class="note-body">I loved this talk by <a href="https://www.linkedin.com/in/laurenloprete/">Lauren LoPrete</a>. It told a great story using punk music venues to teach principles for fostering creativity.
      <ul>
        <li>Lauren says, “I didn’t go to art school to become a cop,” and she’s always cared more about building the conditions for great work than policing who gets to make it.</li>
        <li>Design systems work has drifted into compliance work — teams meant to lower barriers and raise quality have started acting like gatekeepers, adding stricter standards, more approval gates, and more process.</li>
        <li>AI tools are democratizing production the way the Xerox machine did for punk zines and flyers — when the means of production become this accessible, the scene grows, and you can’t govern your way out of that.</li>
        <li>Her framework — “design systems anarchy”: modeled on how punk scenes built infrastructure for creative chaos instead of containing it; the venues that lasted had the clearest values and the most genuine trust in the people they served.</li>
        <li>Conviction as a container, not a cage — hold firmly to core principles, and let everything else flex.</li>
        <li>Build “scenes instead of systems, venues instead of vaults.”</li>
        <li>A design system was never supposed to be permanent. It was supposed to be alive.</li>
      </ul>
    </div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/lauren.jpg' | relative_url }}" alt="Lauren owning the stage">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Workflow in collab</span>
    <div class="note-title">Reimagining NASA.gov for Earth’s most important stories</div>
    <a href="https://www.youtube.com/watch?v=GpACvdM6guc&t=17s" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/nasa.jpg' | relative_url }}" alt="NASA project highlight slides">
    </div>
    <div class="note-body"><a href="https://www.linkedin.com/in/benkshown/">Ben Shown</a> and <a href="https://www.linkedin.com/in/megan-greco-7328774a/">Megan Greco</a> got to design with the funnest client - NASA. Of course it was a serious project but I can only imagine it was so fun to use the photo archive of planets and spacecraft for their designs.
      <ul>
        <li>NASA’s redesign succeeded because it grounded decisions in <b>audience motivations</b>, not just demographics, using an alternative to personas, they called “Thinking Styles”, to identify the underserved pragmatist as the key design driver.</li>
        <li>The team used a research-led, low-fi-first process: large-scale survey work, in-depth interviews, rough concept exploration, and repeated stakeholder critique to get better strategic feedback and build agency-wide ownership.</li>
        <li>Outcome was not just a visual refresh but a scalable system: Horizon gave NASA a consistent design foundation across thousands of sites and supported products like NASA.gov, NASA+, and the Kids site while preserving range for different audiences.</li>
      </ul>
      BTW, it was fun to see these “Thinking Styles” illustrated using Muppets characters: Miss Piggy is the Pragmatist, Beaker is the Learner, Gonzo is the Explorer, and Kermit is the Connector.
    </div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/muppets.jpg' | relative_url }}" alt="Muppets in the design process">
    </div>
  </div>

  <div class="note-card">
    <span class="note-tag">Service design with robots</span>
    <div class="note-title">Legibility by design</div>
    <a href="https://www.youtube.com/watch?v=2zmW-L1jtjc" class="topic-link">Watch the video</a>
    <div class="note-divider"></div>
    <div class="photo-frame">
      <img src="{{ '/assets/posts/config-recap/waymo.jpg' | relative_url }}" alt="Ryan showing off the pedestrian signals on a Waymo vehicle">
    </div>
    <div class="note-body"><a href="https://www.linkedin.com/in/ryanapowell/">Ryan Powell</a> shared how Waymo is designing for legibility in autonomous vehicles.
      <ul>
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
  <div class="photo-layout">
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
      <ul class="note-body">
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
  <div class="photo-text">
    <ul class="note-body">
      <li>It was amazing to reconnect with friends and meet new folks while chatting about my favorite DS topics.</li>
      <li>Figma's announcements were interesting, but I think the best value is the inspiration from the community.</li>
    </ul>
    <p>See you all next time!</p>
  </div>
</div>

<footer>
  <span class="footer-sig">Config 2026 — Moscone, San Francisco</span>
  <a href="https://www.carletondesign.com/blog/">Back to Carleton Design/Writing</a>
</footer>
</div>
