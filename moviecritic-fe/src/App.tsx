import { Route, Routes } from "react-router-dom";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Home from "./pages/home";
import Movie from "./pages/movie";
import Layout from "./pages/layout";

// Create a client
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/movie/:id" element={<Layout><Movie /></Layout>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
