---
layout: page
title: Portfolio

carousel1:
 - image: /assets/shn/shn.jpg
 - image: /assets/shn/shn1.jpg
 - image: /assets/shn/shn3.jpg

carousel2:
 - image: /assets/rdc_local/rdc_local.jpg
 - image: /assets/rdc_local/rdc_local1.jpg
 - image: /assets/rdc_local/rdc_local2.jpg
 
carousel3:
 - image: /assets/rdc_map/rdc_map.jpg
 - image: /assets/rdc_map/rdc_map1.jpg
 - image: /assets/rdc_map/rdc_map2.jpg


---
## [SeniorHousingNet](/portfolio/shn/)

<div class="flexslider1">
  <ul class="slides">
    {% for slides in page.carousel1 %}
      <li><img src="{{ slides.image }}"></li>
    {% endfor %}
  </ul>
</div> 

- *Project*: SeniorHousingNet.com - Responsive Redesign
- *Roles*: Lead UX Designer (Visual & Interaction), Tech Advisor, QA
- *Description*: I helped our small team make big waves in the company with a trailblazing responsive redesign for our Senior Living community pages.
- [Additional Details](/portfolio/shn/)

 
 
## [Realtor.com Local](/portfolio/rdc_local/)

<div class="flexslider2">
  <ul class="slides">
    {% for slides in page.carousel2 %}
      <li><img src="{{ slides.image }}"></li>
    {% endfor %}
  </ul>
</div>

- *Project*: Realtor.com - New Local section
- *Roles*: Lead UX Designer (Visual & Interaction)
- *Description*: Transforming raw data into an experience with a story
- [Additional Details](/portfolio/rdc_local/)



## [Realtor.com Maps](/portfolio/rdc_map/)

<div class="flexslider3">
  <ul class="slides">
    {% for slides in page.carousel3 %}
      <li><img src="{{ slides.image }}"></li>
    {% endfor %}
  </ul>
</div>

- *Project*: Realtor.com - Search Result Maps Upgrade/Redesign
- *Roles*:  UX Designer (Visual & Interaction)
- *Description*: We created a fresh visual system and new map interaction patterns on an upgraded map platform. 
- [Additional Details](/portfolio/rdc_map/)
