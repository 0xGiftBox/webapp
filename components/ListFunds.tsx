import { List, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";

export const ListFunds = () => {
  const [funds, setFunds] = useState<Fund[] | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      const fundTokenAddresses = await getFundTokenAddresses();
      const funds = await Promise.all(
        fundTokenAddresses.map(async (x) => await getFund(x))
      );
      setFunds(funds);
    };

    fetchFunds();
  });

  return funds ? (
    <List>
      {funds.map((fund) => (
        <List.Item key={fund.fundTokenAddress}>
          <Link href={"/funds/" + fund.fundTokenAddress}>{fund.name}</Link>
        </List.Item>
      ))}
    </List>
  ) : (
    <Text>no funds available</Text>
  );
};
