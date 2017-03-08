import React from 'react';
import TodoCreator from './index.js';
import { shallow } from 'enzyme';

const setup = () => {
  // 模拟props
  const props = {
    addTodo: jest.fn()
  };

  const wrapper = shallow(<TodoCreator {...props} />);

  return {
    props,
    wrapper
  }
}

describe('components', () => {
  describe('TodoCreator', () => {
    // it('shuold render create input', () => {
    //   const { wrapper } = setup();

    //   expect(wrapper.find('input').length).toBe(1);
    // })

    it('press enter key should call addTodo if text length greater than 0', () => {
      const { wrapper, props } = setup();
      const mockEventObj = {
        key: 'Enter',
        target: {
          value: 'TEST'
        }
      };

      wrapper.find('input').simulate('keydown', mockEventObj);
      expect(props.addTodo).toBeCalled();
    })

    // it('prevent addTodo if input empty', () => {
    //   const { wrapper, props } = setup();
    //   const mockEventObj = {
    //     key: 'Enter',
    //     target: {
    //       value: ''
    //     }
    //   };

    //   wrapper.find('input').simulate('keydown', mockEventObj);
    //   expect(props.addTodo).not.toBeCalled();
    // })

    // it('clear input after addTodo', () => {
    //   const { wrapper, props } = setup();
    //   const mockEventObj = {
    //     key: 'Enter',
    //     target: {
    //       value: 'TEST'
    //     }
    //   };

    //   wrapper.find('input').simulate('keydown', mockEventObj);
    //   expect(wrapper.find('input').text()).toBe('');
    // })
  })
})