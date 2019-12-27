import 'cross-fetch/polyfill';

// const { persistCache } = jest.genMockFromModule('apollo-cache-persist');
// import { ApolloClient } from 'apollo-client';
import { BlueBase } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import { CachePersistor } from 'apollo-cache-persist';
import Plugin from '../index';

jest.mock('apollo-cache-persist', () => {
	return { persistCache: jest.fn() };
});

const client = jest.fn();
jest.mock('apollo-cache-persist', () => ({ CachePersistor: jest.fn() }));

test('Plugin should be correctly registered', async () => {
	const BB = new BlueBase();

	await BB.boot({ plugins: [BlueBasePluginApollo, Plugin] });
	expect(BB.Plugins.has('@bluebase/plugin-apollo-cache-persist')).toBeTruthy();
	BB.Filters.run('plugin.apollo.client', client);
	await BB.reset();

	expect(CachePersistor).toBeCalledTimes(2);
});
