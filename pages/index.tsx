import { Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>GiftBox</title>
        <meta name="description" content="giftbox" />
      </Head>

      <main className={styles.main}>
        <Title order={1}>Welcome to Giftbox.</Title>

        <p>
          Get started by <Link href="/create-fund">creating a new fund.</Link>
        </p>
        <ListFunds />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
