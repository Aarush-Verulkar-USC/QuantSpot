import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./graphql/client";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Header } from "./components/layout/Header";
import { GlobalStatsBar } from "./components/market/GlobalStatsBar";
import { TopMovers } from "./components/market/TopMovers";
import { CoinTable } from "./components/market/CoinTable";
import { CoinDetail } from "./components/market/CoinDetail";

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <DashboardLayout>
        <Header />
        <GlobalStatsBar />
        <TopMovers />
        <CoinTable />
        <CoinDetail />
      </DashboardLayout>
    </ApolloProvider>
  );
}
