import GameItem from "./GameItem";
import styles from "./GameList.module.css";

const GameList = (props) => {
  if (props.games.length === 0)
    return <p>No games found.</p>;

  return (
    <ul className={styles.list}>
      {props.games.map((game) => (
        <GameItem
          key={game.id}
          id={game.id}
          name={game.name}
          categories={game.categories}
          image={game.image}
          rating={game.rating}
          lastPlayed={game.lastPlayed}
          lastPlayerCount={game.lastPlayerCount}
          onUpdateGame={props.onUpdateGame}
        />
      ))}
    </ul>
  );
};

export default GameList;
