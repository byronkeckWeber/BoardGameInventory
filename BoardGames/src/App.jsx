import { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import GameForm from "./components/Form/GameForm";
import GameFilter from "./components/Games/GameFilter";
import GameList from "./components/Games/GameList";
import useHttp from "./hooks/useHttp";
import { FIREBASE_URL } from "./firebase-config";

function App() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "All" });

  const { isLoading, error, sendRequest: fetchGames } = useHttp();

  useEffect(() => {
    const handleTransformGames = (gamesData) => {
      const loadedGames = [];

      for (const key in gamesData) {
        loadedGames.push({
          id: key,
          ...gamesData[key],
          categories: gamesData[key].categories || [],
        });
      }

      setGames(loadedGames);
    };

    fetchGames(`${FIREBASE_URL}/games.json`, {}, handleTransformGames);
  }, [fetchGames]);

  const addGameHandler = (newGame) => {
    setGames((prevGames) => [...prevGames, newGame]);
  };

  const updateGameHandler = (id, changes) => {
    setGames((prevGames) =>
      prevGames.map((game) => (game.id === id ? { ...game, ...changes } : game))
    );
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === "All" || game.categories.includes(filters.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header gameCount={games.length} />
      <main>
        <GameFilter filters={filters} onChangeFilters={setFilters} />

        {isLoading && <p className="message">Loading games...</p>}
        {error && <p className="message error">{error}</p>}
        {!isLoading && !error && (
          <GameList games={filteredGames} onUpdateGame={updateGameHandler} />
        )}

        <GameForm onAddGame={addGameHandler} />
      </main>
    </>
  );
}

export default App;
