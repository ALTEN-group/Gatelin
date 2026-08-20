import{b as s,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Operations","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-operations.md","filePath":"guide/api-operations.md"}'),t={name:"guide/api-operations.md"};function o(i,a,l,r,c,u){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="operations" tabindex="-1">Operations <a class="header-anchor" href="#operations" aria-label="Permalink to &quot;Operations&quot;">​</a></h1><p>Operations represent action types (e.g. <code>read</code>, <code>write</code>, <code>delete</code>) used in the permission system to define what a role is allowed to do on a resource.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>Operations define the type of action a permission grants on a resource. They are paired with a resource in a scope to express &quot;this route allows performing operation X on resource Y&quot;. Create operations before creating scopes.</p><h2 id="search-operations" tabindex="-1">Search Operations <a class="header-anchor" href="#search-operations" aria-label="Permalink to &quot;Search Operations&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/operations/search</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;pagination&quot;: true,</span></span>
<span class="line"><span>  &quot;first&quot;: 0,</span></span>
<span class="line"><span>  &quot;limit&quot;: 10,</span></span>
<span class="line"><span>  &quot;sortField&quot;: &quot;id&quot;,</span></span>
<span class="line"><span>  &quot;sortOrder&quot;: &quot;ASC&quot;,</span></span>
<span class="line"><span>  &quot;filters&quot;: {</span></span>
<span class="line"><span>    &quot;name&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: &quot;read&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-operation-history" tabindex="-1">Get Operation History <a class="header-anchor" href="#get-operation-history" aria-label="Permalink to &quot;Get Operation History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/operations/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-operation" tabindex="-1">Create Operation <a class="header-anchor" href="#create-operation" aria-label="Permalink to &quot;Create Operation&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/operations</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;read&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Read access&quot;,</span></span>
<span class="line"><span>      &quot;color&quot;: &quot;#4B0082&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h2 id="update-operation" tabindex="-1">Update Operation <a class="header-anchor" href="#update-operation" aria-label="Permalink to &quot;Update Operation&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/operations</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;read&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Read-only access&quot;,</span></span>
<span class="line"><span>      &quot;color&quot;: &quot;#0000FF&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-operations" tabindex="-1">Archive Operations <a class="header-anchor" href="#archive-operations" aria-label="Permalink to &quot;Archive Operations&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/operations/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p>`,17)])])}const q=s(t,[["render",o]]);export{h as __pageData,q as default};
