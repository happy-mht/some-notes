## async await的使用

![async](C:\Users\leqee\Desktop\async.png)

Vue —状态统一管理

Vuex

1. state——状态

   全局唯一

   module

2. getter

   获取状态

3. mutation

   修改状态操作，在Vue开发工具中可以追溯修改

4. action

   提交mutation

在 main.js 中引入 

```js
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	strict: true,    //严格模式只能有mutation修改状态
    state: {
    	count: 0,
	},
    mutations: {
        addCount(state, arg){state.count++},
    	minusCount(state,arg){state.count--}
	},
    actions: {
      addCount(store,arg){
                
      }
    },
    getters:{
    }
})
```

