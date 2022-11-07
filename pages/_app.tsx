import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Group,
  Title,
} from "@mantine/core";
import Link from "next/link";
import styles from "./../styles/Home.module.css";
function App({ Component, pageProps }: AppProps) {
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
            </Navbar.Section>
            <Navbar.Section grow mt="md">
              {/* */}
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <Group position="apart">
              <Group>
                <Title order={1}>Giftbox</Title>
              </Group>
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
        <Component {...pageProps} />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
