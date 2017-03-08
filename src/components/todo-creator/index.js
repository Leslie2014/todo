import React from 'react';
// import './index.scss';

class TodoCreator extends React.Component {
  constructor(props) {
    super(props);

    this.onKeydownHandle = this.onKeydownHandle.bind(this);
  }
  onKeydownHandle(ev) {
    const { addTodo } = this.props;
    const value = ev.target.value;
    
    if (ev.key === 'Enter' && value) {
      addTodo(ev.target.value)
      ev.target.value = '';
    }
  }
  render() {
    const { todo } = this.props;
    
    return (
      <div>
        <input type="text" onKeyDown={this.onKeydownHandle} />
      </div>
    )
  }
}

export default TodoCreator;