import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Text,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Fund } from "../../utils/types";
import { depositStableCoins, getFund } from "../../utils/utils";
import ErrorPage from "next/error";

const FundPage = () => {
  const router = useRouter();
  const { fundTokenAddress } = router.query;

  const [fund, setFund] = useState<Fund | null>(null);
  const [isFundTokenAddressValid, setIsFundTokenAddressValid] = useState(true);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const [donateLoading, setDonateLoading] = useState(false);

  useEffect(() => {
    const fetchFund = async () => {
      if (typeof fundTokenAddress !== "string") return;
      try {
        const fund = await getFund(fundTokenAddress);
        setFund(fund);
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };

    fetchFund();
  }, [fundTokenAddress]);

  const handleDonate = async () => {
    if (typeof fundTokenAddress !== "string") return;

    setDonateLoading(true);
    try {
      await depositStableCoins(fundTokenAddress, amountToDeposit);
    } catch (error) {
      console.log(error);
    }
    setDonateLoading(false);
  };

  // Show 404 if fund token address is invalid
  if (!isFundTokenAddressValid) return <ErrorPage statusCode={404}></ErrorPage>;

  return (
    <Group>
      <LoadingOverlay visible={!fund} overlayBlur={2} />
      <Text>Fund: {fund?.name}</Text>
      <Group>
        <NumberInput
          label="Donation amount"
          value={amountToDeposit}
          onChange={(val) => setAmountToDeposit(val)}
          min={1}
          precision={2}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          icon={<IconCurrencyDollar size={18} />}
        />
        <Button onClick={handleDonate} loading={donateLoading}>
          Donate
        </Button>
      </Group>
    </Group>
  );
};

export default FundPage;
