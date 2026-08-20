import{b as a,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Resources","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-resources.md","filePath":"guide/api-resources.md"}'),t={name:"guide/api-resources.md"};function o(i,s,c,r,l,u){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="resources" tabindex="-1">Resources <a class="header-anchor" href="#resources" aria-label="Permalink to &quot;Resources&quot;">​</a></h1><p>Resources represent data entities from backend services (e.g. <code>users</code>, <code>orders</code>). They are used in the permission system to define the scope of access for a given role and route.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>Resources map to the data entities exposed by your backend services. Each resource belongs to a service and is identified by a name (e.g. <code>users</code>, <code>articles</code>). They are referenced in scopes to define which entity a route gives access to.</p><p>Create a resource for each distinct data entity you want to control access to, before creating scopes.</p><h2 id="search-resources" tabindex="-1">Search Resources <a class="header-anchor" href="#search-resources" aria-label="Permalink to &quot;Search Resources&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/resources/search</span></span>
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
<span class="line"><span>      &quot;value&quot;: &quot;user&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-resource-history" tabindex="-1">Get Resource History <a class="header-anchor" href="#get-resource-history" aria-label="Permalink to &quot;Get Resource History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/resources/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-resource" tabindex="-1">Create Resource <a class="header-anchor" href="#create-resource" aria-label="Permalink to &quot;Create Resource&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/resources</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;serviceId&quot;: 1,</span></span>
<span class="line"><span>      &quot;serviceName&quot;: &quot;user&quot;,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;users&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h2 id="update-resource" tabindex="-1">Update Resource <a class="header-anchor" href="#update-resource" aria-label="Permalink to &quot;Update Resource&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/resources</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;serviceId&quot;: 1,</span></span>
<span class="line"><span>      &quot;serviceName&quot;: &quot;user&quot;,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;profiles&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-resources" tabindex="-1">Archive Resources <a class="header-anchor" href="#archive-resources" aria-label="Permalink to &quot;Archive Resources&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/resources/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p>`,18)])])}const q=a(t,[["render",o]]);export{h as __pageData,q as default};
