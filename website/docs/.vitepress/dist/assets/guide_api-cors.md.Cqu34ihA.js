import{b as a,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"CORS","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-cors.md","filePath":"guide/api-cors.md"}'),t={name:"guide/api-cors.md"};function i(o,s,l,c,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="cors" tabindex="-1">CORS <a class="header-anchor" href="#cors" aria-label="Permalink to &quot;CORS&quot;">​</a></h1><p>CORS origins are stored in the database and dynamically applied without requiring a service restart. The middleware runs before route matching so preflight <code>OPTIONS</code> requests short-circuit with <code>204</code>.</p><p>Allowed request headers include <code>Content-Type</code>, <code>Authorization</code>, and <code>X-CSRF-Token</code>. When an origin has <code>credentials: true</code>, responses include <code>Access-Control-Allow-Credentials: true</code>.</p><h2 id="search-cors-origins" tabindex="-1">Search CORS Origins <a class="header-anchor" href="#search-cors-origins" aria-label="Permalink to &quot;Search CORS Origins&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/cors/search</span></span>
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
<span class="line"><span>      &quot;value&quot;: &quot;app.example.com&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-cors-history" tabindex="-1">Get CORS History <a class="header-anchor" href="#get-cors-history" aria-label="Permalink to &quot;Get CORS History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/cors/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="add-cors-origin" tabindex="-1">Add CORS Origin <a class="header-anchor" href="#add-cors-origin" aria-label="Permalink to &quot;Add CORS Origin&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/cors</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;https://app.example.com&quot;,</span></span>
<span class="line"><span>      &quot;credentials&quot;: true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created):</strong> The new origin is immediately added to the CORS whitelist.</p><h2 id="update-cors-origin" tabindex="-1">Update CORS Origin <a class="header-anchor" href="#update-cors-origin" aria-label="Permalink to &quot;Update CORS Origin&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/cors</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;https://updated.example.com&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK):</strong> The CORS whitelist is automatically updated.</p><h2 id="archive-cors-origins" tabindex="-1">Archive CORS Origins <a class="header-anchor" href="#archive-cors-origins" aria-label="Permalink to &quot;Archive CORS Origins&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/cors/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content):</strong> Origins are removed from the CORS whitelist immediately.</p>`,16)])])}const g=a(t,[["render",i]]);export{h as __pageData,g as default};
