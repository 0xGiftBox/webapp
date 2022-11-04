const getGiftBoxContract = async () => {
  if (!window.tronWeb) return null;
  return await window.tronWeb
    .contract()
    .at(process.env.NEXT_PUBLIC_GIFTBOX_ADDRESS);
};

export const getStableCoinAddress = async () => {
  const giftBoxContract = await getGiftBoxContract();
  if (!giftBoxContract) throw Error("TronWeb not available");

  return await giftBoxContract.stableCoinAddress().call();
};

// Create fund and return the fund token address
export const createFund = async (
  name: string,
  symbolSuffix: string,
  references: string[]
): Promise<string> => {
  const giftBoxContract = await getGiftBoxContract();
  if (!giftBoxContract) throw Error("TronWeb not available");

  return await giftBoxContract
    .createFund(name, symbolSuffix, references)
    .send({ feeLimit: 500_000_000, shouldPollResponse: true });
};
