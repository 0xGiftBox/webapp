import { Title } from "@mantine/core";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";

export default function Home() {
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
        <ListFunds />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
