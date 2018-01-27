const E1 = require("./e1")

/*

"model",
"not",
"greater",
"less",
"equals",
"content"
css-display

*/

class IfElement{
	constructor(){
		this.init = this.init
		this.update = this.update
		this.templates = {}
	}
	
	init(el){
		this.templates[el.getAttribute("component-id")] = el.innerHTML
		
		var content = E1.cleanHtml(E1.getModel(el, "content"))
		
		if(content){
			this.templates[el.getAttribute("component-id")] = content
			el.setAttribute("content", "")
		}
		
		var useCss = E1.getModel(el, "css-display")
		
		if(useCss + " " !== "true "){
			el.innerHTML = ""
		}
		
		this.update(el)
	}
	
	update(el){
		var model = E1.getModel(el, "model")
		var useCss = E1.getModel(el, "css-display")
		
		var self = this
		var negate = E1.getModel(el, "not", el.getAttribute("not"))
		var greater = E1.getModel(el, "greater", el.getAttribute("greater"))
		var less = E1.getModel(el, "less",el.getAttribute("less"))
		var equals = E1.getModel(el, "equals",el.getAttribute("equals"))
		var html = self.templates[el.getAttribute("component-id")]
		var show = false
		
		if(negate && negate !== "true" && negate !== true){
			negate = false
		}
		
		if(model || model === 0){
		
			if(!negate){
				if(greater){
					if(((isNaN(model) || isNaN(greater)) && model > greater) || (!isNaN(model) && !isNaN(greater) && parseFloat(model) > parseFloat(greater))){
						show = true
					}
				}
				
				if(less){
					if(((isNaN(model) || isNaN(less)) && model < less) || (!isNaN(model) && !isNaN(less) && parseFloat(model) < parseFloat(less))){
						show = true
					}
				}
				
				if(equals){
					if(model === equals || (!isNaN(model) && !isNaN(equals) && parseFloat(model) === parseFloat(equals)) || model + " " === equals + " "){
						show = true
					}
				}
				
				if(!greater && !less && !equals && model !== 0){
					show = true
				}
			}else {
				if(greater){
					if(((isNaN(model) || isNaN(greater)) && model < greater) || (!isNaN(model) && !isNaN(greater) && parseFloat(model) < parseFloat(greater))){
						show = true
					}
				}
				
				if(less){
					if(((isNaN(model) || isNaN(less)) && model > less) || (!isNaN(model) && !isNaN(less) && parseFloat(model) > parseFloat(less))){
						show = true
					}
				}
				
				if(equals){
					if(model !== equals){
						show = true
					}
				}
			}
		}else if(negate){
			show = true
		}
		
		if(!show){
			if(!useCss || useCss + " " !== "true "){
				return el.innerHTML = ""
			}
			
			el.style.display = "none"
		}else{
			if(!useCss || useCss + " " !== "true "){
				if(html !== el.innerHTML){
					return el.innerHTML = html
				}
			}
			
			el.style.removeProperty("display")
		}
	}
}

E1.registerComponent("if-element", new IfElement())