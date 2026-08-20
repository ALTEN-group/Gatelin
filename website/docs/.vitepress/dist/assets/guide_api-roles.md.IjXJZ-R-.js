import{b as a,I as n,g as e,j as t}from"./chunks/framework.CrSplIeq.js";const u=JSON.parse('{"title":"Roles","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-roles.md","filePath":"guide/api-roles.md"}'),o={name:"guide/api-roles.md"};function p(l,s,i,r,d,c){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="roles" tabindex="-1">Roles <a class="header-anchor" href="#roles" aria-label="Permalink to &quot;Roles&quot;">​</a></h1><p>Roles define access control profiles assigned to consumers. Each role carries a set of permissions (allowed operations per route). The role cache is loaded from the database at startup and kept in memory.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>Consumers carry one or more role IDs. When a request arrives, Gatelin merges permissions from all of those roles and checks them against the matched route. The role cache is loaded at startup and refreshed in memory when roles or permissions are updated.</p><h3 id="field-restrictions-on-permissions" tabindex="-1">Field restrictions on permissions <a class="header-anchor" href="#field-restrictions-on-permissions" aria-label="Permalink to &quot;Field restrictions on permissions&quot;">​</a></h3><p>Permissions attached to a role may include a <code>fields</code> array:</p><table tabindex="0"><thead><tr><th>Value</th><th>Meaning</th></tr></thead><tbody><tr><td><code>null</code></td><td>Unrestricted — all fields are readable/writable</td></tr><tr><td><code>[]</code></td><td>No writable fields — write payloads keep only <code>id</code></td></tr><tr><td><code>[&quot;colA&quot;, &quot;colB&quot;]</code></td><td>Only the listed fields are allowed (plus <code>id</code> on writes)</td></tr></tbody></table><p>When merging multiple roles, <code>null</code> wins (least restrictive). Otherwise field sets are unioned.</p><h2 id="search-roles" tabindex="-1">Search Roles <a class="header-anchor" href="#search-roles" aria-label="Permalink to &quot;Search Roles&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/roles/search</span></span>
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
<span class="line"><span>    &quot;archived&quot;: {</span></span>
<span class="line"><span>      &quot;value&quot;: false,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;equals&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-role-history" tabindex="-1">Get Role History <a class="header-anchor" href="#get-role-history" aria-label="Permalink to &quot;Get Role History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/roles/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-role" tabindex="-1">Create Role <a class="header-anchor" href="#create-role" aria-label="Permalink to &quot;Create Role&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/roles</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;editor&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Can edit content&quot;,</span></span>
<span class="line"><span>      &quot;color&quot;: &quot;#4B0082&quot;,</span></span>
<span class="line"><span>      &quot;appId&quot;: 1</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h2 id="update-role" tabindex="-1">Update Role <a class="header-anchor" href="#update-role" aria-label="Permalink to &quot;Update Role&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/roles</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;editor&quot;,</span></span>
<span class="line"><span>      &quot;description&quot;: &quot;Can edit and publish content&quot;,</span></span>
<span class="line"><span>      &quot;color&quot;: &quot;#0000FF&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-roles" tabindex="-1">Archive Roles <a class="header-anchor" href="#archive-roles" aria-label="Permalink to &quot;Archive Roles&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/roles/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p><p>Archived roles older than 2 months are permanently deleted by the daily retention job.</p><h3 id="role-fields" tabindex="-1">Role Fields <a class="header-anchor" href="#role-fields" aria-label="Permalink to &quot;Role Fields&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>appId</code></td><td>ID of the application this role belongs to</td></tr><tr><td><code>name</code></td><td>Unique role name</td></tr><tr><td><code>description</code></td><td>Human-readable description</td></tr><tr><td><code>color</code></td><td>Hex color code assigned to the role (e.g. <code>#FF8000</code>)</td></tr><tr><td><code>archived</code></td><td>Whether the role is archived</td></tr></tbody></table>`,24)])])}const q=a(o,[["render",p]]);export{u as __pageData,q as default};
