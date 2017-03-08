import React from 'react';

class TodoItem extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {
    const { todo, deleteTodo } = this.props;

    return (
      <div>
        <input type="checkbox" checked={todo.completed} onChange={() => deleteTodo(todo.id)} />
        <span className="todo-title">{todo.text}</span>
      </div>
    )
  }
}

export default TodoItem;