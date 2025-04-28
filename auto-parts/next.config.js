const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicyHeader = {
	key: "Content-Security-Policy",
	value:
		`
			default-src 'none';
			style-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com;
			style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
			script-src-elem 'self' 'unsafe-inline' 'unsafe-eval';
			script-src 'self' 'unsafe-inline' 'unsafe-eval';
			img-src 'self' blob: data:;
			font-src 'self' https://fonts.gstatic.com;
			connect-src 'self';
		`
};

contentSecurityPolicyHeader.value = contentSecurityPolicyHeader.value.replace(/\n/g, "");

module.exports = {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					contentSecurityPolicyHeader
				]
			}
		];
	},
	logging: {
		fetches: {
			fullUrl: true
		}
	}
};