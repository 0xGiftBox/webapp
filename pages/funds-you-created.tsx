import { Title } from "@mantine/core";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";

export default function FundsCreated() {
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
        <ListFunds
          filterFunction={async (x) =>
            x.manager === window.tronWeb?.defaultAddress.hex
          }
        />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
