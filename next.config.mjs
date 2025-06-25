/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Allow images from your S3 bucket
      'aquapulsebucket.s3.ap-southeast-2.amazonaws.com',
      // You might also want to add the CloudFront domain if you're using it
      // 'your-cloudfront-distribution.cloudfront.net',
    ],
    // Optional: Set default image sizes for optimization
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Other Next.js config options can go here
};

export default nextConfig;