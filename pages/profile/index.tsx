import { useContext, useEffect, useState } from "react";
import { List, SimpleGrid, Loader } from "@mantine/core";
import FundCard from "../../components/FundCard";
import AddressLink from "../../components/AddressLink";
import Link from "next/link";
import { getFund, getFundTokenAddresses } from "../../utils/utils";
import { Fund } from "../../utils/types";
import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Card,
  Badge,
  Title,
  Table,
} from "@mantine/core";
import { WalletContext } from "../../utils/context";
const ProfilePage = () => {
  const [loading, isLoading] = useState(false);
  const [funds, setFunds] = useState<Fund[] | null>(null);
  const [fundsCreatedByYou, setFundsCreatedByYou] = useState<
    Fund[] | null | undefined
  >(null);
  const [notification, setNotification] = useState("");
  const { connectedWallet } = useContext(WalletContext);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        isLoading(true);
        const fundTokenAddresses = await getFundTokenAddresses();
        const funds = await Promise.all(
          fundTokenAddresses.map(async (x) => await getFund(x))
        );
        // @ts-ignore
        setFunds(funds);
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
  }, []);

  useEffect(() => {
    const filterFunds = async () => {
      try {
        const filteredFunds = funds?.filter(
          (fund) =>
            // @ts-ignore
            window?.tronWeb?.address.fromHex(fund.manager) === connectedWallet
        );
        setFundsCreatedByYou(filteredFunds);
      } catch (e) {
        console.log("error:", e);
      }
      isLoading(false);
      // @ts-ignore
    };

    filterFunds();
  }, [funds, connectedWallet]);

  return (
    <div>
      <LoadingOverlay visible={!fundsCreatedByYou} overlayBlur={0} />
      <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Stack>
            <Title order={5}>{`List of funds created by you`}</Title>
            <Group>
              <Table striped>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Manager</th>
                    <th>Fund Token Address</th>
                    <th>Status</th>
                    <th>Amount deposited</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {fundsCreatedByYou?.map((fund, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{fund.name}</td>
                      <td>{<AddressLink address={fund.manager} />}</td>
                      <td>{<AddressLink address={fund.fundTokenAddress} />}</td>
                      <td>{fund.isOpen === true ? "Open" : "Closed"}</td>
                      <td>{fund.amountDeposited}</td>
                      <td>{fund.balance}</td>
                      <td>
                        {
                          <Button
                            variant="light"
                            color="blue"
                            component={Link}
                            href={"/funds/" + fund.fundTokenAddress}
                          >
                            Visit fund page
                          </Button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Group>
          </Stack>
        </Group>
      </Card>
    </div>
  );
};

export default ProfilePage;
