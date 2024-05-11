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

export const parseConfig = (env: Env): Config => {
	return {
		BASE: new URL(env.BASE),
		FEATURE_FLAGS: {
			AD_BLOCKER_ENABLED: env.FEATURE_FLAGS?.includes('AD_BLOCKER') || false,
			TEXT_REPLACER_ENABLED: env.FEATURE_FLAGS?.includes('TEXT_REPLACER') || false,
		},
	};
};
