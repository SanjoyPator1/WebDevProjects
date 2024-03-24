import { Route, Routes } from "react-router-dom";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Movie from "./pages/movie";
import { Toaster } from "sonner";

// Create a client
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="flex flex-col h-screen">
        <NavBar />
          <div className="flex-grow px-10 py-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<Movie />} />
            </Routes>
          </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
