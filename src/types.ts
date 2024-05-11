export interface Env {
	BASE: string;
	FEATURE_FLAGS: string;
}

export interface Config {
	BASE: URL;
	FEATURE_FLAGS: {
		AD_BLOCKER_ENABLED: boolean;
		TEXT_REPLACER_ENABLED: boolean;
	};
}
