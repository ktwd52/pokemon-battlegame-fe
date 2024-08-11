import { createBrowserRouter, createRoutesFromElements, Link, Outlet, Route, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import LeaderboardPage from "./components/LeaderboardPage";
import BattlePage from "./components/Battle/BattlePage";
import MyRosterPage from "./components/MyRosterPage";
import PokemonDetailsPage from "./components/PokemonDetailsPage";
import PageNotFound from "./components/PageNotFound";
import { PokemonProvider } from "./components/context/PokemonContext";

const MainLayout = () => {
  return (
    <>
      <PokemonProvider>
        <Navbar />
        <Outlet />
      </PokemonProvider>
      <Footer />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Homepage />}></Route>
      <Route path="leaderboard" element={<LeaderboardPage />}></Route>
      <Route path="battle" element={<BattlePage />}></Route>
      <Route path="roster" element={<MyRosterPage />}></Route>
      <Route path="pokemon/:id" element={<PokemonDetailsPage />}></Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
