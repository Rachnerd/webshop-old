import "../globals.css";
import { ThemeProvider } from "styled-components";
import { AppProps } from "next/app";
import { defaultTheme } from "../theme/default";
import React from "react";
import { Navigation } from "@webshop/organisms";
import { NAVIGATION } from "@webshop/config";
import { MainLayout } from "@webshop/templates";
import { QueryClient, QueryClientProvider } from "react-query";

export interface PageProps {
  currentRoute: string;
}

function MyApp({ Component, pageProps, router }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 0,
          },
        },
      })
  );
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout currentRoute={router.asPath}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AppLayout>
    </ThemeProvider>
  );
}

export default MyApp;

export const AppLayout: React.FunctionComponent<PageProps> = ({
  children,
  currentRoute,
}) => {
  const navigation = NAVIGATION.map((item) => ({
    ...item,
    active: currentRoute === item.url,
  }));
  return (
    <MainLayout headerContent={<Navigation items={navigation} />}>
      {children}
    </MainLayout>
  );
};
