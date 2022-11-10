import { useContext, useEffect, useState } from "react";
import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
  Card,
  Badge,
  Title,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Link from "next/link";

import { Fund } from "../../../utils/types";
import {
  depositStableCoins,
  getFund,
  getFundReferences,
} from "../../../utils/utils";
import { WalletContext } from "../../../utils/context";

const FundPage = () => {
  const router = useRouter();
  const { connectedWallet } = useContext(WalletContext);
  const { fundTokenAddress } = router.query;

  const [fund, setFund] = useState<Fund | null>(null);
  const [fundReferences, setFundReferences] = useState<string[] | null>(null);

  getFundReferences;
  const [isFundTokenAddressValid, setIsFundTokenAddressValid] = useState(true);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);
  const [isFundManager, setIsFundManager] = useState(false);
  const [fundManagerAddress, setFundManagerAddress] = useState("");

  // Fetch fund details
  useEffect(() => {
    const fetchFund = async () => {
      if (typeof fundTokenAddress !== "string") return;

      try {
        const fund = await getFund(fundTokenAddress);
        if (!fund) {
          setIsFundTokenAddressValid(false);
          return;
        }

        setFund(fund);
        setIsFundManager(
          // @ts-ignore
          connectedWallet == window?.tronWeb?.address.fromHex(fund.manager)
        );
        setFundManagerAddress(window?.tronWeb?.address.fromHex(fund.manager));
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };

    fetchFund();
  }, [fundTokenAddress, connectedWallet]);

  // Fetch fund references
  useEffect(() => {
    const fetchFundReferences = async () => {
      if (typeof fundTokenAddress !== "string") return;

      try {
        const fundReferences = await getFundReferences(fundTokenAddress);
        if (!fundReferences) {
          setIsFundTokenAddressValid(false);
          return;
        }
        setFundReferences(fundReferences);
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };
    fetchFundReferences();
  }, [fundTokenAddress, connectedWallet]);

  // Handle click on deposit// donate button
  const handleDeposit = async () => {
    if (typeof fundTokenAddress !== "string") return;
    setDepositLoading(true);
    try {
      await depositStableCoins(fundTokenAddress, amountToDeposit);
    } catch (error) {
      console.log(error);
    }
    setDepositLoading(false);
  };

  // Show 404 if fund token address is invalid
  if (!isFundTokenAddressValid) return <ErrorPage statusCode={404}></ErrorPage>;

  return (
    <div>
      <LoadingOverlay visible={!fund} overlayBlur={2} />

      <Card shadow="sm" p="lg" radius="md" mr={"30vw"} withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Stack>
            <Title order={2}>{fund?.name}</Title>
            <Group>
              <Title order={6}>{`Manager:`}</Title>
              <Text size={"sm"}>
                <Link
                  className="link"
                  href={`https://shasta.tronscan.org/#/address/${fundManagerAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {fundManagerAddress}
                </Link>
              </Text>
            </Group>
            <Text weight={500}>{"References"}</Text>
          </Stack>
          <Stack>
            <Badge color="green" variant="light">
              Total Donation: $100
            </Badge>
            <Badge color="pink" variant="light">
              Total Withdrawl: $50
            </Badge>
          </Stack>
        </Group>
        <Stack>
          <Text size="sm" color="dimmed">
            {fundReferences}
          </Text>
          <NumberInput
            label="Donation amount"
            value={amountToDeposit}
            // @ts-ignore
            onChange={(val) => setAmountToDeposit(val)}
            min={1}
            precision={2}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            icon={<IconCurrencyDollar size={18} />}
          />
        </Stack>
        <Button
          variant="filled"
          color="green"
          fullWidth
          mt="md"
          radius="md"
          onClick={handleDeposit}
          loading={depositLoading}
        >
          Donate
        </Button>
        {isFundManager ? (
          <Button
            variant="light"
            color="pink"
            fullWidth
            mt="md"
            radius="md"
            component={Link}
            href={`/funds/${fundTokenAddress}/create-withdraw-request`}
          >
            Create withdraw request
          </Button>
        ) : null}
      </Card>
    </div>
  );
};

export default FundPage;
