import { TextInput, Button, Group, Box, Textarea, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useState } from "react";
import { createFund } from "../utils/utils";

const CreateFund = () => {
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
    <Box sx={{ maxWidth: 300 }} mx={40}>
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
  );
};

export default CreateFund;
