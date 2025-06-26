const URL = "http://localhost:3000/";

let categories = [];
let activeCategory = {};

//busca categorias no json-server
const getCategories = async () => {
  const response = await fetch(`${URL}categorias?_embed=tarefas`);
  const categories = await response.json();

  return categories;
};

//cria e retorna o elemento de categoria
const createCategoryElement = (category) => {
  const categoryElement = document.createElement("li");
  const completedTasks = category.tarefas.filter(({ isChecked }) => isChecked);
  categoryElement.innerHTML = `
  <input type="text" value="${category.title || ""}" class="category-title">
  <div class="category-status">${completedTasks.length}/${
    category.tarefas.length
  }</div>`;

  if (category.active) {
    categoryElement.classList.add("active");
  }
  categoryElement.classList.add("category");

  categoryElement.addEventListener("click", () => {
    const allCategories = document.querySelectorAll(".category");
    allCategories.forEach((bt) => {
      bt.classList.remove("active");
      categoryElement.classList.add("active");
      activeCategory = category;
      loadTasks();
    });
  });

  return categoryElement;
};

const loadCategories = () => {
  const categoriesElement = document.querySelector("#categories");
  categoriesElement.innerHTML = "";
  categories.forEach((category) => {
    const categoryElement = createCategoryElement(category);
    // init();

    categoriesElement.appendChild(categoryElement);
  });
};

const loadTasks = async () => {
  const tasks = activeCategory.tarefas;
  const tasksElement = document.querySelector("#tasks");
  tasksElement.innerHTML = "";
  updateHeaderTitleElement();
  tasks?.forEach((task) => {
    const taskElement = createTaskElement(task);

    tasksElement.appendChild(taskElement);
  });
};

const createCategory = async () => {
  const createCategoryElement = document.querySelector("#form-create-category");
  createCategoryElement.addEventListener("submit", (e) => {
    e.preventDefault();
    postCategory;
  });
};

const createTask = async (activeCategory) => {
  const createTaskElement = document.querySelector("#create-task-button");
  createTaskElement.addEventListener("click", () =>
    postTask(activeCategory.id)
  );
};

const createTaskElement = (task) => {
  const taskElement = document.createElement("li");

  taskElement.innerHTML = `
    <input id="checkbox-${task.id}" type="checkbox" class="checkbox-hidden" ${
    task.isChecked ? "checked" : " "
  } >
    <label for="checkbox-${task.id}" class="task">
    <div class="checkbox">
    <span class="icon">
      <img src="./assets/icons/checked-icon.svg"
    </span>
    </div>
      <input id="text-${task.id}" class="task-name" type="text" value="${
    task.title || ""
  }" aria-label="título da categoria">

      <img src="./assets/icons/delete-task-icon.svg">
    </label>`;

  return taskElement;
};

const postCategory = async () => {
  const response = await fetch(URL + "categorias", {
    method: "POST",
    body: JSON.stringify({ title: "Clique para editar" }),
  });
  const data = await response.json();
  return data;
};

const updateHeaderTitleElement = () => {
  const taskHeaderElement = document.querySelector(".tasks-category");
  taskHeaderElement.innerHTML = activeCategory.title;
};

const postTask = async () => {
  const response = await fetch(URL + "tarefas", {
    method: "POST",
    body: JSON.stringify({ categoriaId: activeCategory.id }),
  });
  const data = await response.json();
  return data;
};

const init = async () => {
  //carrega informações iniciais
  categories = await getCategories();
  activeCategory = categories.find(({ active }) => active) || categories[0];

  //inicializando elementos
  loadCategories();
  loadTasks();

  createCategory();
  createTask(activeCategory);
};

init();
