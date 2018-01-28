const E1 = require("./e1")

class TreeElement{
	constructor(){
		this.init = this.init
		this.update = this.update
		this.treeData = window.localStorage.getItem("treeData") ? JSON.parse(window.localStorage.getItem("treeData")) : {}
	}
	
	init(el){
		console.log("INO", el)
		this.treeData[el.getAttribute("component-id")] = {
			data: null,
			openDirs:[]
		}
		
		this.update(el)
	}
	
	renderDir(id, el, model, modelBase, openDirs, fileClick){
		el.innerHTML = ""
		
		var fileTemplate = `
			<div class="item-name"></div>
			<div class="context">
				<div class="context-toggler">
					<svg-icon type="circle"></svg-icon>
					<svg-icon type="circle"></svg-icon>
					<svg-icon type="circle"></svg-icon>
				</div>
				<div class="context-menu">
					<div class="context-menu-item">Delete</div>
					<div class="context-menu-item">Rename</div>
				</div>
			</div>
		`
		
		var dirTemplate = `
			<div class="item-container" model-base="${modelBase}">
				<div class="item-name"></div>
				<div class="context">
					<div class="context-toggler">
						<svg-icon type="circle"></svg-icon>
						<svg-icon type="circle"></svg-icon>
						<svg-icon type="circle"></svg-icon>
					</div>
					<div class="context-menu">
						<div class="context-menu-item">New file</div>
						<div class="context-menu-item">New folder</div>
						<div class="context-menu-item">Delete</div>
						<div class="context-menu-item">Rename</div>
					</div>
				</div>
			</div>
			<div class="children"></div>
		`
		
		var proccess = (children)=>{
			
			var container = document.createElement("div")
			container.className = "tree-container"
			
			if(children){
				children.forEach((child, key)=>{
					var thisModelBase = modelBase + "." + key
					var element = document.createElement("div")
					element.className = child.type
					
					if(child.type === "directory"){
						element.innerHTML = dirTemplate
						var childrenElement = element.querySelector(".children")
						var nameElement = element.querySelector(".item-name")
						nameElement.textContent = child.name
						
						if(openDirs.indexOf(thisModelBase) > -1){
							this.treeData[id].openDirs.push(thisModelBase)
							this.renderDir(id, childrenElement, child.children, thisModelBase, openDirs)
							childrenElement.classList.add("active")
						}
						
						nameElement.addEventListener("click", ()=>{
							console.log(this.treeData)
							
							if(openDirs.indexOf(thisModelBase) === -1){
								this.treeData[id].openDirs.push(thisModelBase)
								this.renderDir(id, childrenElement, child.children, thisModelBase, openDirs)
								childrenElement.classList.add("active")
							}else{
								this.treeData[id].openDirs.splice(openDirs.indexOf(thisModelBase), 1)
								childrenElement.classList.remove("active")
							}
							
							window.localStorage.setItem("treeData", JSON.stringify(this.treeData))
						})
						
						container.appendChild(element)
						
					}else{
						element.innerHTML = fileTemplate
						
						var nameElement = element.querySelector(".item-name")
						nameElement.classList.add(child.ext)
						nameElement.textContent = child.name
						nameElement.onclick = ()=>{
							var _fileClick = E1.getModel(null, fileClick)
							_fileClick(thisModelBase)
						}
						
						container.appendChild(element)
					}
				})
			}
			
			return container
		}
		
		el.appendChild(proccess(model))
		
		E1.scan(el)
		
	}
	
	update(el){
		var model = E1.getModel(el, "model")
		var modelBase = el.getAttribute("model")
		var fileClick = el.getAttribute("file-click")
		var id = el.getAttribute("component-id")
		
		this.treeData[id].fileClick = fileClick
		this.treeData[id].data = model
		
		var data = this.treeData[id]
		
		this.renderDir(id, el, model, modelBase, data.openDirs, data.fileClick)
	}
}

E1.registerComponent("tree-element", new TreeElement())