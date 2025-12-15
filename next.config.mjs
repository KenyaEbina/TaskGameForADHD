/** @type {import('next').NextConfig} */
const nextConfig = {
  // Electron で動かすために静的エクスポート
  output: 'export',

  // Electron では Next.js の Image Optimization が使えないため無効化
  images: {
    unoptimized: true,
  },

  // file:// で out/index.html を開いたときでも CSS/JS が相対パスで解決されるようにする
  assetPrefix: './',
};

export default nextConfig;
