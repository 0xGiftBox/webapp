import { Title } from "@mantine/core";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import { Fund } from "../utils/types";
import styles from "../styles/Home.module.css";

export default function FundsCreated() {
  const filterFunction = async (x: Fund) => {
    return x.manager === window?.tronWeb?.defaultAddress.hex;
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Title order={1}>Funds created by you</Title>
        <p>
          {`Get started by `}
          <Link className="link" href="/create-fund">
            creating a new fund.
          </Link>
        </p>
        <ListFunds filterFunction={filterFunction} />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
