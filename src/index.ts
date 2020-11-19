import { BlueBase, createPlugin } from '@bluebase/core';

import { ApolloClient } from 'apollo-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CachePersistor } from 'apollo-cache-persist';
import { InMemoryCache } from 'apollo-cache-inmemory';

let persistor: CachePersistor<any>;

export default createPlugin({
	description: 'Simple persistence for all Apollo Client 2.0 cache implementations.',
	key: '@bluebase/plugin-apollo-cache-persist',
	name: 'Apollo Cache Persist',
	version: '1.0.0',

	defaultConfigs: {
		'plugin.apollo-cache-persist.configs': {},
	},

	filters: {
		'plugin.apollo.cache': async (cache: InMemoryCache, _ctx: any, BB: BlueBase) => {
			const configs = BB.Configs.getValue('plugin.apollo-cache-persist.configs');
			persistor = new CachePersistor({
				cache,
				storage: AsyncStorage,

				...configs,
			});

			return cache;
		},

		'plugin.apollo.client': async (client: ApolloClient<{}>, _ctx: any, _BB: BlueBase) => {
			client.onClearStore(async () => {
				await persistor.purge();
			});
			return client;
		},
	},
});
