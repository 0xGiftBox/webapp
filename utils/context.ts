import { createContext } from "react";

export type WalletContextValue = {
  connectedWallet: string | null;
};

export type ConnectionStatusContextValue = {
  checkConnectionStatus: (() => void) | null;
};

export const WalletContext = createContext<WalletContextValue>({
  connectedWallet: null,
});

export const ConnectionStatusContext =
  createContext<ConnectionStatusContextValue>({
    checkConnectionStatus: null,
  });
