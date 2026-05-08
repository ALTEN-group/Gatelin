import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Gatelin',
  description: 'API Gateway service for routing and forwarding HTTP requests to internal microservices',
  base: '/docs/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/overview' },
      { text: 'API', link: '/guide/api' },
      { text: 'Deployment', link: '/guide/deployment' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/guide/overview' },
          { text: 'Environment Variables', link: '/guide/configuration' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Sessions', link: '/guide/api-sessions' },
          { text: 'Proxy', link: '/guide/api-proxy' },
          {
            text: 'Routing',
            collapsed: false,
            items: [
              { text: 'Applications', link: '/guide/api-applications' },
              { text: 'Services', link: '/guide/api-services' },
              { text: 'Resources', link: '/guide/api-resources' },
              { text: 'Routes', link: '/guide/api-routes' },
              { text: 'Methods', link: '/guide/api-methods' },
              { text: 'Operations', link: '/guide/api-operations' },
            ],
          },
          {
            text: 'Authorizations',
            collapsed: false,
            items: [
              { text: 'Roles', link: '/guide/api-roles' },
              { text: 'Permissions', link: '/guide/api-permissions' },
              { text: 'Scopes', link: '/guide/api-scopes' },
              { text: 'Fields', link: '/guide/api-fields' },
              { text: 'Conditions', link: '/guide/api-conditions' },
              { text: 'CORS', link: '/guide/api-cors' },
            ],
          },
          {
            text: 'Admin',
            collapsed: false,
            items: [
              { text: 'Consumers', link: '/guide/api-consumers' },
              { text: 'Preferences', link: '/guide/api-preferences' },
            ],
          },
        ],
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Request Flow', link: '/guide/architecture' },
          { text: 'Frontend Integration', link: '/guide/frontend' },
        ],
      },
      {
        text: 'Deployment',
        items: [
          { text: 'Docker Compose', link: '/guide/deployment' },
          { text: 'Integration', link: '/guide/integration' },
          { text: 'Security', link: '/guide/security' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'Released under the MIT License.',
    },
  },
})
