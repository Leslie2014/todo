import { ADD_TODO, DELETE_TODO } from '../constants'

const initialState = [
  {
    text: 'Todo1',
    completed: false,
    id: 0
  }
]

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          completed: false,
          text: action.text,
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
        },
        ...state
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      )

    default:
      return state
  }
}