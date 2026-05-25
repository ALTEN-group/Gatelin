import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Gatelin',
  description: 'API Gateway service for routing and forwarding HTTP requests to internal microservices',
  base: '/docs/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }],
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
        text: 'Sequence Diagrams',
        items: [
          { text: 'Proxy Request', link: '/guide/sd-proxy' },
          {
            text: 'Sessions',
            collapsed: false,
            items: [
              { text: 'Create Session', link: '/guide/sd-create-session' },
              { text: 'Update Session', link: '/guide/sd-update-session' },
            ],
          },
          {
            text: 'Routes',
            collapsed: false,
            items: [
              { text: 'Create Route', link: '/guide/sd-create-route' },
              { text: 'Update Route', link: '/guide/sd-update-route' },
            ],
          },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'Published and maintained by DW Technologies',
    },
  },
}))
