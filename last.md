## 开篇
目前越来越多的应用使用[react](https://facebook.github.io/react/)来进行界面UI开发，而与之配套的测试工具*react-addons-test-utils*用起来比较繁琐，写出来的测试代码也不易维护。
相比之下，Airbnb开源的react测试类库[Enzyme](https://github.com/airbnb/enzyme)提供了一套简洁强大的API，并通过jquery风格的方式进行dom处理，开发体验十分友好。不仅在开源社区有超高人气，同时也获得了react官方的推荐。

写测试光有测试类库还不够，我们还需要测试运行环境(test runner)、断言库(assertion library)、mock库(mock library)等等工具辅以支持。如果不想使用很多第三方包去完成这些的话，那么我想Facebook出品的测试框架[jest](https://facebook.github.io/jest/)会是一个比较好的选择。
jest是除了支持上述功能外，还包含**Snapshot Testing**、Instant Feedback等特性。

本文将以一个缩减版本的经典todo应用，来讲解如何使用enzyme+jest来测试react组件，[项目代码]()可在github上查看。

## 准备工作
假如你是对已有应用做测试的话，那么第一步将是环境配置安装。这里假设应用是以webpack来打包加载资源，那么集成工作将会非常简单。

除了下载npm包(enzyme、jest)之外，只需对package.json新增属性：

```json
"jest": {
	"moduleFileExtensions": [
	  "js",
	  "jsx"
	],
	"moduleNameMapper": {
	  "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
	  "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
	},
	"transform": {
	  "^.+\\.js$": "babel-jest"
	}
}

```
以上代码片段中，`moduleFileExtensions`代表支持加载的文件名，与webpack中resolve.extensions类似；`moduleNameMapper`代表需要mock处理掉的资源，比如样式文件等，这些东西不会影响到代码逻辑；如果应用还用到babel编译es6/7语法的话，那么我们还需加上`transform`处理（需要安装babel-jest）。      

新增字段后，我们还需要把script中的test脚本改为'jest'就大功告成了。

## TODO应用讲解
### 功能讲解
我们待实现的todo应用只包含两个功能, 新增todo以及删除todo。实现效果如下
![gif](http://img.alicdn.com/tfs/TB1g1jFPVXXXXbmXpXXXXXXXXXX-671-435.gif)

### UI测试
我们先来看看应用的主体结构是怎样的：
```javascript
render() {
    const { todos } = this.props;

    return (
      <div>
        <TodoCreator addTodo={this.addTodo}/>
        { todos.map((todo, i) => <TodoItem key={i} todo={todo} deleteTodo={this.deleteTodo}/>) }
      </div>
    )
}
```
不难发现，我们的应用其实就是两个组件构成的：`TodoCreator`，`TodoItem`。    
其中`TodoCreator`其实就是一个input而已，它的功能是监听用户按下Enter键，然后创建一个todo。
实现代码非常简单：
```javascript
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
```
在了解该组件的功能后，我们首先要明确需要测试的点有哪些：
1. 当用户按下`Enter`键的时候要能调用props中的`addTodo`方法
2. 如果用户没有输入值的话不允许创建
3. 创建完成后清除输入框

带着以上目的，我们开始写测试代码，首先我们在组件同级目录创建一个以`.spec.js`作为suffix的文件（`*.spec.js`、`*.test.js`作为suffix的文件可以被jest识别，当然你也可以指定测试目录`__tests__`）。

**Step1: 第一步引入相关包**

```javascript
import React from 'react';
import TodoCreator from './index.js';
import { shallow } from 'enzyme';
```
你可能已经注意到了我们引入了`shallow`方法，这个方法其实底层还是来源于react官方测试包*react-addons-test-utils*，它可以实现**浅渲染**。  
**浅渲染**也就是说它仅仅会渲染至虚拟dom，不会返回真实的dom节点。这个对测试性能有极大的提升。    
除了shallow之外，enzyme还有另外的两个渲染方法：`mount`及`render`。    
`mount`可以实现**Full Rendering**，比如说当我们需要对dom api交互或者你需要测试组件的整个生命周期（如`componentDidMount`）的时候，可以使用这个方法。需要注意的是，由于需要渲染成真实的dom节点，那么就需要测试环境中有DOM API支持。jest在内部使用了`jsdom`去模拟了DOM环境，所以我们就可以不用写一个`setup.js`文件去mock那些全局变量了！      
那`render`方法又是干什么用的呢？它可以帮助渲染出最终的html，我们可以利用这个html结构来进行分析处理。

**Step2: 开始写测试case**

我们的测试case是就是上文中讲到的三个测试点，在正式分解功能之前，我们要写一个`setup`方法用来渲染组件，因为每一个测试case都会用到它：

```javascript
const setup = () => {
  // 组件的props
  const props = {
    addTodo: jest.fn() // mock
  };

  const wrapper = shallow(<TodoCreator {...props} />);

  return {
    props,
    wrapper
  }
}
```
在`setup`方法中，我们模拟了`TodoCreator`组件所需要的`props`,并对`TodoCreator`进行**浅渲染**，函数最后返回了props，和渲染后的虚拟dom结构。   
接下来就是正式的case测试了。

**CASE1**: 当用户按下`Enter`键的时候要能调用props中的`addTodo`方法   

我们先来看下测试代码：
```javascript 
it('press enter key should call addTodo if text length greater than 0', () => {
  const { wrapper, props } = setup();
  // mock event object
  const mockEventObj = {
    key: 'Enter',
    target: {
      value: 'TEST'
    }
  };

  wrapper.find('input').simulate('keydown', mockEventObj);
  expect(props.addTodo).toBeCalled();
})
```
上述代码中，我们做了以下事情：
- 通过`enzyme`提供的jquery式的API`find`，我们找到了组件中的`input`节点。
- 通过`simulate`方法我们模拟了`onkeydown`事件，这里的keydown会映射到组件上的*onKeyDown*。
- 通过`jest`自带的断言API`expect`、`toBeCalled`，我们去判别通过props传递过来的`addTodo`函数是否被调用。

接下来我们执行`npm test`会看到命令行会输出测试成功消息`PASS`（本文只展示了部分代码）。
![pass](https://img.alicdn.com/tfs/TB1lRjfPVXXXXa_aXXXXXXXXXXX-690-420.png)

但我们总觉得好像少了点什么，至少我是这样认为的。因为我有点怀疑我们测试case的可靠性。 所以为了验证它，我们把用户的输入改为空，也即`target.value = ''`，然后再执行测试命令
![error](https://img.alicdn.com/tfs/TB14ZjiPVXXXXataXXXXXXXXXXX-730-420.png)

我们可以看到控制台报错。错误显示，输入`Enter`键后，`addTodo`方法并未被调用。而我们的代码中确实要value不为空才能新增todoItem。尽管报错，但我其实是高兴的，因为这样就证明我们之前的测试代码是对的（这种模式在写测试的时候很常见）。

**CASE2**: 如果用户没有输入值的话不允许创建

这一步其实我们在上述错误示例中已经提到，我们把`mockEventObj.target.value`的值置空，同时期望`addTodo`方法不被调用，所以它的断言语句是`expect(props.addTodo).not.toBeCalled()`。

**CASE3**: 创建完成后清除输入框     

同样是执行上述操作后（这个时候应该保证输入框有值），此时断言语句应该变为`expect(wrapper.find('input').text()).toBe('')`，看到这些熟悉的`find().text()`，是否找回了当年jquery开发的感觉：）。

这样的话，我们已经把TodoCreator的测试代码完成，来看看执行结果
![](https://img.alicdn.com/tfs/TB1XBbAPVXXXXciXFXXXXXXXXXX-730-420.png) 

完美！看到测试case全部通过简直是种享受:)。    
至此，我们的UI测试已经结束。虽然我们的`TodoItem`组件还没测试，但它的测试方式跟上述的`TodoCreator`组件毫无二致，我们可以依葫芦画瓢的完成。

### 应用state测试
react组件只是应用的一部分（UI），所以我们还需对整个应用的状态（state）进行测试。在这里我们使用[redux](https://github.com/reactjs/redux)来管理应用的state，使用它的之后状态管理代码非常便于写测试。如何你还对redux不了解话，可以参考官博的另一篇文章[Redux深入原理](http://mp.weixin.qq.com/s/N0azhPnjGoyyUcSUHeJz5w)。我们来看看我们todo应用的reducer是如何写的：

```javascript
import { ADD_TODO, DELETE_TODO } from '../constants'

const initialState = [
  {
    text: 'Todo',
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
```
我们看到上述`switch`中有三个分支：
- 默认返回的state是`initialState`对象
- 如果接受到type为`ADD_TODO`的action的话，state会`unshift`一个新todo对象（返回新的state）
- 如果接受到type为`DELETE_TODO`的action的话，state会删除对应id的todo对象（返回新的state）
针对上述的点，我们的测试case也可以分解为三块，在这里我们以其中的一处作为说明（具体代码请参考github项目）：

```javascript
// 引入todo reducer
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
})
```
这里我们测试的是初始化状态，我们希望返回的state是`initialState`。再次，我们执行`npm test`会“毫无惊喜”的看到case通过。为了让自己兴奋点，我们把初始化todo的`text`改为'Todo1'，我们再试一遍:
![](https://img.alicdn.com/tfs/TB1Lsa_PVXXXXc0apXXXXXXXXXX-730-624.png)  
我们高兴的看到我们的测试又case挂了：）。而且控制台还把期望结果和实际表现的不同之处都清楚的打印出来，这将极大的方便我们发现问题。

那新增todo怎么测试呢？
其是也一样，不过就是调用todo reducer的时候传递一个**type**为`ADD_TODO`的action罢了。  
测试case代码如下：
```javascript
it('should handle ADD_TODO', () => {
  // 本次初始state为空数组[]
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
```

删除todo也是如此，这里不做展开描述，依葫芦画瓢即可。
在这里，我们todo应用的UI+state测试就已经完成了。

## 后言
至此，我们的todo应用测试之旅已结束。我们利用了`jest`完美的测试环境和`enzyme`极简API完成了这项工作。  
需要特别强调的是，`jest`还有一个超棒的特性叫做`Snapshot Testing`，它通过两次测试的快照（JSON）来简化UI测试并且可以diff出两次快照的变化，目前它的功能越来越强大，我们甚至可以用`ject`单独完成测试工作。另外，`enzyme`只实现了基本的选择器功能，像CSS3选择器是不暂不支持的。  
总而言之，`jest`和`enzyme`是测试react应用的不二选择。

## 参考资料
- [Enzyme: JavaScript Testing utilities for React](https://medium.com/airbnb-engineering/enzyme-javascript-testing-utilities-for-react-a417e5e5090f#.z4exxwf0z)
- [How to Snapshot Test Everything in Your Redux App With Jest](https://hackernoon.com/how-to-snapshot-test-everything-in-your-redux-app-with-jest-fde305ebedea#.nd87jf9wd)
- [Jest官网](https://facebook.github.io/jest/)
- [enzyme](https://github.com/airbnb/enzyme)