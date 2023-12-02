import { createContext, useContext, useEffect, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

type NetworkContextProps = {
  isConnected: boolean;
};
const networkContext = createContext<NetworkContextProps>({
  isConnected: false,
});

type Props = {
  children: React.ReactNode;
};

export const NetworkProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false);

  const netInfo = useNetInfo();

  useEffect(() => {
    setIsConnected(netInfo.isInternetReachable ?? false);
  }, [netInfo.isInternetReachable]);

  return <networkContext.Provider value={{ isConnected }}>{children}</networkContext.Provider>;
};

export const useIsConnected = () => {
  const { isConnected } = useContext(networkContext);
  return isConnected;
};
