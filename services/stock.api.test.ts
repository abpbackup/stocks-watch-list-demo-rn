import { stockApi } from './stock.api';

// Mock Fetch
global.fetch = jest.fn();

describe('stockApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findStocks makes a correct fetch call', async () => {
    const mockJsonPromise = Promise.resolve({ AAPL: 'Apple Inc.' }); // Mocked API response
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockJsonPromise,
    });
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

    const result = await stockApi.findStocks('AAPL');
    expect(global.fetch).toHaveBeenCalledWith('https://test-url.com/search/?query=AAPL', expect.any(Object));
    expect(result).toEqual([{ ticker: 'AAPL', companyName: 'Apple Inc.' }]);
  });

  it('findStocks handles network errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    await expect(stockApi.findStocks('AAPL')).rejects.toThrow('Network error');
  });

  // Additional test cases...
});
