export const CATEGORIES = [
  { name: "Strategy", icon: "♟️" },
  { name: "Family", icon: "🏠" },
  { name: "Co-op", icon: "🤝" },
  { name: "Party", icon: "🎉" },
  { name: "Card", icon: "🃏" },
  { name: "Dice", icon: "🎲" },
  { name: "Complicated", icon: "🧩" },
  { name: "2 Player", icon: "👥" },
  { name: "Non-English", icon: "🌍" },
];

export const getCategoryIcon = (name) => {
  const found = CATEGORIES.find((category) => category.name === name);
  return found ? found.icon : "🎲";
};
