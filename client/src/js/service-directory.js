const E1 = require("./e1")

class Directory{
	constructor(){
		E1.registerService("Directory", this)
		
		E1.subscribe("@Directory.directory", (data)=>{
			localStorage.setItem('directory', JSON.stringify(data))
		})
		
		E1.setModel(null, "@Directory.directory", JSON.parse(localStorage.getItem('directory')), {})
		
		this.getDir = this.getDir
		
		this.getDir("")
	}

	getDir(path){
		var xhr = new XMLHttpRequest()
		
		xhr.onreadystatechange = () => {
			
			if (xhr.readyState === 4 && xhr.status === 200) {
				
				var data = JSON.parse(xhr.responseText)
				var results = {}
				
				for(var d in data){
					if(data[d]){
						results[d.split(".").join("_")] = data[d]
					}
				}
				
				E1.setModel(null, "@Directory.directory", results)
			}
		}
		
		xhr.open('GET', 'http://localhost:1395/api/dir' + path, true)
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