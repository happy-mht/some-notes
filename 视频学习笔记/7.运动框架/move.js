/**
* IIFE
* 1. 封装一个选择器，返回一个伪数组对象
* 2. 给原型添加一些操作伪数组的方法
* 3. 给原型扩展一个运动函数
*/

(function(){
	let pubArr = [],
	    push = pubArr.push,
	    forEach = pubArr.forEach;
	    
	function Select(query){
		// 使用new 才能返回一个伪数组对象
		return new Select.prototype.init(query);
	}

	// 将Select定义为一个伪数组对象
	Select.prototype = {
		lenght:0,
		splice:function(){},
		get:function(index){ // 返回的是一个DOM对象
			index = (index + this.length) % this.length
			return this[index] 
		},
		eq:function(index){
			return Select(this.get(index)) // 返回的是一个Select对象
		},
		each:function(callback){
			forEach.call(this,callback);
			return this; // 链式调用
		},
		extend:function(){
			if(arguments.length == 0) return
		    for(let i = 0, len = arguments.length; i < len; i++){
		    	let obj = arguments[i];
		    	for(let key in obj){
		    		if(obj.hasOwnProperty(key)){
		    			this[key] = obj[key]
		    		}
		    	}
		    }
		}
	}

	var init = Select.prototype.init = function(query){
		var doms;
		if(query.nodeName){
			doms = [query]
		}else if(query instanceof Array || 
			typeof query == 'Object' && query.length > 0 && (query.length -1 in query)){
			doms = query;
		}else{
			doms = document.querySelectorAll(query);
		}
		push.apply(this,doms);
	}
	Select.fn = init.prototype = Select.prototype;

	Select.fn.extend({

		/**
		* 带px单位的CSS动画函数
		*/
		moveTo:function(target){
			// 遍历Select对象中的DOM元素
			this.each(function(el){
				// 为每个DOM元素开一个定时器执行动画，先清除原来的定时器
				clearInterval(el.timer)
				el.timer = setInterval(function(){
					let flag = true; // 判断动画是否都已经完成
					let speed;
					// 遍历target对象
					for(let attr in target){

						// 获取DOM元素当前的属性值
						let cur = getComputedStyle(el)[attr]; // 这个带单位
						cur = parseInt(cur)
						let distance = target[attr] - cur;
						speed = distance > 0 ? Math.ceil(distance/8) : Math.floor(distance/8); // 缓冲效果
						if(distance != 0){
							flag = false;
							el.style[attr] = cur + speed + 'px';
						}
						if(flag){
							clearInterval(el.timer)
						}
					}
				}, 30)

			})
		},

		/**
		 * @description [淡入效果 控制 opacity 属性]
		 * @param  {number(ms)}
		 */
		/*fadeIn:function(time){
			// fadeIn opacity 0 -> 1

			// 经过 time ms 后显示 ,时间间隔为20ms, 那么 speed = 1/(time/20)
			// 先遍历Select 伪数组对象
			this.each(function(el){
				clearInterval(el.timer);
				var speed = 20 / time;
				el.timer = setInterval(function(){
					let cur = Number(getComputedStyle(el).opacity);
					if(cur < 1) {
						el.style.opacity = cur + speed
					}
					else {
						clearInterval(el.timer)
					}
				},20)
			})
		},
		fadeOut:function(time){
			this.each(function(el){
				clearInterval(el.timer);
				var speed = 20 / time;
				el.timer = setInterval(function(){
					let cur = Number(getComputedStyle(el).opacity);
					if(cur > 0) {
						el.style.opacity = cur - speed
					}
					else {
						clearInterval(el.timer)
					}
				},20)
			})
		}*/
	})

	Select.prototype.each({
		['fadeIn','fadeOut']
	},function(name,props){
		Select.fn[name] = function(time){
			this.each(function(el){
				clearInterval(el.timer);
				let speed = name == 'fadeIn' ?  20/time : -20/time;
				el.timer = setInterval(function(){
					let cur = parseFloat(getComputedStyle(el).opacity);
					if((name == 'fadeIn' && cur < 1) || (name=='fadeOut' && cur > 0)) {
						el.style.opacity  = cur + speed;
					}else{
						clearInterval(el.timer)
					}
				},20)
			})
		}
	})

	window._$ = Select;
})()
