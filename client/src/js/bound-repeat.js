const E1 = require("./e1")

class BoundRepeat{
	constructor(){
		this.init = this.init
		this.update = this.update
		this.templates = {}
	}
	
	init(el){
		this.templates[el.getAttribute("component-id")] = el.innerHTML
    
    	el.innerHTML = ""
    
		this.update(el)
	}
	
	update(el){
		var model = E1.getModel(el, "model")
		
		el.innerHTML = ""
		
		var html = ""
		
		if(model && model.length){
			model.forEach((item, key)=>{
				html += this.templates[el.getAttribute("component-id")].split(el.getAttribute("delimiter")).join(key)
			})
		}else if(model && typeof model === "object"){
			for(var key in model){
				if(model[key]){
					html += this.templates[el.getAttribute("component-id")].split(el.getAttribute("delimiter")).join(key)
				}
			}
		}
		
		el.innerHTML = html
		
		E1.scan(el)
	}
}

E1.registerComponent("bound-repeat", new BoundRepeat())