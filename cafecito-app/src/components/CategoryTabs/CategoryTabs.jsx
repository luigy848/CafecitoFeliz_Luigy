import "./CategoryTabs.css";

export default function CategoryTabs({ categories, selected, onSelect }) {
  const tabClass = (value) =>
    value === selected ? "category-tab category-tab-active" : "category-tab";

  return (
    <div className="category-tabs">
      <button
        type="button"
        className={tabClass("all")}
        onClick={() => onSelect("all")}
      >
        Todo
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          className={tabClass(category._id)}
          onClick={() => onSelect(category._id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
