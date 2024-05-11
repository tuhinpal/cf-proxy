import { Config, Env } from './types';

export const publicCdn = [
	'jsdelivr.net',
	'googleapis.com',
	'gstatic.com',
	'bootstrapcdn.com',
	'fontawesome.com',
	'cloudflare.com',
	'unpkg.com',
	'jquery.com',
	'gravatar.com',
];

export const parseConfig = (env: Env, request: Request): Config => {
	const queryParams = new URL(request.url).searchParams;

	let config: Config = {
		BASE: new URL(env.BASE),
		FEATURE_FLAGS: {
			AD_BLOCKER_ENABLED: env.FEATURE_FLAGS?.includes('AD_BLOCKER') || false,
			TEXT_REPLACER_ENABLED: env.FEATURE_FLAGS?.includes('TEXT_REPLACER') || false,
			ON_DEMAND_HOST_CONFIG_ENABLED: env.FEATURE_FLAGS?.includes('ON_DEMAND_HOST_CONFIG') || false,
		},
		ON_DEMAND_HOST: null,
	};

	if (config.FEATURE_FLAGS.ON_DEMAND_HOST_CONFIG_ENABLED && queryParams.get('host')) {
		try {
			const newBase = new URL(`https://${queryParams.get('host')}`); // `https://` is required to parse `host` as `hostname`
			config.BASE = newBase;
			config.ON_DEMAND_HOST = queryParams.get('host');
		} catch {}
	}

	return config;
};
