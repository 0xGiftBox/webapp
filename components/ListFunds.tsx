import { useEffect, useState, useContext } from "react";
import { List, Text, Loader, SimpleGrid } from "@mantine/core";
import { Fund } from "../utils/types";
import { getFund, getFundTokenAddresses } from "../utils/utils";
import FundCard from "./FundCard";
import { ConnectionStatusContext } from "../utils/context";

export type ListFundsProps = {
  filterFunction?: (arg0: Fund) => Promise<boolean>;
  funds?: Fund[] | null;
};

export const ListFunds = (props: ListFundsProps) => {
  const { filterFunction } = props;
  const { checkConnectionStatus } = useContext(ConnectionStatusContext);

  const [loading, isLoading] = useState(false);
  const [funds, setFunds] = useState<Fund[] | null>(
    props.funds ? props.funds : null
  );

  useEffect(() => {
    checkConnectionStatus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        console.log("err:", e);
      }
      isLoading(false);
      // @ts-ignore
    };

    fetchFunds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!funds && loading) {
    return (
      <p>
        {`Please wait `}
        <Loader variant="dots" />
      </p>
    );
  }
  return funds?.length ? (
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
