import { ethers } from "ethers";

export type Fund = {
  fundTokenAddress: string;
  isOpen: boolean;
  name: string;
  manager: string;
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
  deadline: Date;
  numVotesFor: number;
  numVotesAgainst: number;
};
