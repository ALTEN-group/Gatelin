import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Gatelin',
  description: 'API Gateway service for routing and forwarding HTTP requests to internal microservices',
  base: '/docs/',
  themeConfig: {
    logo: '/logo.svg',
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
          { text: 'Sessions & Consumers', link: '/guide/api' },
          { text: 'Services', link: '/guide/api-services' },
          { text: 'CORS', link: '/guide/api-cors' },
          { text: 'Routes', link: '/guide/api-routes' },
          { text: 'Roles', link: '/guide/api-roles' },
          { text: 'Permissions', link: '/guide/api-permissions' },
          { text: 'Resources', link: '/guide/api-resources' },
          { text: 'Operations', link: '/guide/api-operations' },
          { text: 'Scopes', link: '/guide/api-scopes' },
          { text: 'Fields', link: '/guide/api-fields' },
          { text: 'Methods', link: '/guide/api-methods' },
          { text: 'Applications', link: '/guide/api-applications' },
          { text: 'Conditions', link: '/guide/api-conditions' },
          { text: 'Preferences', link: '/guide/api-preferences' },
          { text: 'Proxy', link: '/guide/api-proxy' },
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
