/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add headers to handle external resources
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: http:; img-src 'self' data: https: http:; style-src 'self' 'unsafe-inline' https:;",
          },
        ],
      },
    ];
  },
  // Performance optimizations (simplified to avoid module issues)
  experimental: {
    // Enable modern bundling optimizations
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  // Compress responses
  compress: true,
  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle recharts separately since it's heavy
          recharts: {
            name: "recharts",
            test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
            priority: 20,
            chunks: "all",
          },
          // Bundle leaflet separately since it's heavy
          leaflet: {
            name: "leaflet",
            test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
            priority: 20,
            chunks: "all",
          },
          // Bundle UI components
          ui: {
            name: "ui",
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            priority: 10,
            chunks: "all",
          },
          // Bundle everything else
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            chunks: "all",
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
