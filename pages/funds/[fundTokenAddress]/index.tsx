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
  Table,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Link from "next/link";

import { Fund, WithdrawRequest } from "../../../utils/types";
import {
  depositStableCoins,
  executeWithdrawRequest,
  getFund,
  getFundReferences,
  getFundTokenAddresses,
  getWithdrawRequests,
  voteOnWithdrawRequest,
} from "../../../utils/utils";
import { WalletContext, ConnectionStatusContext } from "../../../utils/context";
import getTronWeb from "../../../utils/tronweb";
import { GetStaticPaths, GetStaticProps } from "next";
import path from "path";
interface FundPageProps {
  fund: Fund | null;
  fundReferences: string[] | null;
  withdrawRequests: WithdrawRequest[] | null;
  fundManagerAddress: string;
}
const FundPage = (props: FundPageProps) => {
  const router = useRouter();
  const { connectedWallet } = useContext(WalletContext);
  const { checkConnectionStatus } = useContext(ConnectionStatusContext);
  const { fundTokenAddress } = router.query;

  const [fund, setFund] = useState<Fund | null>(props.fund);
  const [fundReferences, setFundReferences] = useState<string[] | null>(
    props.fundReferences
  );
  const [isFundTokenAddressValid, setIsFundTokenAddressValid] = useState(true);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);
  const [approveVoteLoading, setApproveVoteLoading] = useState(false);
  const [rejectVoteLoading, setRejectVoteLoading] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [isFundManager, setIsFundManager] = useState(false);
  const [fundManagerAddress, setFundManagerAddress] = useState(
    props.fundManagerAddress
  );
  const [withdrawRequests, setWithdrawRequests] = useState<
    WithdrawRequest[] | null
  >(props.withdrawRequests);

  useEffect(() => {
    checkConnectionStatus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch fund details
  useEffect(() => {
    const fetchFund = async () => {
      let tronWeb = await getTronWeb();
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
          connectedWallet == fund.manager
        );
        // @ts-ignore

        setFundManagerAddress(fund.manager);
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };

    fetchFund();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    checkConnectionStatus?.();
    if (typeof fundTokenAddress !== "string") return;
    setDepositLoading(true);
    try {
      await depositStableCoins(fundTokenAddress, amountToDeposit);
    } catch (error) {
      console.log(error);
    }
    setDepositLoading(false);
  };

  // Fetch withdraw requests for a given fund
  useEffect(() => {
    const fetchWithdrawRequests = async () => {
      if (typeof fundTokenAddress !== "string") return;

      try {
        const withdrawRequests = await getWithdrawRequests(fundTokenAddress);
        if (!withdrawRequests) {
          setIsFundTokenAddressValid(false);
          return;
        }
        setWithdrawRequests(withdrawRequests);
      } catch (error) {
        setIsFundTokenAddressValid(false);
      }
    };
    fetchWithdrawRequests();
  }, [fundTokenAddress, connectedWallet]);

  //Handle button onclick for vote approval or rejection
  const handleVote = async (index: number, vote: boolean) => {
    checkConnectionStatus?.();
    if (vote) {
      setApproveVoteLoading(true);
    } else {
      setRejectVoteLoading(true);
    }
    if (typeof fundTokenAddress !== "string") return;

    try {
      const voteTxn = await voteOnWithdrawRequest(
        fundTokenAddress,
        index,
        vote
      );
      console.log("Vote Submitted with details", voteTxn);
    } catch (error) {
      console.log(error);
    }
    setApproveVoteLoading(false);
    setRejectVoteLoading(false);
  };

  //Handle button onclick for executing withdraw requests
  const handleExecute = async (index: number) => {
    checkConnectionStatus?.();
    setExecuteLoading(true);

    if (typeof fundTokenAddress !== "string") return;

    try {
      const executeTxn = await executeWithdrawRequest(fundTokenAddress, index);
      console.log("Withdraw request executed", executeTxn);
    } catch (error) {
      console.log(error);
    }
    setExecuteLoading(false);
  };

  // Show 404 if fund token address is invalid

  return (
    <div>
      <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
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
              Total Donation: {fund?.amountDeposited}
            </Badge>
            <Badge color="pink" variant="light">
              Total Withdrawl:
              {fund ? fund.amountDeposited - fund.balance : null}
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

      <Card shadow="sm" p="lg" radius="md" mr={"20vw"} mb={20} withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Stack>
            <Title order={5}>{`Withdrawl requests`}</Title>
            <Group>
              <Table striped>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Votes for</th>
                    <th>Votes against</th>
                    <th>Deadline</th>
                    <th>Approve</th>
                    <th>Reject</th>
                    <th hidden={!isFundManager}>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawRequests?.map((request, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{request.title}</td>
                      <td>{request.amount}</td>
                      <td>
                        {request.status === 0
                          ? "Open"
                          : request.status === 1
                          ? "Executed"
                          : "Failed"}
                      </td>
                      <td>{request.numVotesFor}</td>
                      <td>{request.numVotesAgainst}</td>
                      <td>{request.deadline}</td>
                      <td>
                        {
                          <Button
                            loading={approveVoteLoading}
                            color={"green"}
                            onClick={() => handleVote(index, true)}
                          >
                            Approve
                          </Button>
                        }
                      </td>
                      <td>
                        {
                          <Button
                            loading={rejectVoteLoading}
                            color={"red"}
                            onClick={() => handleVote(index, false)}
                          >
                            Reject
                          </Button>
                        }
                      </td>
                      <td>
                        {
                          <Button
                            hidden={!isFundManager}
                            loading={executeLoading}
                            color={"blue"}
                            onClick={() => handleExecute(index)}
                          >
                            Execute
                          </Button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Group>
          </Stack>
        </Group>
      </Card>
    </div>
  );
};

export default FundPage;

//Server side rendering

export const getStaticPaths: GetStaticPaths = async () => {
  const fundTokenAddresses = await getFundTokenAddresses();
  interface path {
    params: {
      fundTokenAddress: string;
    };
  }
  const paths: path[] = [];
  fundTokenAddresses.map((address) => {
    paths.push({
      params: {
        fundTokenAddress: address,
      },
    });
  });
  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const tronWeb = await getTronWeb();
  const fundTokenAddress = context?.params?.fundTokenAddress;

  let withdrawRequests: WithdrawRequest[] | null = null;
  let fund: Fund | null = null;
  let fundReferences: string[] | null = null;
  let fundManagerAddress: string = "";

  if (typeof fundTokenAddress === "string") {
    fund = await getFund(fundTokenAddress);
    fundReferences = await getFundReferences(fundTokenAddress);
    withdrawRequests = await getWithdrawRequests(fundTokenAddress);
    fundManagerAddress = tronWeb?.address.fromHex(fund?.manager);
  }
  return {
    props: {
      fund: fund,
      fundReferences: fundReferences,
      withdrawRequests: withdrawRequests,
      fundManagerAddress: fundManagerAddress,
    }, // will be passed to the page component as props
    revalidate: 60, // In seconds
  };
};
