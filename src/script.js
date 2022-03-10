class Model {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  _generateId() {
    return crypto.randomUUID();
  }
  _getTodo(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  _commit(todos) {
    this.onTodoListChanged(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodo(todoText) {
    this.todos.push({
      id: this._generateId(),
      text: todoText,
      complete: false,
    });

    this._commit(this.todos);
  }

  editTodo(id, updatedText) {
    this._getTodo(id).text = updatedText;

    this._commit(this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this._commit(this.todos);
  }

  toggleTodo(id) {
    const todo = this._getTodo(id);
    todo.complete = !todo.complete;

    this._commit(this.todos);
  }

  bindTodoListChanged(callback) {
    this._commit = callback;
  }
}

class View {
  constructor() {
    this._temporaryTodoText = '';

    this.app = this.getElement('#root');

    this.title = this.createElement('h1');
    this.title.textContent = 'Todos';

    this.form = this.createElement('form');

    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add Todo';
    this.input.name = 'todo';

    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Submit';

    this.todoList = this.createElement('ul', 'todo-list');

    this.form.append(this.input, this.submitButton);

    this.app.append(this.title, this.form, this.todoList);

    this._initLocalListeners();
  }

  _initLocalListeners() {
    this.todoList.addEventListener('input', (event) => {
      if (event.target.className === 'editable') {
        this._temporaryTodoText = event.target.innerText;
      }
    });
  }

  _resetInput() {
    this.input.value = '';
  }

  get _todoText() {
    return this.input.value;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  displayTodos(todos) {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.lastChild);
    }

    if (todos.length === 0) {
      const p = this.createElement('p');
      p.textContent = 'Nothing to do! Yay!';
      this.todoList.append(p);
    } else {
      todos.forEach((todo) => {
        const li = this.createElement('li');
        li.id = todo.id;

        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.complete;

        const span = this.createElement('span');
        span.contentEditable = true;
        span.classList.add('editable');

        if (todo.complete) {
          const strikethrough = this.createElement('s');
          strikethrough.textContent = todo.text;
          span.append(strikethrough);
        } else {
          span.textContent = todo.text;
        }

        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = 'Delete';
        li.append(checkbox, span, deleteButton);

        this.todoList.append(li);
      });
    }
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.className === 'delete') {
        const id = event.target.parentElement.id;
        handler(id);
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', (event) => {
      if (event.target.type === 'checkbox') {
        const id = event.target.parentElement.id;

        handler(id);
      }
    });
  }

  //'focusout' to prevent re-rendering on every keystroke
  bindEditTodo(handler) {
    this.todoList.addEventListener('focusout', event => {
      if (this._temporaryTodoText) {
        const id = event.target.parentElement.id;
        handler(id, this._temporaryTodoText);
        this._temporaryTodoText = '';
      }
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onTodoListChanged(this.model.todos);
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    this.model.bindTodoListChanged(this.onTodoListChanged);
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText);
  };

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText);
  };

  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id);
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
  };
}

const app = new Controller(new Model(), new View());
