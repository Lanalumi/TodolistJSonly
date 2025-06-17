const getCategories = async () => {
  const response = await fetch("http://localhost:3000/categorias");
  const categories = await response.json();
  console.log(categories);
  return categories;
};

const loadCategories = async () => {
  const categories = await getCategories();
  const categoriesElement = document.querySelector("#categories");
  console.log(categoriesElement);

  categories.forEach((category) => {
    const categoryElement = document.createElement("li");
    categoryElement.innerHTML = `
    <input type="text" value=${category.title} class="category-title">
    <div class="category-status">0/0</div>`;
    const activeClass = category.active ? " active" : "";
    categoryElement.classList.add(`category${activeClass}`);
    categoryElement.addEventListener("click", () => {
      const allCategories = document.querySelectorAll(".category");
      allCategories.forEach((bt) => {
        bt.classList.remove("active");
        categoryElement.classList.add("active");
      });
    });

    categoriesElement.appendChild(categoryElement);
  });
};

const init = () => {
  loadCategories();
};

init();
