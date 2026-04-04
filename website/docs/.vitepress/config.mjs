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
          { text: 'Consumers', link: '/guide/api' },
          { text: 'Services', link: '/guide/api-services' },
          { text: 'CORS', link: '/guide/api-cors' },
          { text: 'Routes', link: '/guide/api-routes' },
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
