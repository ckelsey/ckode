const E1 = require("./e1")

class Directory{
	constructor(){
		E1.registerService("Directory", this)
		
		// E1.subscribe("@Directory.directory", (data)=>{
		// 	localStorage.setItem('directory', JSON.stringify(data))
		// })
		
		E1.setModel(null, "@Directory.directory", JSON.parse(localStorage.getItem('directory')), {})
		
		this.getDir = this.getDir
		
		this.getDir("")
	}
	
	openDir(path){
		// var model = E1.getModel(null, path)
		
		// if(model && model.path){
		// 	this.getDir(model.path)
		// }
	}

	getDir(path){
		var xhr = new XMLHttpRequest()
		
		xhr.onreadystatechange = () => {
			
			if (xhr.readyState === 4 && xhr.status === 200) {
				
				var data = JSON.parse(xhr.responseText)
				
				var processData = (children)=>{
					if(children){
						children = children.map((child)=>{
							var result = {
								size: child.size,
								name:child.name,
								path: child.path,
								type: child.type
							}
							
							if(child.children){
								result.children = processData(child.children)
							}
							
							if(child.extension){
								result.ext = child.extension.substr(1, child.extension.length - 1)
							}
							
							return result
						})
					}
					
					return children
				}
				
				var processedData = processData(data.children)
				
				console.log(processedData)
				
				E1.setModel(null, "@Directory.directory", processedData)
				
				// var results = {}
				
				
				
				// for(var d in data){
				// 	if(data[d]){
				// 		results[d.split(".").join("_")] = data[d]
				// 	}
				// }
				
				// path = path === "" ? "" : "." + (path.substr(1, path.length - 1).split("/").join(".children.")) + ".children"
				
				// console.log(path)
				
				// E1.setThis(window, "ckode.Directory.directory" + path, results)
				// var ds = E1.setModel(null, "@Directory.directory", E1.getModel(null, "@Directory.directory"))
				
				// console.log(ds)
			}
		}
		
		xhr.open('GET', 'http://localhost:1395/api/dir' + (path === "" ? "" : "?path=" + path), true)
		xhr.send()
	}
	
	rename(filePath){
		var file = E1.getModel(null, filePath)
		console.log(file)
	}
}


if(!window.ckode){window.ckode = {}}

window.ckode.Directory = new Directory()
module.exports = window.ckode.Directory