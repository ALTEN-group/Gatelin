import{b as a,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const u=JSON.parse('{"title":"Scopes","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-scopes.md","filePath":"guide/api-scopes.md"}'),t={name:"guide/api-scopes.md"};function o(i,s,c,l,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="scopes" tabindex="-1">Scopes <a class="header-anchor" href="#scopes" aria-label="Permalink to &quot;Scopes&quot;">​</a></h1><p>Scopes attach to routes in the permission system. They link a route to a resource and operation to define what data entity and action type the route represents.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>A scope is a named tag attached to a route (e.g. <code>users:search</code>). When a permission references a scope, the ACL check only grants access if the URL segment following the resource name matches one of the scope&#39;s route names — letting a role be restricted to specific sub-paths of a route instead of the whole route.</p><p>Create scopes after routes are in place.</p><h2 id="search-scopes" tabindex="-1">Search Scopes <a class="header-anchor" href="#search-scopes" aria-label="Permalink to &quot;Search Scopes&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/scopes/search</span></span>
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
<span class="line"><span>    &quot;routeId&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: 5,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;equals&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-scope-history" tabindex="-1">Get Scope History <a class="header-anchor" href="#get-scope-history" aria-label="Permalink to &quot;Get Scope History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/scopes/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-scope" tabindex="-1">Create Scope <a class="header-anchor" href="#create-scope" aria-label="Permalink to &quot;Create Scope&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/scopes</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;routeId&quot;: 5,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;users:search&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h3 id="scope-fields" tabindex="-1">Scope Fields <a class="header-anchor" href="#scope-fields" aria-label="Permalink to &quot;Scope Fields&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>routeId</code></td><td>ID of the associated route</td></tr><tr><td><code>name</code></td><td>Scope name (e.g. <code>users:search</code>)</td></tr><tr><td><code>core</code></td><td>Whether this scope is a core system scope (read-only)</td></tr></tbody></table><h2 id="update-scope" tabindex="-1">Update Scope <a class="header-anchor" href="#update-scope" aria-label="Permalink to &quot;Update Scope&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/scopes</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;users:search:v2&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-scopes" tabindex="-1">Archive Scopes <a class="header-anchor" href="#archive-scopes" aria-label="Permalink to &quot;Archive Scopes&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/scopes/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p>`,20)])])}const q=a(t,[["render",o]]);export{u as __pageData,q as default};
