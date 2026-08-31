/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 는 정적 파일만 서빙하므로 정적 내보내기로 고정한다.
  output: 'export',
  // 정적 내보내기에서는 Next 의 이미지 최적화 서버가 없다.
  images: { unoptimized: true },
  // /apps/slug/index.html 형태로 나가야 GitHub Pages 가 확장자 없이 서빙한다.
  trailingSlash: true,
  reactStrictMode: true,
}

export default nextConfig
