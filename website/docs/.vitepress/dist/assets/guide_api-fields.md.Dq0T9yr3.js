import{b as a,I as n,g as e,j as p}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Fields","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-fields.md","filePath":"guide/api-fields.md"}'),t={name:"guide/api-fields.md"};function i(l,s,o,c,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="fields" tabindex="-1">Fields <a class="header-anchor" href="#fields" aria-label="Permalink to &quot;Fields&quot;">​</a></h1><p>Fields represent database columns or entity properties used to build conditions in the permission system.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>A field name follows the format <code>table.column</code> (e.g. <code>users.active</code>) and is limited to <strong>50 characters</strong>. Fields are the building blocks of conditions — when creating a condition, you reference a field to specify which property to filter on. Create fields before creating conditions.</p><p>Field names are also used in permission <code>fields</code> arrays to restrict which columns a role may read or write on a route.</p><h2 id="search-fields" tabindex="-1">Search Fields <a class="header-anchor" href="#search-fields" aria-label="Permalink to &quot;Search Fields&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/fields/search</span></span>
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
<span class="line"><span>      &quot;value&quot;: &quot;archived&quot;,</span></span>
<span class="line"><span>      &quot;matchMode&quot;: &quot;contains&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-field-history" tabindex="-1">Get Field History <a class="header-anchor" href="#get-field-history" aria-label="Permalink to &quot;Get Field History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/fields/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-field" tabindex="-1">Create Field <a class="header-anchor" href="#create-field" aria-label="Permalink to &quot;Create Field&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/fields</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;resourceId&quot;: 3,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;users.active&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h2 id="update-field" tabindex="-1">Update Field <a class="header-anchor" href="#update-field" aria-label="Permalink to &quot;Update Field&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/fields</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;users.email&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-fields" tabindex="-1">Archive Fields <a class="header-anchor" href="#archive-fields" aria-label="Permalink to &quot;Archive Fields&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/fields/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p><p>Archived fields older than 2 months are permanently deleted by the daily retention job (after conditions that reference them).</p>`,19)])])}const q=a(t,[["render",i]]);export{h as __pageData,q as default};
