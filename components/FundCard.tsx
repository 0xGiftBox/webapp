import { Text, Title, Card, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import getTronWeb from "../utils/tronweb";

import { Fund } from "../utils/types";
interface FundCardProps {
  fund: Fund;
}

const FundCard = ({ fund }: FundCardProps) => {
  // @ts-ignore
  const [fundManagerAddress, setFundManagerAddress] = useState<string | null>(
    null
  );

  useEffect(() => {
    // @ts-ignore
    let tronWeb = getTronWeb();
    setFundManagerAddress(tronWeb?.address.fromHex(fund.manager));
  }, [fund]);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3}>{fund.name}</Title>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Manager</Text>
        <Link
          className="link"
          href={`https://shasta.tronscan.org/#/address/${fundManagerAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          <Badge color="pink" variant="light">
            {
              // @ts-ignore
              fundManagerAddress
                ? fundManagerAddress.slice(0, 5) +
                  "..." +
                  fundManagerAddress.slice(-5)
                : null
            }
          </Badge>
        </Link>
      </Group>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        component={Link}
        href={"/funds/" + fund.fundTokenAddress}
      >
        Visit fund page
      </Button>
    </Card>
  );
};

export default FundCard;
