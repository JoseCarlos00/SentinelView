/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: [
		'local-origin.dev',
		'*.local-origin.dev',
		'http://localhost:3000',
		'http://localhost:3001',
		'http:// 192.168.15.189:3000',
		'http://192.168.15.189:3001'
	],
};

export default nextConfig
