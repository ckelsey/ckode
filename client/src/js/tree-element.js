const E1 = require("./e1")

class TreeElement{
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
		var modelBase = el.getAttribute("model")
		var pathKey = E1.getModel(el, "path-key")
		var template = this.templates[el.getAttribute("component-id")]
		var html = ""
		
		if(model){
			var modelKeys = Object.keys(model)
			
			modelKeys.sort()
			
			modelKeys.forEach((key)=>{
				html += template.split(pathKey).join(modelBase + "." + key)
			})
		}
		
		el.innerHTML = html
		
		E1.scan(el)
	}
}

E1.registerComponent("tree-element", new TreeElement())