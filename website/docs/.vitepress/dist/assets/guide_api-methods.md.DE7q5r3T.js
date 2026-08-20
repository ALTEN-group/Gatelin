import{b as s,I as n,g as e,j as t}from"./chunks/framework.CrSplIeq.js";const u=JSON.parse('{"title":"Methods","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-methods.md","filePath":"guide/api-methods.md"}'),p={name:"guide/api-methods.md"};function o(i,a,l,d,c,r){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;Methods&quot;">​</a></h1><p>Methods represent HTTP methods (GET, POST, PUT, DELETE, etc.) available on Gatelin. They are read-only reference data — only updates are supported.</p><h2 id="search-methods" tabindex="-1">Search Methods <a class="header-anchor" href="#search-methods" aria-label="Permalink to &quot;Search Methods&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/methods/search</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;pagination&quot;: true,</span></span>
<span class="line"><span>  &quot;first&quot;: 0,</span></span>
<span class="line"><span>  &quot;limit&quot;: 10,</span></span>
<span class="line"><span>  &quot;sortField&quot;: &quot;id&quot;,</span></span>
<span class="line"><span>  &quot;sortOrder&quot;: &quot;ASC&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-method-history" tabindex="-1">Get Method History <a class="header-anchor" href="#get-method-history" aria-label="Permalink to &quot;Get Method History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/methods/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="update-method" tabindex="-1">Update Method <a class="header-anchor" href="#update-method" aria-label="Permalink to &quot;Update Method&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/methods</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;GET&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p>`,9)])])}const m=s(p,[["render",o]]);export{u as __pageData,m as default};
