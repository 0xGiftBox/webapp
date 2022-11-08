import { useEffect, useState } from "react";
import { List, Text, Loader, SimpleGrid } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";
import FundCard from "./FundCard";

export const ListFunds = () => {
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
        setFunds(funds);
      } catch (e) {
        if (window.tronWeb) {
          setNotification("Please use shasta testnet.");
        } else {
          setNotification("Please install tronlink wallet.");
        }
      }
      isLoading(false);
    };

    fetchFunds();
  }, []);

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
