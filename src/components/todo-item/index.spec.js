import React from 'react';
import TodoItem from './index.js';
import { shallow } from 'enzyme';

const setup = () => {
  // 模拟props
  const props = {
    todo: {
      id: 1,
      text: 'TEST',
      completed: false
    },
    deleteTodo: jest.fn()
  };

  const wrapper = shallow(<TodoItem {...props} />);

  return {
    props,
    wrapper
  }
}

describe('components', () => {
  describe('TodoItem', () => {
    it('should render correctly', () => {
      const { wrapper } = setup();

      expect(wrapper.find('input').length).toBe(1);
      expect(wrapper.find('span').length).toBe(1);
    })

    it('input onChange should call deleteTodo', () => {
      const { wrapper, props } = setup();
      
      wrapper.find('input').simulate('change');
      expect(props.deleteTodo).toBeCalledWith(1);
    })

    it('should render todo title ', () => {
      const { wrapper, props } = setup();

      expect(wrapper.find('.todo-title').text()).toBe(props.todo.text);
    })
  })
})