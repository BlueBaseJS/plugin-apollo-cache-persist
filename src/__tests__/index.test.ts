import 'cross-fetch/polyfill';

import { ApolloClient } from 'apollo-client';
import { BlueBase } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import { CachePersistor } from 'apollo-cache-persist';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Plugin from '../index';
import { createHttpLink } from 'apollo-link-http';

// const { persistCache } = jest.genMockFromModule('apollo-cache-persist');

jest.mock('apollo-cache-persist', () => {
	return { persistCache: jest.fn() };
});

// const client = { onClearStore: async () => jest.fn() };
jest.mock('apollo-cache-persist', () => ({ CachePersistor: jest.fn() }));
const httpLink = createHttpLink();
const cache = new InMemoryCache();
const client = new ApolloClient({
	cache,
	link: httpLink,
});
test('Plugin should be correctly registered', async () => {
	const BB = new BlueBase();

	await BB.boot({ plugins: [BlueBasePluginApollo, Plugin] });
	expect(BB.Plugins.has('@bluebase/plugin-apollo-cache-persist')).toBeTruthy();
	await BB.Filters.run('plugin.apollo.client', client);
	client.clearStore();
	await BB.reset();

	expect(CachePersistor).toBeCalledTimes(2);
});
