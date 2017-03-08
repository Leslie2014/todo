import todos from './todos'
import * as types from '../constants'

describe('todos reducer', () => {
  it('should handle initial state', () => {
    // initial state test
    expect(
      todos(undefined, {})
    ).toEqual([
      {
        text: 'Todo',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle ADD_TODO', () => {
    expect(
      todos([], {
        type: types.ADD_TODO,
        text: 'Hello World'
      })
    ).toEqual([
      {
        text: 'Hello World',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle DELETE_TODO', () => {
    expect(
      todos([], {
        type: types.DELETE_TODO,
        id: 0
      })
    ).toEqual([])
  })
})