import {
  TextInput,
  Text,
  Button,
  Group,
  Box,
  Textarea,
  NumberInput,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { IconCurrencyDollar } from "@tabler/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { createWithdrawRequest } from "../../../utils/utils";

const CreateWithdrawRequest = () => {
  const router = useRouter();
  const { fundTokenAddress } = router.query;

  const form = useForm({
    initialValues: {
      title: "",
      amount: 0,
      deadline: new Date(),
      references: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (values: typeof form.values) => {
    if (typeof fundTokenAddress !== "string") return;
    setLoading(true);

    try {
      const references = values.references.split(/\r?\n/);
      const withdrawRequestId = await createWithdrawRequest(
        fundTokenAddress,
        values.amount,
        values.title,
        values.deadline,
        references
      );
      console.log("Created withdraw request with ID", withdrawRequestId);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
      <Box sx={{ maxWidth: "auto" }} mx={40}>
        <Text size="xl" pb={10}>
          Create a new withdraw request
        </Text>
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Describe your withdraw request"
            {...form.getInputProps("title")}
          />
          <NumberInput
            label="Donation amount"
            {...form.getInputProps("amount")}
            min={1}
            precision={2}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            icon={<IconCurrencyDollar size={18} />}
          />
          <DatePicker
            placeholder="Pick deadline for voting to end"
            label="Deadline for voting"
            dropdownType="modal"
            minDate={new Date()}
            {...form.getInputProps("deadline")}
          />
          <Textarea
            autosize
            minRows={2}
            label="References"
            placeholder="Links to references"
            {...form.getInputProps("references")}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Card>
  );
};

export default CreateWithdrawRequest;
