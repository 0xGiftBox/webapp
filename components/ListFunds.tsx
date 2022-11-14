import { useEffect, useState } from "react";
import { List, Text, Loader, SimpleGrid } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";
import FundCard from "./FundCard";

export type ListFundsProps = {
  filterFunction?: (arg0: Fund) => Promise<boolean>;
};

export const ListFunds = ({ filterFunction }: ListFundsProps) => {
  const [loading, isLoading] = useState(false);
  const [funds, setFunds] = useState<Fund[] | null>(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        isLoading(true);
        const fundTokenAddresses = await getFundTokenAddresses();
        const funds = await Promise.all(
          fundTokenAddresses.map(async (x) => await getFund(x))
        );
        const nonNullFunds = funds.flatMap((x) => (!!x ? [x] : []));
        const filterBooleans: boolean[] = filterFunction
          ? await Promise.all(nonNullFunds.map(filterFunction))
          : new Array(nonNullFunds.length).fill(true);
        const filteredFunds = nonNullFunds.filter((_, i) => filterBooleans[i]);
        setFunds(filteredFunds);
      } catch (e) {
        if (window.tronWeb) {
          setNotification("Please use shasta testnet.");
        } else {
          setNotification("Please install tronlink wallet.");
        }
      }
      isLoading(false);
      // @ts-ignore
    };

    fetchFunds();
  }, [filterFunction]);

  useEffect(() => {
    if (notification !== "") {
      showNotification({
        title: notification,
        message: "",
        color: "red",
      });
    }
  }, [notification]);

  return loading ? (
    <p>
      {`Please wait `}
      <Loader variant="dots" />
    </p>
  ) : funds?.length ? (
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
    <Text>No funds available</Text>
  );
};
