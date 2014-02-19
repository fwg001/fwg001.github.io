---
layout: page
title: Blog
---
<div class="posts">
<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date_to_string }} | <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
</div>


