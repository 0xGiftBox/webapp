import { useEffect, useState } from "react";
import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import Head from "next/head";
import Link from "next/link";
import { ListFunds } from "../components/ListFunds";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [notification, setNotification] = useState("");

  useEffect(() => {
    window.addEventListener("message", function (e) {
      if (e.data.message && e.data.message.action == "tabReply")
        if (e.data.message.data.data == "") {
          setNotification("Please unlock tronlink wallet");
        }
    });

    return () => {
      window.removeEventListener("message", () => {}, false);
    };
  });

  useEffect(() => {
    if (notification !== "") {
      showNotification({
        title: notification,
        message: "",
        color: "red",
      });
    }
  }, [notification]);

  return (
    <div className={styles.container}>
      <Head>
        <title>GiftBox</title>
        <meta name="description" content="giftbox" />
      </Head>

      <main className={styles.main}>
        <Title order={1}>Welcome to Giftbox.</Title>
        <p>
          Get started by
          <Link className="link" href="/create-fund">
            creating a new fund.
          </Link>
        </p>
        <ListFunds />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
