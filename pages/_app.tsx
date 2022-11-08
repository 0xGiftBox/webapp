import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Group,
  Title,
  Text,
} from "@mantine/core";
import Link from "next/link";
import styles from "./../styles/Home.module.css";
import { useEffect, useState } from "react";
import { WalletContext } from "../utils/context";

function App({ Component, pageProps }: AppProps) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setConnectedWallet(window.tronWeb.defaultAddress.base58);
    } else {
      setConnectedWallet(null);
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
      <AppShell
        padding="md"
        navbar={
          <Navbar p="md" width={{ sm: 250 }} style={{ width: 250 }}>
            <Navbar.Section pb={20}>
              <Link className={styles.nav_link} href="/">
                Home
              </Link>
              <Link className={styles.nav_link} href="/create-fund">
                Create Fund
              </Link>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
              {/* */}
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <Group position="apart">
              <Title order={1}>GiftBox</Title>
              {connectedWallet ? (
                <Text>Logged in as {connectedWallet}</Text>
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
    </MantineProvider>
  );
}

export default App;
