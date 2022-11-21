class Task {
  constructor({ id, name, completed, boardId }) {
    this.id = id;
    this.name = name;
    this.completed = completed;
    this.boardId = boardId;
  }

  onComplete = () => {
    this.completed = !this.completed;
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.classList.toggle("completed");
  };

  onDelete = () => {
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.remove();
  };
}

class BoardPessoal {
  constructor({ boardId, title, tasks }) {
    this.id = boardId;
    this.title = title;
    this.tasks =
      tasks.length > 0 ? tasks.map((t) => new Task({ ...t, boardId })) : [];
  }

  onAddTask = (newTaskName) => {
    const lastTaskId = this.tasks[this.tasks.length - 1]?.id || 0;
    const task = {
      id: lastTaskId + 1,
      name: newTaskName,
      completed: false,
    };
    this.tasks.push(task);

    const tasksContainer = document.querySelector(
      `[data-board-id="${this.id}"] .tasks`
    );
    const taskContainer = getTaskView(
      this.id,
      new Task({ ...task, boardId: this.id })
    );
    tasksContainer.appendChild(taskContainer);
  };

  onBoardTitleClick = () => {
    const newTitle = prompt("Novo titulo do board");
    this.title = newTitle;
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }
    const boardTitleElement = document.querySelector(
      `[data-board-id="${this.id}"] .board-title`
    );
    boardTitleElement.textContent = newTitle;
  };

  onDeleteBoard = () => {
    const boardContainer = document.querySelector(
      `[data-board-id="${this.id}"]`
    );
    boardContainer.remove();
  };

  onDuplicateBoard = () => {
    const boardsContainer = document.querySelector(".boards");
    const lastBoardId = boards[boards.length - 1].id;
    const newTitle = `${this.title} Copy`;
    const newTasks = this.tasks.map((t) => ({
      ...t,
      boardId: lastBoardId + 1,
    }));
    const newBoard = new BoardPessoal({
      boardId: lastBoardId + 1,
      title: newTitle,
      tasks: newTasks,
    });

    const boardContainer = getBoardView(newBoard);
    boardsContainer.appendChild(boardContainer);
    boards.push(newBoard);
  };
}

function onAddBoard(newBoardTitle) {
  const lastBoardId = boards[boards.length - 1]?.id || 0;
  const board = new BoardPessoal({
    boardId: lastBoardId + 1,
    title: newBoardTitle,
    tasks: [],
  });
  boards.push(board);

  const boardsContainer = document.querySelector(".boards");
  const boardContainer = getBoardView(board);
  boardsContainer.appendChild(boardContainer);
}

function onAddTask(boardId, newTaskName) {
  const board = boards.find((board) => board.id === Number(boardId));
  board.onAddTask(newTaskName);
}

function handleNewTaskInputKeypress(e) {
  if (e.key === "Enter") {
    onAddTask(e.target.dataset.boardId, e.target.value);
    e.target.value = "";
  }
}

function handleNewBoardInputKeypress(e) {
  if (e.key === "Enter") {
    onAddBoard(e.target.value);
    e.target.value = "";
  }
}

function getTaskView(boardId, task) {
  const taskContainer = document.createElement("li");
  taskContainer.classList.add("task");
  taskContainer.dataset.taskId = task.id;
  taskContainer.dataset.boardId = boardId;
  if (task.completed) {
    taskContainer.classList.add("completed");
  }

  const taskCheckbox = document.createElement("input");
  taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
  taskCheckbox.classList.add("checkbox");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = task.completed;
  taskCheckbox.addEventListener("click", () => task.onComplete());
  taskContainer.appendChild(taskCheckbox);

  const taskName = document.createElement("label");
  taskName.classList.add("task-name");
  taskName.textContent = task.name;
  taskName.htmlFor = taskCheckbox.id;
  taskContainer.appendChild(taskName);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => task.onDelete());
  taskContainer.appendChild(deleteButton);

  return taskContainer;
}

function getBoardView(board) {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board");
  boardContainer.dataset.boardId = board.id;

  const htmlRow = document.createElement("div");
  htmlRow.classList.add("row");

  const duplicateButton = document.createElement("button");
  duplicateButton.classList.add("duplicate-button");
  duplicateButton.textContent = "Duplicate board";
  duplicateButton.addEventListener("click", () => board.onDuplicateBoard());
  htmlRow.appendChild(duplicateButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => board.onDeleteBoard());
  htmlRow.appendChild(deleteButton);

  boardContainer.appendChild(htmlRow);

  const boardTitle = document.createElement("p");
  boardTitle.classList.add("board-title");
  boardTitle.textContent = board.title;
  boardTitle.addEventListener("click", () => board.onBoardTitleClick());
  boardContainer.appendChild(boardTitle);

  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks");
  boardContainer.appendChild(tasksContainer);

  board.tasks.forEach((task) => {
    const taskContainer = getTaskView(board.id, task);
    tasksContainer.appendChild(taskContainer);
  });

  const newTaskInput = document.createElement("input");
  newTaskInput.dataset.boardId = board.id;
  newTaskInput.classList.add("new-task-input");
  newTaskInput.type = "text";
  newTaskInput.placeholder = "Nova tarefa";
  newTaskInput.addEventListener("keypress", handleNewTaskInputKeypress);
  boardContainer.appendChild(newTaskInput);

  return boardContainer;
}

const boardPessoal = {
  boardId: 1,
  title: "Title",
  tasks: [
    { id: 1, name: "tarefa 1", completed: false },
    { id: 2, name: "tarefa 2", completed: false },
    { id: 3, name: "tarefa 3", completed: true },
    { id: 4, name: "tarefa 4", completed: false },
    { id: 5, name: "tarefa 5", completed: true },
  ],
};

let boards = [new BoardPessoal({ ...boardPessoal })];

function renderizarBoards(boards) {
  const boardsContainer = document.querySelector(".boards");

  boards.forEach((board) => {
    const boardContainer = getBoardView(board);

    boardsContainer.appendChild(boardContainer);
  });
}
renderizarBoards(boards);

const newBoardInput = document.querySelector(".new-board-input");
newBoardInput.addEventListener("keypress", handleNewBoardInputKeypress);
