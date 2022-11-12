import { ethers } from "ethers";
import { Fund, WithdrawRequest } from "./types";
import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";

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
    amountDeposited: fund.amountDeposited.div(BigInt(10 ** 18)).toNumber(),
  };
};

export const depositStableCoins = async (
  fundTokenAddress: string,
  amount: number
) => {
  const giftBoxContract = await getGiftBoxContract();
  const stableCoinContract = await getStableCoinContract();

  // Approve GiftBox to spend stablecoins from user's wallet
  const allowanceBn = await stableCoinContract
    .allowance(window.tronWeb?.defaultAddress.hex, giftBoxContract.address)
    .call();
  const allowance = allowanceBn.div(BigInt(10 ** 18)).toNumber();
  if (allowance < amount) {
    await stableCoinContract
      .approve(giftBoxContract.address, BigInt((amount - allowance) * 10 ** 18))
      .send({ feeLimit: 500_000_000, shouldPollResponse: true });
  }

  // Deposit stablecoins into fund
  await giftBoxContract
    .depositStableCoins(fundTokenAddress, BigInt(amount * 10 ** 18))
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
      BigInt(amount * 10 ** 18),
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

export const getWithdrawRequests = async (
  fundTokenAddress: string
): Promise<WithdrawRequest[]> => {
  const giftBoxContract = await getGiftBoxContract();
  const numWithdrawRequestsBn = await giftBoxContract
    .numWithdrawRequests(fundTokenAddress)
    .call();
  const numWithdrawRequests = numWithdrawRequestsBn.toNumber();

  const withdrawRequests = await Promise.all(
    // Trick for getting array of 1...N @ https://stackoverflow.com/a/3746849/5837426
    [...Array(numWithdrawRequests).keys()].map(
      async (x) =>
        await giftBoxContract
          .withdrawRequests(fundTokenAddress, ethers.BigNumber.from(x))
          .call()
    )
  );

  // Properly format and type the data
  return withdrawRequests.map((x) => {
    return {
      title: x.title,
      status: x.status,
      amount: x.amount.div(BigInt(10 ** 18)).toNumber(),
      deadline: new Date(x.deadline.toNumber() * 1000),
      numVotesFor: x.numVotesFor.toNumber(),
      numVotesAgainst: x.numVotesAgainst.toNumber(),
    };
  });
};

export const getFundReferences = async (
  fundTokenAddress: string
): Promise<string[]> => {
  const giftBoxContract = await getGiftBoxContract();
  const numFundReferencesBn = await giftBoxContract
    .numFundReferences(fundTokenAddress)
    .call();
  const numFundReferences = numFundReferencesBn.toNumber();

  return await Promise.all(
    // Trick for getting array of 1...N @ https://stackoverflow.com/a/3746849/5837426
    [...Array(numFundReferences).keys()].map(
      async (x) =>
        await giftBoxContract
          .fundReferences(fundTokenAddress, ethers.BigNumber.from(x))
          .call()
    )
  );
};

export const getWithdrawRequestReferences = async (
  fundTokenAddress: string,
  withdrawRequestId: number
): Promise<string[]> => {
  const giftBoxContract = await getGiftBoxContract();
  const numWithdrawRequestReferencesBn = await giftBoxContract
    .numWithdrawRequestReferences(
      fundTokenAddress,
      ethers.BigNumber.from(withdrawRequestId)
    )
    .call();
  const numWithdrawRequestReferences =
    numWithdrawRequestReferencesBn.toNumber();

  return await Promise.all(
    // Trick for getting array of 1...N @ https://stackoverflow.com/a/3746849/5837426
    [...Array(numWithdrawRequestReferences).keys()].map(
      async (x) =>
        await giftBoxContract
          .withdrawRequestReferences(
            fundTokenAddress,
            ethers.BigNumber.from(withdrawRequestId),
            ethers.BigNumber.from(x)
          )
          .call()
    )
  );
};

export const executeWithdrawRequest = async (
  fundTokenAddress: string,
  withdrawRequestId: number
) => {
  const giftBoxContract = await getGiftBoxContract();
  return await giftBoxContract
    .executeWithdrawRequest(fundTokenAddress, withdrawRequestId)
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });
};

export const getFundTokenSupply = async (fundTokenAddress: string) => {
  if (!window.tronWeb) throw Error("TronWeb not available");
  const fundTokenContract = await window.tronWeb.contract(
    IERC20.abi,
    fundTokenAddress
  );
  const supplyBn = await fundTokenContract.totalSupply().call();
  return supplyBn.div(BigInt(10 ** 18)).toNumber();
};
