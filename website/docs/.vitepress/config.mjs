import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const base = process.env.VITEPRESS_BASE || (process.env.NODE_ENV === 'production' ? '/' : '/docs/')

export default withMermaid(defineConfig({
  title: 'Gatelin',
  description: 'API Gateway service for routing and forwarding HTTP requests to internal microservices',
  base,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,
    sidebar: [
      {
        items: [
          { text: 'Overview', link: '/guide/overview' },
        ],
      },
      {
        text: 'Deployment',
        items: [
          { text: 'Docker Compose', link: '/guide/deployment' },
          { text: 'Environment Variables', link: '/guide/configuration' },
          { text: 'Integration', link: '/guide/integration' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Sessions', link: '/guide/api-sessions' },
          { text: 'Proxy', link: '/guide/api-proxy' },
          { text: 'Consumers', link: '/guide/api-consumers' },
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
        ],
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Request Flow', link: '/guide/architecture' },
          { text: 'Frontend Integration', link: '/guide/frontend' },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'Published and maintained by ALTEN',
    },
  },
}))
