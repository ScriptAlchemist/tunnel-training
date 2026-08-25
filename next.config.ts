import type { NextConfig } from 'next'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubActions ? '/tunnel-training' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
