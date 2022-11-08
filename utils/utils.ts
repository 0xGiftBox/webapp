import { ethers } from "ethers";
import { Fund } from "./types";

const getGiftBoxContract = async () => {
  if (!window.tronWeb) throw Error("TronWeb not available");
  return await window.tronWeb
    .contract()
    .at(process.env.NEXT_PUBLIC_GIFTBOX_ADDRESS);
};

export const getStableCoinAddress = async () => {
  const giftBoxContract = await getGiftBoxContract();
  return await giftBoxContract.stableCoinAddress().call();
};

const getStableCoinContract = async () => {
  if (!window.tronWeb) throw Error("TronWeb not available");
  const stableCoinAddress = await getStableCoinAddress();
  return await window.tronWeb.contract().at(stableCoinAddress);
};

// Create fund and return the fund token address
export const createFund = async (
  name: string,
  symbolSuffix: string,
  references: string[]
): Promise<string> => {
  const giftBoxContract = await getGiftBoxContract();
  return await giftBoxContract
    .createFund(name, symbolSuffix, references)
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });
};

// Get all the fund token addresses
export const getFundTokenAddresses = async () => {
  const giftBoxContract = await getGiftBoxContract();
  const numFundsBn = await giftBoxContract.numFunds().call();
  const numFunds = numFundsBn.toNumber();
  const fundTokenAddresses = await Promise.all(
    // Trick for getting array of 1...N @ https://stackoverflow.com/a/3746849/5837426
    [...Array(numFunds).keys()].map(
      async (x) =>
        await giftBoxContract
          .fundTokenAddresses(ethers.BigNumber.from(x))
          .call()
    )
  );
  return fundTokenAddresses;
};

export const getFund = async (
  fundTokenAddress: string
): Promise<Fund | null> => {
  const giftBoxContract = await getGiftBoxContract();

  const fund = await giftBoxContract.funds(fundTokenAddress).call();
  if (fund.manager == "410000000000000000000000000000000000000000") return null;

  return {
    fundTokenAddress,
    ...fund,
  };
};

export const depositStableCoins = async (
  fundTokenAddress: string,
  amount: number
) => {
  const giftBoxContract = await getGiftBoxContract();
  const stableCoinContract = await getStableCoinContract();

  // Approve GiftBox to spend stablecoins from user's wallet
  await stableCoinContract
    .approve(giftBoxContract.address, amount)
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });

  // Deposit stablecoins into fund
  await giftBoxContract
    .depositStableCoins(fundTokenAddress, amount)
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });
};

// Create a withdraw request
export const createWithdrawRequest = async (
  fundTokenAddress: string,
  amount: number,
  title: string,
  deadline: Date,
  references: string[]
) => {
  const giftBoxContract = await getGiftBoxContract();
  return await giftBoxContract
    .createWithdrawRequest(
      fundTokenAddress,
      amount,
      title,
      Math.floor(deadline.getTime() / 1000),
      references
    )
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });
};

export const requestAccounts = () => {
  if (!window.tronWeb) throw Error("TronWeb not available");
  // @ts-ignore
  return window.tronWeb.request({ method: "tron_requestAccounts" });
};
