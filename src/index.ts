import { BlueBase, createPlugin } from '@bluebase/core';

import { AsyncStorage } from 'react-native';
import { CachePersistor } from 'apollo-cache-persist';

export default createPlugin({
	description: 'Simple persistence for all Apollo Client 2.0 cache implementations.',
	key: '@bluebase/plugin-apollo-cache-persist',
	name: 'Apollo Cache Persist',
	version: '1.0.0',

	defaultConfigs: {
		'plugin.apollo-cache-persist.configs': {},
	},

	filters: {
		'plugin.apollo.cache': async (cache: any, _ctx: any, BB: BlueBase) => {
			const configs = BB.Configs.getValue('plugin.apollo-cache-persist.configs');
			const persistor = new CachePersistor({
				cache,
				storage: AsyncStorage,

				...configs,
			});

			BB.Filters.register({
				event: 'bluebase.reset',
				key: 'apollo-cache-reset',
				priority: 20,
				value: async () => {
					await persistor.purge();
				},
			});
			return cache;
		},
	},
});
