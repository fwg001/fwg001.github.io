---
layout: page
title: Blog
---
<div class="posts">
<ul>
  {% for post in site.posts %}   
    <li>
      <div class="post">
      	<a href="{{ post.url }}">{{ post.title }}</a> | {{ post.date | date_to_string }}
      	<p>{{ post.excerpt | strip_html }}...</p>
      </div>
    </li>
  {% endfor %}
</ul></div>
