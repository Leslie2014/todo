import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TodoCreator from '../components/todo-creator'
import TodoItem from '../components/todo-item'
import * as TodoActions from '../actions'
import './index.scss';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }
  addTodo(text) {
    const {actions} = this.props;
    
    actions.addTodo(text);
  }
  deleteTodo(id) {
    const {actions} = this.props;

    actions.deleteTodo(id);
  }
  render() {
    const { todos, actions } = this.props;

    return (
      <div className="todo-wrapper">
        <TodoCreator addTodo={this.addTodo}/>
        { 
          todos.map((todo, i) => (
            <TodoItem key={i} todo={todo} deleteTodo={this.deleteTodo}/>
            ))
          }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  todos: state.todos
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo)