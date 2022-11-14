import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Group,
  Title,
  Badge,
} from "@mantine/core";
import {
  NotificationsProvider,
  showNotification,
} from "@mantine/notifications";
import Link from "next/link";

import styles from "./../styles/Home.module.css";
import "../styles/globals.css";
import { WalletContext } from "../utils/context";

function App({ Component, pageProps }: AppProps) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
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

  useEffect(() => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setConnectedWallet(window.tronWeb.defaultAddress.base58);
    }
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      <NotificationsProvider>
        <AppShell
          padding="md"
          navbar={
            <Navbar p="md" width={{ sm: 250 }} style={{ width: 250 }}>
              <Navbar.Section pb={20}>
                <Link className={styles.navLink} href="/">
                  Home
                </Link>
                <Link className={styles.navLink} href="/create-fund">
                  Create Fund
                </Link>
                <Link className={styles.navLink} href="/funds-you-created">
                  Funds you created
                </Link>
                <Link className={styles.navLink} href="/funds-you-donated-to">
                  Funds you donated to
                </Link>
              </Navbar.Section>
              <Navbar.Section grow mt="md">
                {}
              </Navbar.Section>
            </Navbar>
          }
          header={
            <Header height={70} p="md">
              <Group position="apart">
                <Title order={1}>GiftBox</Title>
                {connectedWallet ? (
                  <Badge size="lg">{connectedWallet}</Badge>
                ) : null}
              </Group>
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <WalletContext.Provider value={{ connectedWallet }}>
            <Component {...pageProps} />
          </WalletContext.Provider>
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
