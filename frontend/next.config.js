/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Só adiciona rewrite se a URL da API estiver definida
    if (!apiUrl || apiUrl === 'undefined') {
      console.warn('NEXT_PUBLIC_API_URL não definida, pulando rewrites');
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  
  // Headers para assets estáticos
  async headers() {
    return [
      {
        source: '/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff|woff2))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configuração para imagens
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Optimização para Firebase
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
