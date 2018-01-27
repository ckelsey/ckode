const E1 = require("./e1")

/*
	attributes: [
		"content", // html string
		"tag"
	],
*/

class BoundElement{
	constructor(){
		this.init = this.init
		this.update = this.update
	}
	
	init(el){
		this.update(el)
	}
	
	update(el){
		if(el.hasAttribute("content") || el.hasAttribute("tag")){
			el.innerHTML = ""
		}
		
		var html = E1.cleanHtml(E1.getModel(el, "content", ""))
		var tag = E1.getModel(el, "tag")
		var attributes = null
		var attributeList = []
		
		Array.prototype.slice.call(el.attributes).forEach(function(item) {
			if (item.name.substring(0, 6) === "bound-") {
				if (!attributes) {
					attributes = []
				}
		
				attributes.push(item.name.substring(6, item.name.length) + '="' + E1.getModel(el, item.name, '') + '"')
		
				attributeList.push({name: item.name.substring(6, item.name.length), value: E1.getModel(el, item.name, '')})
			}
		});
		
		if (tag) {
			html = "<" + tag + (attributes ? " " + attributes.join(" ") : "") + ">" + html + "</" + tag + ">"
		}else if(attributeList.length){
			attributeList.forEach(function(attr){
				el.setAttribute(attr.name, attr.value)
			})
		}
		
		if(html){
			el.innerHTML = html
		}
		
		if(el.hasAttribute("bound-if")){
			var _if = E1.getModel(el, "bound-if")
			
			if(_if && _if !== "" && _if !== "false" && _if !== "undefined" && _if !== "null" && _if !== "0" && _if !== el.getAttribute("bound-if")){
				el.classList.remove("bound-hide")
				el.classList.add("bound-show")
			}else{
				el.classList.add("bound-hide")
				el.classList.remove("bound-show")
			}
		}
		
		if(el.hasAttribute("bound-if-not")){
			var _if = E1.getModel(el, "bound-if-not")
		
			if(_if && _if !== "" && _if !== "false" && _if !== "undefined" && _if !== "null" && _if !== "0" && _if !== el.getAttribute("bound-if-not")){
				el.classList.add("bound-hide")
				el.classList.remove("bound-show")
			}else{
				el.classList.remove("bound-hide")
				el.classList.add("bound-show")
			}
		}
		
		E1.scan(el)
	}
}

E1.registerComponent("bound-element", new BoundElement())