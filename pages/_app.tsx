import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { AppShell, Navbar, Header } from "@mantine/core";
import Link from "next/link";

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
              <Link href="/">Home</Link>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
              {/* */}
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60} p="xs">
            {/* Header content */}
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
