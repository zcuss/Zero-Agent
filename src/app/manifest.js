export default function manifest() {
  return {
    name: 'Zero Agent - AI Infrastructure Dashboard',
    short_name: 'Zero Agent',
    description: 'Dark developer dashboard for unified AI provider operations and performance monitoring.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050b14',
    theme_color: '#050b14',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
