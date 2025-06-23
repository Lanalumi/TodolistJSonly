const getCategories = async () => {
  const response = await fetch(
    "http://localhost:3000/categorias?_embed=tarefas"
  );
  const categories = await response.json();

  return categories;
};

const loadCategories = async () => {
  const categories = await getCategories();
  const categoriesElement = document.querySelector("#categories");
  categoriesElement.innerHTML = "";
  categories.forEach((category) => {
    const categoryElement = document.createElement("li");
    categoryElement.innerHTML = `
    <input type="text" value="${category.title || ""}" class="category-title">
    <div class="category-status">0/0</div>`;
    const activeClass = category.active ? "active" : "";
    if (category.active) {
      categoryElement.classList.add(activeClass);
    }
    categoryElement.classList.add("category");
    categoryElement.addEventListener("click", () => {
      const allCategories = document.querySelectorAll(".category");
      allCategories.forEach((bt) => {
        bt.classList.remove("active");
        categoryElement.classList.add("active");
      });
      // init();
    });

    categoriesElement.appendChild(categoryElement);
  });
  return categories;
};
const postCategory = async () => {
  const response = await fetch(
    "http://localhost:3000/categorias",
    { method: "POST" },
    { body: JSON.stringify({}) }
  );
  console.log(response);
};

const createCategory = async () => {
  const createCategoryElement = await document.querySelector(
    "#create-category-button"
  );
  createCategoryElement.addEventListener("click", postCategory);
};

const loadTasks = async (category) => {
  const tasks = category.tarefas;
  const tasksElement = document.querySelector("#tasks");

  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    checkboxElement.classList.add("task-status");
    checkboxElement.setAttribute("id", "checkbox-" + task.id);
    taskElement.innerHTML = `
    <label for="checkbox-${task.id}" class="label">
    <input class="task-name" type="text" value="${
      task.title || ""
    }" aria-label="título da categoria">

    <image src="./assets/icons/delete-task-icon.svg">
    </label>`;

    const checkedClass = task.checked ? " checked" : "";
    taskElement.classList.add(`task${checkedClass}`);
    checkboxElement.addEventListener("change", () => {});
    taskElement.prepend(checkboxElement);
    tasksElement.appendChild(taskElement);
  });
};

const postTask = async (categoryId) => {
  const response = await fetch("http://localhost:3000/tarefas", {
    method: "POST",
    body: JSON.stringify({ categoriaId: categoryId }),
  });
  const data = await response.json();
  return data;
};

const createTask = async (activeCategory) => {
  const createTaskElement = document.querySelector("#create-task-button");
  createTaskElement.addEventListener("click", () =>
    postTask(activeCategory.id)
  );
};

const init = async () => {
  const categories = await loadCategories();
  const activeCategory = categories.find((category) => category.active);
  createCategory();
  loadTasks(activeCategory);
  createTask(activeCategory);
};

init();
