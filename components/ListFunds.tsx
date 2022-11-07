import { List, Text } from "@mantine/core";
import { Loader } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";

export const ListFunds = () => {
  const [loading, isLoading] = useState(false);
  const [funds, setFunds] = useState<Fund[] | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      isLoading(true);
      const fundTokenAddresses = await getFundTokenAddresses();
      const funds = await Promise.all(
        fundTokenAddresses.map(async (x) => await getFund(x))
      );
      isLoading(false);
      setFunds(funds);
    };

    fetchFunds();
  }, []);

  return loading ? (
    <p>
      {`Please wait `}
      <Loader variant="dots" />
    </p>
  ) : funds ? (
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
