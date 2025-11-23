import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		ssr: false // Disable SSR completely - client-side only
	}
};

export default config;
