import { useState } from "react";
import CategoryTag from "./CategoryTag";
import useHttp from "../../hooks/useHttp";
import useInput from "../../hooks/useInput";
import { FIREBASE_URL } from "../../firebase-config";
import styles from "./GameItem.module.css";

const today = new Date().toLocaleDateString("en-CA");

const COVER_COLORS = ["#23493d", "#8c3b2e", "#2f4f7a", "#6b4a8a", "#a9742a", "#3f6b4a"];

// Games without a picture get a colored tile with their name
const coverColor = (name) => {
  let total = 0;
  for (const letter of name)
    total += letter.charCodeAt(0);
  return COVER_COLORS[total % COVER_COLORS.length];
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

const GameItem = (props) => {
  const [isLogging, setIsLogging] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { isLoading, error, sendRequest: patchGame } = useHttp();

  const {
    value: playDate,
    isValid: playDateIsValid,
    hasError: playDateHasError,
    valueChangeHandler: playDateChangeHandler,
    inputBlurHandler: playDateBlurHandler,
    reset: resetPlayDate
  } = useInput((value) => value !== "" && value <= today);

  const {
    value: playerCount,
    isValid: playerCountIsValid,
    hasError: playerCountHasError,
    valueChangeHandler: playerCountChangeHandler,
    inputBlurHandler: playerCountBlurHandler,
    reset: resetPlayerCount
  } = useInput((value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 20);

  // Saves the changes to Firebase, then updates the list on screen
  const updateGame = (changes, onSaved) => {
    patchGame(
      `${FIREBASE_URL}/games/${props.id}.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: changes,
      },
      () => {
        props.onUpdateGame(props.id, changes);
        if (onSaved)
          onSaved();
      }
    );
  };

  const ratingClickHandler = (value) => {
    updateGame({ rating: value });
  };

  const closeLogHandler = () => {
    resetPlayDate();
    resetPlayerCount();
    setIsLogging(false);
  };

  const logSubmitHandler = (event) => {
    event.preventDefault();

    if (!playDateIsValid || !playerCountIsValid) {
      playDateBlurHandler();
      playerCountBlurHandler();
      return;
    }

    updateGame(
      { lastPlayed: playDate, lastPlayerCount: Number(playerCount) },
      closeLogHandler
    );
  };

  const stars = [1, 2, 3, 4, 5].map((value) => (
    <button
      key={value}
      type="button"
      className={value <= props.rating ? `${styles.star} ${styles.filled}` : styles.star}
      onClick={() => ratingClickHandler(value)}
      disabled={isLoading}
      aria-label={`Rate ${props.name} ${value} out of 5`}
    >
      ★
    </button>
  ));

  return (
    <li className={styles.game}>
      {props.image && !imageFailed ? (
        <img
          src={props.image}
          alt={`${props.name} cover`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={styles.cover} style={{ backgroundColor: coverColor(props.name) }}>
          {props.name}
        </div>
      )}
      <div className={styles.details}>
        <h3>{props.name}</h3>

        <div className={styles.tags}>
          {props.categories.map((category) => (
            <CategoryTag key={category} category={category} />
          ))}
        </div>

        <div className={styles.rating}>
          <div className={styles.stars}>{stars}</div>
          <span>{props.rating ? `${props.rating} / 5` : "Not rated yet"}</span>
        </div>

        <p className={styles.played}>
          Last played:{" "}
          {props.lastPlayed
            ? `${formatDate(props.lastPlayed)} with ${props.lastPlayerCount} ${props.lastPlayerCount === 1 ? "player" : "players"}`
            : "Never"}
        </p>

        {!isLogging && (
          <button type="button" className={styles.logButton} onClick={() => setIsLogging(true)}>
            Log a play
          </button>
        )}

        {isLogging && (
          <form className={styles.logForm} onSubmit={logSubmitHandler}>
            <div className={playDateHasError ? `${styles.control} ${styles.invalid}` : styles.control}>
              <label htmlFor={`playDate_${props.id}`}>Date played</label>
              <input
                type="date"
                id={`playDate_${props.id}`}
                max={today}
                value={playDate}
                onChange={playDateChangeHandler}
                onBlur={playDateBlurHandler}
              />
              {playDateHasError && <p className={styles["error-text"]}>Pick a date that is not in the future.</p>}
            </div>
            <div className={playerCountHasError ? `${styles.control} ${styles.invalid}` : styles.control}>
              <label htmlFor={`playerCount_${props.id}`}>Number of players</label>
              <input
                type="number"
                id={`playerCount_${props.id}`}
                min="1"
                max="20"
                value={playerCount}
                onChange={playerCountChangeHandler}
                onBlur={playerCountBlurHandler}
              />
              {playerCountHasError && <p className={styles["error-text"]}>Enter a whole number from 1 to 20.</p>}
            </div>
            <div className={styles.logActions}>
              <button type="submit" className={styles.logButton} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button type="button" className={styles.cancelButton} onClick={closeLogHandler}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <p className={styles["error-text"]}>{error}</p>}
      </div>
    </li>
  );
};

export default GameItem;
