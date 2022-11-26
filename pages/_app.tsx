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
import { connectionStatus } from "../utils/types";
import { WalletContext } from "../utils/context";
import { ConnectionStatusContext } from "../utils/context";
import { getConnectionStatus } from "../utils/tronweb";

function App({ Component, pageProps }: AppProps) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<connectionStatus | null>(null);

  const checkConnectionStatus = () => {
    setTimeout(() => {
      setConnectionStatus(getConnectionStatus());
    }, 500);
  };

  useEffect(() => {
    if (connectionStatus) {
      if (!connectionStatus?.isTronLinkInstalled) {
        showNotification({
          title: "Please install TronLink",
          message: "",
          color: "red",
        });
      } else if (!connectionStatus.isTronLinkUnlocked) {
        showNotification({
          title: "Please unlock TronLink",
          message: "",
          color: "red",
        });
      } else if (connectionStatus.network !== "shasta") {
        showNotification({
          title: "Please switch to Shasta Testnet",
          message: "",
          color: "red",
        });
      }
    }
  }, [connectionStatus]);

  useEffect(() => {
    function getTronweb() {
      let i = 0;
      var obj = setInterval(async () => {
        setTimeout(() => {
          clearInterval(obj);
        }, 1000);
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          clearInterval(obj);
          // @ts-ignore
          setConnectedWallet(window.tronWeb.defaultAddress.base58);
        }
      }, 10);
    }
    getTronweb();
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
          <ConnectionStatusContext.Provider value={{ checkConnectionStatus }}>
            <WalletContext.Provider value={{ connectedWallet }}>
              <Component {...pageProps} />
            </WalletContext.Provider>
          </ConnectionStatusContext.Provider>
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
