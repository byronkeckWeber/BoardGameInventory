import Card from "../UI/Card";
import { CATEGORIES } from "../../data/categories";
import styles from "./GameFilter.module.css";

const GameFilter = (props) => {
  const searchChangeHandler = (event) => {
    props.onChangeFilters({ ...props.filters, search: event.target.value });
  };

  const categoryChangeHandler = (event) => {
    props.onChangeFilters({ ...props.filters, category: event.target.value });
  };

  return (
    <Card>
      <div className={styles.title}>
        <h2>Find a Game</h2>
        <span className={styles.badge}>NEW: Search &amp; Filter</span>
      </div>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name"
          aria-label="Search by name"
          value={props.filters.search}
          onChange={searchChangeHandler}
        />
        <select
          aria-label="Filter by category"
          value={props.filters.category}
          onChange={categoryChangeHandler}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item.name} value={item.name}>{item.icon} {item.name}</option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default GameFilter;
