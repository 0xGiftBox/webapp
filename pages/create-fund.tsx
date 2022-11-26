import {
  TextInput,
  Button,
  Group,
  Box,
  Textarea,
  Text,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { createFund } from "../utils/utils";
import { ConnectionStatusContext } from "../utils/context";

const CreateFund = () => {
  const { checkConnectionStatus } = useContext(ConnectionStatusContext);

  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      symbolSuffix: "",
      references: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Can not be empty" : null),
      symbolSuffix: (value) => (value.length < 3 ? "Minimum 3 letters" : null),
    },
  });

  const [createFundLoading, setCreateFundLoading] = useState(false);

  const onFormSubmit = async (values: typeof form.values) => {
    setCreateFundLoading(true);
    checkConnectionStatus?.();

    try {
      const references = values.references.split(/\r?\n/);
      const fundTokenAddress = await createFund(
        values.name,
        values.symbolSuffix,
        references
      );
      console.log("Created fund with token address", fundTokenAddress);
      router.push("/funds/" + fundTokenAddress);
    } catch (error) {
      console.log(error);
    }

    setCreateFundLoading(false);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
      <Box sx={{ maxWidth: "auto" }} mx={40}>
        <Text size="xl" pb={10}>
          Create a new fund
        </Text>
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Name of the fund"
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Fundcoin symbol"
            placeholder="3-5 letter identifier for your fund"
            {...form.getInputProps("symbolSuffix")}
          />
          <Textarea
            autosize
            minRows={2}
            label="References"
            placeholder="Links to references"
            {...form.getInputProps("references")}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={createFundLoading}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Card>
  );
};

export default CreateFund;
