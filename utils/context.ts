import { createContext } from "react";

export type WalletContextValue = {
  connectedWallet: string | null;
};

export const WalletContext = createContext<WalletContextValue>({
  connectedWallet: null,
});
