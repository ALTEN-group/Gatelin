import{b as a,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Services","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-services.md","filePath":"guide/api-services.md"}'),t={name:"guide/api-services.md"};function i(l,s,c,o,r,u){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="services" tabindex="-1">Services <a class="header-anchor" href="#services" aria-label="Permalink to &quot;Services&quot;">​</a></h1><p>Services represent the backend microservices that routes can forward requests to.</p><h2 id="search-services" tabindex="-1">Search Services <a class="header-anchor" href="#search-services" aria-label="Permalink to &quot;Search Services&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/services/search</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;pagination&quot;: true,</span></span>
<span class="line"><span>  &quot;first&quot;: 0,</span></span>
<span class="line"><span>  &quot;limit&quot;: 10,</span></span>
<span class="line"><span>  &quot;sortField&quot;: &quot;id&quot;,</span></span>
<span class="line"><span>  &quot;filters&quot;: {</span></span>
<span class="line"><span>    &quot;name&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: &quot;user&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-service-history" tabindex="-1">Get Service History <a class="header-anchor" href="#get-service-history" aria-label="Permalink to &quot;Get Service History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/services/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-service" tabindex="-1">Create Service <a class="header-anchor" href="#create-service" aria-label="Permalink to &quot;Create Service&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/services</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;user&quot;,</span></span>
<span class="line"><span>      &quot;pattern&quot;: &quot;my-api&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="update-service" tabindex="-1">Update Service <a class="header-anchor" href="#update-service" aria-label="Permalink to &quot;Update Service&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/services</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;user-service&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="archive-services" tabindex="-1">Archive Services <a class="header-anchor" href="#archive-services" aria-label="Permalink to &quot;Archive Services&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/services/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p>`,13)])])}const v=a(t,[["render",i]]);export{h as __pageData,v as default};
