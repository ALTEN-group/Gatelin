import{b as a,I as n,g as e,j as t}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Permissions","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-permissions.md","filePath":"guide/api-permissions.md"}'),o={name:"guide/api-permissions.md"};function i(p,s,r,l,d,c){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-label="Permalink to &quot;Permissions&quot;">​</a></h1><p>Permissions define which operations a role is allowed to perform on a given route. They are stored in Gatelin’s database and loaded into memory at startup.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>Each permission links a role to a route and an operation. Optionally it may also attach:</p><ul><li><strong><code>fields</code></strong> — column allow-list (<code>null</code> = unrestricted, <code>[]</code> = only <code>id</code>). Gatelin enforces it directly for its own <code>/gatelin/*</code> APIs. Transparent proxied requests carry the allow-list in <code>x-acl-fields</code>; the upstream service must filter write rows, read responses, history snapshots, and schema output.</li><li><strong><code>scopes</code></strong> — allowed URL sub-segments for scoped routes</li><li><strong><code>conditionId</code></strong> — condition IDs whose filters are injected into <code>/gatelin/*</code> searches and forwarded as <code>x-acl-conditions</code> on proxied requests. The upstream must force these predicates into searches and check them before inserts, updates, archives, and history reads.</li></ul><p>When a request arrives, Gatelin looks up whether any of the consumer&#39;s roles has a matching permission for the route and operation. Permissions are loaded into memory at startup and updated when changes occur.</p><p>Permissions are hard-deleted (not archived) and are not purged by the archived-entities retention job.</p><h2 id="gatelin-vs-upstream-enforcement" tabindex="-1">Gatelin vs upstream enforcement <a class="header-anchor" href="#gatelin-vs-upstream-enforcement" aria-label="Permalink to &quot;Gatelin vs upstream enforcement&quot;">​</a></h2><p>Gatelin&#39;s control-plane APIs parse JSON, so they can strip disallowed fields and inject condition filters themselves. The catch-all data proxy deliberately does not parse or re-serialize payloads: this is what allows multipart, binary, GraphQL, SSE, and arbitrary HTTP bodies to pass unchanged.</p><p>For a proxied protected route, Gatelin still rejects a missing route/operation/scope permission with <strong>403</strong>, then sends the resolved data restrictions as trusted headers:</p><table tabindex="0"><thead><tr><th>Permission value</th><th>Forwarded contract</th></tr></thead><tbody><tr><td><code>fields: null</code></td><td><code>x-acl-fields</code> omitted — unrestricted</td></tr><tr><td><code>fields: []</code></td><td><code>x-acl-fields</code> present but empty — only <code>id</code></td></tr><tr><td><code>fields: [&quot;name&quot;]</code></td><td><code>x-acl-fields: name</code></td></tr><tr><td>attached conditions</td><td><code>x-acl-conditions: [{&quot;field&quot;:&quot;userId&quot;,&quot;op&quot;:&quot;=&quot;,&quot;value&quot;:42}]</code></td></tr></tbody></table><p>Services must not accept direct public traffic that can bypass Gatelin, and must ignore or overwrite client-supplied <code>x-consumer-*</code> / <code>x-acl-*</code> headers at any other trusted ingress. Gatelin replaces these headers before forwarding protected requests.</p><p><a href="https://github.com/dwtechs/Foxnox" target="_blank" rel="noreferrer">Foxnox</a> implements this contract for its JSON CRUD resources: response and write projection, forced search predicates, equality-partition injection on inserts, and condition preflight for updates, archives, and history.</p><h2 id="search-permissions" tabindex="-1">Search Permissions <a class="header-anchor" href="#search-permissions" aria-label="Permalink to &quot;Search Permissions&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/permissions/search</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;pagination&quot;: true,</span></span>
<span class="line"><span>  &quot;first&quot;: 0,</span></span>
<span class="line"><span>  &quot;limit&quot;: 10,</span></span>
<span class="line"><span>  &quot;sortField&quot;: &quot;roleId&quot;,</span></span>
<span class="line"><span>  &quot;sortOrder&quot;: &quot;ASC&quot;,</span></span>
<span class="line"><span>  &quot;filters&quot;: {</span></span>
<span class="line"><span>    &quot;roleId&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: 2,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;equals&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-permission-history-by-route" tabindex="-1">Get Permission History by Route <a class="header-anchor" href="#get-permission-history-by-route" aria-label="Permalink to &quot;Get Permission History by Route&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/permissions/history/route/:routeId</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="add-permissions" tabindex="-1">Add Permissions <a class="header-anchor" href="#add-permissions" aria-label="Permalink to &quot;Add Permissions&quot;">​</a></h2><p>Permissions are added in bulk — one entry per role/route/operation combination.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/permissions</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;roleId&quot;: 2,</span></span>
<span class="line"><span>      &quot;routeId&quot;: 5,</span></span>
<span class="line"><span>      &quot;operationId&quot;: 1,</span></span>
<span class="line"><span>      &quot;fields&quot;: [&quot;name&quot;, &quot;email&quot;],</span></span>
<span class="line"><span>      &quot;scopes&quot;: [&quot;own&quot;],</span></span>
<span class="line"><span>      &quot;conditionId&quot;: [1]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h2 id="update-permissions" tabindex="-1">Update Permissions <a class="header-anchor" href="#update-permissions" aria-label="Permalink to &quot;Update Permissions&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/permissions</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 10,</span></span>
<span class="line"><span>      &quot;conditionId&quot;: [2]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="delete-permissions" tabindex="-1">Delete Permissions <a class="header-anchor" href="#delete-permissions" aria-label="Permalink to &quot;Delete Permissions&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELETE /gatelin/permissions</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 10 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 11 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 12 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p>`,27)])])}const m=a(o,[["render",i]]);export{h as __pageData,m as default};
