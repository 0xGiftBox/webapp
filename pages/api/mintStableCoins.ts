// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrivateTronWeb } from "../../utils/tronweb";
import { getStableCoinAddress } from "../../utils/utils";

export type Data = {
  message: string;
  transaction?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, amount } = req.query;
  if (!address || !amount || Number(amount) == NaN) {
    res.status(400).json({ message: "Invalid params" });
  }

  const tronWeb = getPrivateTronWeb();
  const stableCoinAddress = await getStableCoinAddress();
  const stableCoinContract = await tronWeb.contract().at(stableCoinAddress);

  try {
    const transaction = await stableCoinContract
      .mint(address, BigInt(Number(amount) * 10 ** 18))
      .send({ feeLimit: 500_000_000 });

    res
      .status(200)
      .json({ message: "Minted stablecoins as requested", transaction });
  } catch {
    res
      .status(400)
      .json({ message: "Unable to mint stablecoins as requested" });
  }
}
