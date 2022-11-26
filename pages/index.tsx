import { useState, useEffect, useContext } from "react";
import { showNotification } from "@mantine/notifications";
import { Title } from "@mantine/core";
import { GetStaticProps } from "next";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";
import { Fund } from "../utils/types";
import { getFundTokenAddresses, getFund } from "../utils/utils";
import { connectionStatus } from "../utils/types";
import { getConnectionStatus } from "../utils/tronweb";
import { ConnectionStatusContext } from "../utils/context";

interface HomeProps {
  funds: Fund[] | null;
}
export default function Home({ funds }: HomeProps) {
  const { checkConnectionStatus } = useContext(ConnectionStatusContext);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Title order={1}>Welcome to Giftbox.</Title>
        <p>
          {`Get started by `}
          <Link className="link" href="/create-fund">
            creating a new fund
          </Link>
          {` or choosing a fund from below to donate to.`}
        </p>
        <ListFunds
          funds={funds}
          checkConnectionStatus={checkConnectionStatus}
        />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}

//Server side rendering
export const getStaticProps: GetStaticProps = async () => {
  const fundTokenAddresses = await getFundTokenAddresses();
  const funds = await Promise.all(
    fundTokenAddresses.map(async (x) => await getFund(x))
  );
  return {
    props: { funds: funds }, // will be passed to the page component as props
    revalidate: 60, // In seconds
  };
};
