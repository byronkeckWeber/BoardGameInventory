import { getCategoryIcon } from "../../data/categories";
import styles from "./CategoryTag.module.css";

const CategoryTag = (props) => {
  return (
    <span className={styles.tag}>
      {getCategoryIcon(props.category)} {props.category}
    </span>
  );
};

export default CategoryTag;
