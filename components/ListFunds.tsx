import {
  List,
  Text,
  Title,
  Loader,
  SimpleGrid,
  Card,
  Badge,
  Button,
  Group,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";
import FundCard from "./FundCard";

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
      <SimpleGrid cols={3}>
        {funds.map((fund, index) => (
          <div key={index}>
            <FundCard fund={fund} />
          </div>
        ))}
      </SimpleGrid>
    </List>
  ) : (
    <Text>no funds available</Text>
  );
};
