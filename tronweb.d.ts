import { TronWeb } from "tronweb-typings";

declare global {
  interface Window {
    tronWeb?: TronWeb;
  }
}
