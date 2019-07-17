// const { persistCache } = jest.genMockFromModule('apollo-cache-persist');

jest.mock('apollo-cache-persist', () => {
	return { persistCache: jest.fn() };
});

import 'cross-fetch/polyfill';

import { BlueBase } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import Plugin from '../index';
import { persistCache } from 'apollo-cache-persist';

test('Plugin should be correctly registered', async () => {
	const BB = new BlueBase();
	await BB.Plugins.register(BlueBasePluginApollo);
	await BB.Plugins.register(Plugin);

	await BB.boot();

	expect(BB.Plugins.has('@bluebase/plugin-apollo-cache-persist')).toBeTruthy();
	expect(persistCache).toBeCalledTimes(1);
});
