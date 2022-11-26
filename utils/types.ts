import { ethers } from "ethers";

export type Fund = {
  fundTokenAddress: string;
  isOpen: boolean;
  name: string;
  manager: string;
  amountDeposited: number;
  balance: number;
};

export enum WithdrawRequestStatus {
  Open,
  Executed,
  Failed,
}

export type WithdrawRequest = {
  title: string;
  status: WithdrawRequestStatus;
  amount: number;
  deadline: string;
  numVotesFor: number;
  numVotesAgainst: number;
};
