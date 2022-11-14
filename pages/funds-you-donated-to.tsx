import { Title } from "@mantine/core";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";
import { getFundTokenBalance } from "../utils/utils";

export default function FundsDonatedTo() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Title order={1}>Funds you donated to</Title>
        <p>
          {`Get started by `}
          <Link className="link" href="/">
            selecting a fund.
          </Link>
        </p>
        <ListFunds
          filterFunction={async (x) =>
            await getFundTokenBalance(
              x.fundTokenAddress,
              // @ts-ignore
              window.tronWeb?.defaultAddress.hex
            )
          }
        />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
