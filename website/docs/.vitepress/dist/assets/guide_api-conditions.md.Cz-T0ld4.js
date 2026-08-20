import{b as a,I as s,g as e,j as t}from"./chunks/framework.CrSplIeq.js";const h=JSON.parse('{"title":"Conditions","description":"","frontmatter":{},"headers":[],"relativePath":"guide/api-conditions.md","filePath":"guide/api-conditions.md"}'),o={name:"guide/api-conditions.md"};function i(p,n,l,d,c,r){return s(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="conditions" tabindex="-1">Conditions <a class="header-anchor" href="#conditions" aria-label="Permalink to &quot;Conditions&quot;">​</a></h1><p>Conditions are predefined filter rules that can be attached to permissions. They restrict data returned from a route based on a field value — for example, &quot;only return non-archived records&quot;.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><p>A condition combines a field, a comparison operator, and a value into a reusable named filter rule (e.g. <code>archived = false</code>). When a permission has a condition attached, Gatelin:</p><ul><li>injects matching filters into <code>req.body.filters</code> for admin search requests, and</li><li>forwards them to proxied services via the <code>x-acl-conditions</code> header as <code>{ field, op, value }</code>.</li></ul><p>Conditions are optional — a permission without a condition applies no row-level filtering.</p><p>Because proxied bodies are streamed unchanged, the upstream service enforces forwarded conditions. It must combine them with caller search filters using <code>AND</code>, constrain inserts to the permitted partition, and verify target rows before updates, archives, and history reads. Invalid conditions must fail closed rather than being dropped.</p><p>WebSocket conditions apply to the upgrade handshake only. Gatelin does not inspect frames after the connection is established.</p><p>Create conditions after creating fields, and before assigning them to permissions.</p><h2 id="search-conditions" tabindex="-1">Search Conditions <a class="header-anchor" href="#search-conditions" aria-label="Permalink to &quot;Search Conditions&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/conditions/search</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="get-condition-history" tabindex="-1">Get Condition History <a class="header-anchor" href="#get-condition-history" aria-label="Permalink to &quot;Get Condition History&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /gatelin/conditions/:id/history</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span></code></pre></div><h2 id="create-condition" tabindex="-1">Create Condition <a class="header-anchor" href="#create-condition" aria-label="Permalink to &quot;Create Condition&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/conditions</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;Non-archived only&quot;,</span></span>
<span class="line"><span>      &quot;fieldId&quot;: 7,</span></span>
<span class="line"><span>      &quot;op&quot;: &quot;=&quot;,</span></span>
<span class="line"><span>      &quot;value&quot;: &quot;false&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (201 Created)</strong></p><h3 id="condition-fields" tabindex="-1">Condition Fields <a class="header-anchor" href="#condition-fields" aria-label="Permalink to &quot;Condition Fields&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>name</code></td><td>Human-readable label for the condition</td></tr><tr><td><code>fieldId</code></td><td>ID of the field to filter on</td></tr><tr><td><code>op</code></td><td>Comparison operator (<code>=</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>)</td></tr><tr><td><code>value</code></td><td>Value to compare the field against</td></tr></tbody></table><h2 id="update-condition" tabindex="-1">Update Condition <a class="header-anchor" href="#update-condition" aria-label="Permalink to &quot;Update Condition&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /gatelin/conditions</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: 1,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;Non-archived only&quot;,</span></span>
<span class="line"><span>      &quot;fieldId&quot;: 7,</span></span>
<span class="line"><span>      &quot;op&quot;: &quot;=&quot;,</span></span>
<span class="line"><span>      &quot;value&quot;: &quot;false&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (200 OK)</strong></p><h2 id="archive-conditions" tabindex="-1">Archive Conditions <a class="header-anchor" href="#archive-conditions" aria-label="Permalink to &quot;Archive Conditions&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /gatelin/conditions/archive</span></span>
<span class="line"><span>Content-Type: application/json</span></span>
<span class="line"><span>Authorization: Bearer &lt;access_token&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;rows&quot;: [</span></span>
<span class="line"><span>    { &quot;id&quot;: 1 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 2 },</span></span>
<span class="line"><span>    { &quot;id&quot;: 3 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Response (204 No Content)</strong></p><p>Archived conditions older than 2 months are permanently deleted by the daily retention job (before fields, because <code>condition.fieldId</code> is <code>ON DELETE RESTRICT</code>).</p>`,25)])])}const q=a(o,[["render",i]]);export{h as __pageData,q as default};
