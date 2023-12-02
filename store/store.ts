import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stock } from '../constants/types';

type AvailableKeys = 'stocks' | 'starred';

const createStore = () => {
  const save = async (key: AvailableKeys, stocks: Stock[]) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(stocks));
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const get = async (key: AvailableKeys): Promise<Stock[]> => {
    try {
      const serializedStocks = await AsyncStorage.getItem(key);
      const stocks: Stock[] = serializedStocks ? JSON.parse(serializedStocks) : [];
      return stocks;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return {
    save,
    get,
  };
};

export const store = createStore();
