import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Fund } from "../../../utils/types";
import { depositStableCoins, getFund } from "../../../utils/utils";
import ErrorPage from "next/error";
import Link from "next/link";
import { WalletContext } from "../../../utils/context";

const FundPage = () => {
  const router = useRouter();
  const { connectedWallet } = useContext(WalletContext);
  const { fundTokenAddress } = router.query;

  const [fund, setFund] = useState<Fund | null>(null);
  const [isFundTokenAddressValid, setIsFundTokenAddressValid] = useState(true);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);
  const [isFundManager, setIsFundManager] = useState(false);

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
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };

    fetchFund();
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
    <Stack>
      <LoadingOverlay visible={!fund} overlayBlur={2} />
      <Text>Fund: {fund?.name}</Text>
      <Group>
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
        <Button onClick={handleDeposit} loading={depositLoading}>
          Donate
        </Button>
      </Group>
      {isFundManager ? (
        <Link href={`/funds/${fundTokenAddress}/create-withdraw-request`}>
          Create Withdraw Request
        </Link>
      ) : null}
    </Stack>
  );
};

export default FundPage;
