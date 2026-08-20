import{b as a,I as n,g as e,j as t}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Routes","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-routes.md","filePath":"guide/api-routes.md"}'),p={name:"guide/api-routes.md"};function o(i,s,l,r,c,u){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="routes" tabindex="-1">Routes <a class="header-anchor" href="#routes" aria-label="Permalink to &quot;Routes&quot;">​</a></h1><p>Routes define how incoming requests are matched and forwarded to services.</p><h2 id="search-routes" tabindex="-1">Search Routes <a class="header-anchor" href="#search-routes" aria-label="Permalink to &quot;Search Routes&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/routes/search</span></span>
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
<span class="line"><span>    &quot;pattern&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: &quot;users&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-route-history" tabindex="-1">Get Route History <a class="header-anchor" href="#get-route-history" aria-label="Permalink to &quot;Get Route History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/routes/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-route" tabindex="-1">Create Route <a class="header-anchor" href="#create-route" aria-label="Permalink to &quot;Create Route&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/routes</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;serviceId&quot;: 2,</span></span>
<span class="line"><span>      &quot;resourceId&quot;: 4,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;searchUsers&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Search users&quot;,</span></span>
<span class="line"><span>      &quot;pattern&quot;: &quot;/users/search&quot;,</span></span>
<span class="line"><span>      &quot;methodIds&quot;: [1, 7],</span></span>
<span class="line"><span>      &quot;protected&quot;: true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created):</strong> The route is cached and immediately available.</p><h3 id="route-fields" tabindex="-1">Route Fields <a class="header-anchor" href="#route-fields" aria-label="Permalink to &quot;Route Fields&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>serviceId</code></td><td>ID of the target service</td></tr><tr><td><code>resourceId</code></td><td>ID of the resource this route exposes</td></tr><tr><td><code>name</code></td><td>Route name identifier</td></tr><tr><td><code>description</code></td><td>Human-readable description</td></tr><tr><td><code>pattern</code></td><td>URL pattern to match (regex supported)</td></tr><tr><td><code>methodIds</code></td><td>Array of HTTP method IDs allowed on this route</td></tr><tr><td><code>protected</code></td><td>Whether JWT authentication is required (<code>true</code>/<code>false</code>)</td></tr></tbody></table><h2 id="update-route" tabindex="-1">Update Route <a class="header-anchor" href="#update-route" aria-label="Permalink to &quot;Update Route&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/routes</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;serviceId&quot;: 2,</span></span>
<span class="line"><span>      &quot;resourceId&quot;: 4,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;listUsers&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Updated description&quot;,</span></span>
<span class="line"><span>      &quot;pattern&quot;: &quot;/users&quot;,</span></span>
<span class="line"><span>      &quot;methodIds&quot;: [1],</span></span>
<span class="line"><span>      &quot;protected&quot;: true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK):</strong> The route cache is automatically updated.</p><h2 id="archive-routes" tabindex="-1">Archive Routes <a class="header-anchor" href="#archive-routes" aria-label="Permalink to &quot;Archive Routes&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/routes/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content):</strong> Routes are removed from cache immediately.</p>`,17)])])}const q=a(p,[["render",o]]);export{h as __pageData,q as default};
