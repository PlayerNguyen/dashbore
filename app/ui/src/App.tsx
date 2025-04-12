import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./app.css";
import Unauthenticated from "./pages/Unauthenticated";
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Unauthenticated />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </MantineProvider>
  );
}
