class Model {
  constructor() {
    this.todos = [
      { id: 1, text: 'Run a marathon', complete: false },
      { id: 2, text: 'Learn MVC architecture', complete: false },
    ];
  }

  addTodo(todoText) {
    this.todos.push({
      id: this.todos ? this.todos.length + 1 : 1,
      text: todoText,
      complete: false,
    });
  }

  editTodo(id, updatedText) {
    this.todos.at(id - 1).text = updatedText;
  }

  deleteTodo(id) {
    this.todos.filter((todo) => todo.id !== id);
  }

  toggleTodo(id) {
    const todo = this.todos.at(id - 1);
    todo.complete = !todo.complete;
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());
