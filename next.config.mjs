import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    experimental: {
       
      }
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
