import styles from "./Header.module.css";

const Header = (props) => {
  return (
    <header className={styles.header}>
      <h1>Board Game Inventory</h1>
      <p>
        {props.gameCount > 0
          ? `${props.gameCount} ${props.gameCount === 1 ? "game" : "games"} on the shelf`
          : "Track ratings, categories, and play history"}
      </p>
    </header>
  );
};

export default Header;
