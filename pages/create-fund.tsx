import { TextInput, Button, Group, Box, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFund } from "../components/utils";

const CreateFund = () => {
  const form = useForm({
    initialValues: {
      name: "",
      symbolSuffix: "",
      references: "",
    },
  });

  const onFormSubmit = async (values: typeof form.values) => {
    const references = values.references.split(/\r?\n/);
    const fundTokenAddress = await createFund(
      values.name,
      values.symbolSuffix,
      references
    );
    console.log(
      "Successfully created fund, fund token address:",
      fundTokenAddress
    );
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
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
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};

export default CreateFund;
