Vue原理思路图

![vue源码实现思路图](E:\wuqi\23-React-第1天-{ 原理 }\4-源代码\vue源码实现思路图.png)


```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<div id="app"></div>
	<script type="text/javascript">
		// 存储配置，监听属性，更新视图
		class Observer{
			constructor(){
				this.observables = []
			}
			subscribe(){
				this.observables.push(Observer.target)
			}
			publish(){
				this.observables.forEach( item => item.update());
			}
		}
		Observer.target = null
		class Observable{
			constructor(el, data, propName){
				this.$$data = data;
				this.$$el = el;
				this.$$propName = propName
			}
			update(){
				this.$$el.nodeValue = this.$$data[this.$$propName]
			}
		}

		let observer = new Observer();
		class Vue{
			constructor(opts){
				//  存储配置
				this.$data = opts.data();
				console.log(this.$data)
				this.$el = document.querySelector(opts.el)
				this.$template = opts.template;

				// 监听属性
				this.defineReactive();

				// 编译模板
				let div = this.compile()
				this.$el.append(div)
			}
			defineReactive(){
				Object.keys(this.$data).forEach(key => {
					let value = this.$data[key]
					Object.defineProperty(this.$data, key, {
						get(){
							console.log('get触发了')
							// 订阅数据
							if(Observer.target){
								observer.subscribe()
							}
							Observer.target = null;
							return value
						},
						set(newV){
							console.log('set 触发了')
							// 更新视图
							value = newV;
							observer.publish()
						}
					})
				});
			}
			compileTextNode(dom, propName){
				// 编译text节点
				Observer.target = new Observable(dom, this.$data, propName)
				dom.nodeValue = this.$data[propName]
				console.dir('text节点视图更新')
				
			}
			compileInputNode(dom, directive, propName){
				console.log(arguments)
				dom.value = this.$data[propName]
				dom.addEventListener('input', e => {
					this.$data[propName] = e.target.value
				}, false)

			}
			compile(){
				let div = document.createElement('div')
				let textRegex = /\{\{(.*)\}\}/
				let directiveRegex = /^v-(.*)$/;
				div.innerHTML = this.$template
				let elems = div.children[0].childNodes
				Array.from(elems).forEach( el => {
					 
					if(el.nodeType == 3){
						//text
						let re = textRegex.exec(el.nodeValue)
						if(!re) return;
						this.compileTextNode(el, re[1])
					}else if(el.nodeType == 1){
						// input
						Array.from(el.attributes).forEach( attr => {
							console.dir(attr)
							let re = directiveRegex.exec(attr.nodeName)
							if(!re) return;
							this.compileInputNode(el, re[1], attr.nodeValue)
						});	
					}
				});
				return div
			}
		}
	</script>
	<script type="text/javascript">
		let mv = new Vue({
			el: '#app',
			data(){
				return {
					msg: 'dsa'
				}
			},
			template: `
				<div>
					<input v-model="msg">
					{{msg}}
				</div>
			`
		})
	</script>
</body>
</html>
```

