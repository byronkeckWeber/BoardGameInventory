import { useState } from "react";
import Card from "../UI/Card";
import useInput from "../../hooks/useInput";
import useHttp from "../../hooks/useHttp";
import { CATEGORIES } from "../../data/categories";
import { FIREBASE_URL } from "../../firebase-config";
import styles from "./GameForm.module.css";

const GameForm = (props) => {
  const { isLoading, error, sendRequest: postGame } = useHttp();

  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName
  } = useInput((value) => value.trim() !== "");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesTouched, setCategoriesTouched] = useState(false);
  const [rating, setRating] = useState(0);

  const categoriesAreValid = selectedCategories.length > 0;
  const categoriesHaveError = !categoriesAreValid && categoriesTouched;

  const categoryChangeHandler = (categoryName) => {
    setCategoriesTouched(true);
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(categoryName))
        return prevCategories.filter((item) => item !== categoryName);

      return [...prevCategories, categoryName];
    });
  };

  const {
    value: image,
    isValid: imageIsValid,
    hasError: imageHasError,
    valueChangeHandler: imageChangeHandler,
    inputBlurHandler: imageBlurHandler,
    reset: resetImage
  } = useInput((value) => value.trim() === "" || value.trim().startsWith("http") || value.trim().startsWith("/"));

  let formIsValid = false;
  if (nameIsValid && categoriesAreValid && imageIsValid)
    formIsValid = true;

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      nameBlurHandler();
      setCategoriesTouched(true);
      imageBlurHandler();
      return;
    }

    const newGame = {
      name: name.trim(),
      categories: selectedCategories,
      image: image.trim(),
      rating: rating,
      lastPlayed: "",
      lastPlayerCount: 0,
    };

    // Firebase sends back the new id as data.name
    const handleCreatedGame = (data) => {
      props.onAddGame({ id: data.name, ...newGame });
      resetName();
      setSelectedCategories([]);
      setCategoriesTouched(false);
      resetImage();
      setRating(0);
    };

    postGame(
      `${FIREBASE_URL}/games.json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newGame,
      },
      handleCreatedGame
    );
  };

  const nameClasses = nameHasError ? `${styles.control} ${styles.invalid}` : styles.control;
  const categoryClasses = categoriesHaveError ? `${styles.control} ${styles.invalid}` : styles.control;
  const imageClasses = imageHasError ? `${styles.control} ${styles.invalid}` : styles.control;

  return (
    <Card>
      <h2>Add a Game</h2>
      <form onSubmit={formSubmitHandler}>
        <div className={nameClasses}>
          <label htmlFor="name">Game Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && <p className={styles["error-text"]}>Name must not be empty.</p>}
        </div>

        <fieldset className={categoryClasses}>
          <legend>Categories</legend>
          <div className={styles.checkboxes}>
            {CATEGORIES.map((item) => (
              <label key={item.name}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item.name)}
                  onChange={() => categoryChangeHandler(item.name)}
                />
                {item.icon} {item.name}
              </label>
            ))}
          </div>
          {categoriesHaveError && (
            <p className={styles["error-text"]}>Please choose at least one category.</p>
          )}
        </fieldset>

        <div className={styles.control}>
          <label>Your Rating (optional)</label>
          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={value <= rating ? `${styles.star} ${styles.filled}` : styles.star}
                onClick={() => setRating(value === rating ? 0 : value)}
                aria-label={`Rate ${value} out of 5`}
                aria-pressed={value <= rating}
              >
                ★
              </button>
            ))}
            <span>{rating ? `${rating} / 5` : "Not rated yet"}</span>
          </div>
        </div>

        <div className={imageClasses}>
          <label htmlFor="image">Image URL (optional)</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={imageChangeHandler}
            onBlur={imageBlurHandler}
          />
          {imageHasError && (
            <p className={styles["error-text"]}>Image must start with http or / (or leave it blank).</p>
          )}
        </div>

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Add Game"}
        </button>
        {error && <p className={styles["error-text"]}>{error}</p>}
      </form>
    </Card>
  );
};

export default GameForm;
