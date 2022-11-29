import { TextInput, Button, Group, Box, Text, Card } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Data } from "./api/mintStableCoins";
import Link from "next/link";

const MintStableCoins = () => {
  const form = useForm({
    initialValues: {
      address: "",
      amount: "",
    },
    validate: {
      address: (value) => (value.length < 1 ? "Can not be empty" : null),
      amount: (value) => (value.length < 1 ? "Can not be empty" : null),
    },
  });

  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/mintStableCoins?address=${values.address}&amount=${values.amount}
      `
      );
      const data: Data = await response.json();
      if (response.status === 200) {
        showNotification({
          title: data.message,
          message: (
            <Link
              //@ts-ignore
              href={`https://shasta.tronscan.org/#/transaction/${data.transaction}`}
              target="_blank"
              rel="noreferrer"
            >
              Check on block explorer
            </Link>
          ),
          color: "red",
        });
      }
      if (response.status === 400) {
        showNotification({
          title: data.message,
          message: "",
          color: "red",
        });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
      <Box sx={{ maxWidth: "auto" }} mx={40}>
        <Text size="xl" pb={10}>
          Mint Test StableCoins
        </Text>
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <TextInput
            withAsterisk
            label="Address"
            placeholder="Your tron address"
            {...form.getInputProps("address")}
          />
          <TextInput
            withAsterisk
            label="Amount"
            placeholder="Amount to mint"
            {...form.getInputProps("amount")}
          />

          <Group position="right" mt="md">
            <Button loading={loading} type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Card>
  );
};

export default MintStableCoins;
