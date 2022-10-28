import { TextInput, Button, Group, Box, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

const CreateFund = () => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      references: "",
    },
  });

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Name of the fund"
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Description"
          placeholder="Provide a brief description"
          {...form.getInputProps("description")}
        />
        <Textarea
          withAsterisk
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
