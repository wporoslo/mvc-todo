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
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  toggleTodo(id) {
    const todo = this.todos.at(id - 1);
    todo.complete = !todo.complete;
  }
}

class View {
  constructor() {
    this.app = this.getElement('#root');

    this.title = this.createElement('h1');
    this.title.textContext = 'Todos';

    this.form = this.createElement('form');

    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add Todo';
    this.input.name = 'todo';

    this.submitButton = this.createElement('button');
    this.submitButton.textContext = 'Submit';

    this.todoList = this.createElement('ul', 'todo-list');

    this.form.append(this.input, this.submitButton);

    this.app.append(this.title, this.form, this.todoList);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());
