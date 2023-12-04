import AsyncStorage from '@react-native-async-storage/async-storage';

import { Stock } from '../types/types';
import { store } from './store';

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(JSON.stringify([]))),
}));

describe('store', () => {
  const stocks: Stock[] = [{ ticker: 'AAPL', companyName: 'Apple Inc.', price: 150 }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves stocks to storage', async () => {
    await store.save('stocks', stocks);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('stocks', JSON.stringify(stocks));
  });

  it('retrieves stocks from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stocks));
    const retrievedStocks = await store.get('stocks');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('stocks');
    expect(retrievedStocks).toEqual(stocks);
  });

  it('returns an empty array when there is no data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const retrievedStocks = await store.get('stocks');
    expect(retrievedStocks).toEqual([]);
  });

  it('throws an error when saving fails', async () => {
    const error = new Error('Failed to save');
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);
    await expect(store.save('stocks', stocks)).rejects.toThrow('Failed to save');
  });

  it('throws an error when retrieval fails', async () => {
    const error = new Error('Failed to retrieve');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);
    await expect(store.get('stocks')).rejects.toThrow('Failed to retrieve');
  });
});
