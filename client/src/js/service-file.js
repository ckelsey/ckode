const E1 = require("./e1")

class File{
	constructor(){
		E1.registerService("File", this)
		
		E1.subscribe("@File.files", (data)=>{
			localStorage.setItem('files', JSON.stringify(data))
		})
		
		var files = localStorage.getItem('files') ? localStorage.getItem('files') : "{}"
		
		E1.setModel(null, "@File.files", JSON.parse(files))
		
		this.openFile = this.openFile
		this.saveFile = this.saveFile
		this.updateCode = this.updateCode
		this.activeFile = Object.keys(this.files)[0]
		
		document.addEventListener('DOMContentLoaded', ()=>{
			this.activateFileByIndex()
		}, false)
	}
	
	updateCode(_this, file, el){
		
		for(var f in _this.files){
			if(_this.files[f] && _this.files[f].path === file.path){
				
				_this.files[f] = file
				
				localStorage.setItem('files', JSON.stringify(_this.files))
				
				var modified = file.content !== file.originalContent
				
				E1.setModel(null, "@File.files." + f + ".isModified", modified)
				break
			}
		}
	}
	
	closeFile(event, index, force){
		
		if(event){
			event.preventDefault()
			event.stopPropagation()
		}
		
		var file = this.files[index]
		
		if(file.content !== file.originalContent && !force){
			E1.setModel(null, "@App.popupMessage", {
				active: true,
				type: "warning",
				icon: "!",
				message: "Save or discard changes?",
				buttons: [{
					text: "save",
					click: "window.ckode.File.saveFileAndClose('"+index+"');E1.setModel(null, '@App.popupMessage.active', false)"
				},{
					text: "discard",
					click: "window.ckode.File.closeFile(null, '"+index+"', true);E1.setModel(null, '@App.popupMessage.active', false)"
				}]
			})
		}else{
			var keys = Object.keys(this.files)
			this.activeFile = keys.indexOf(index) > 0 ? keys[keys.indexOf(index) - 1] : keys[1] ? keys[1] : undefined
			
			delete this.files[index]
			
			E1.setModel(null, "@File.files", this.files)
			
			if(this.activeFile !== undefined){
				this.activateFileByIndex()
			}
			
		}
	}
	
	activateFileByIndex(){
		var filePages = document.querySelectorAll(".file-content")
			
		for(var i=0; i<filePages.length; i++){
			if(filePages[i].getAttribute("index") === this.activeFile){
				filePages[i].classList.add("active")
			}else{
				filePages[i].classList.remove("active")
			}
		}

		for(var f in this.files){
			E1.setModel(null, "@File.files." + f + ".active", f === this.activeFile ? "active" : "")
		}
	}
	
	activateFile(ev){
		var index = ev.target.getAttribute("index")
		
		if(index){
			this.activeFile = index
			this.activateFileByIndex()
		}
	}
	
	saveFileAndClose(index){
		return this.saveFile(this.files[index], true).then(()=>{
			this.closeFile(null, index)
		}, ()=>{
			console.log("err")
			this.closeFile(null, index)
		})
	}
	
	saveFile(file, dontReopen){
		
		return new Promise((resolve, reject)=>{
			var index
			
			for(var i in this.files){
				if(this.files[i] && this.files[i].path === file.path){
					index = i
					break
				}
			}
			
			file.originalContent = file.content
			E1.setModel(null, "@File.files." + index + ".isModified", false)
			
			console.log(file, this.files)
			
			var xhr = new XMLHttpRequest()
			
			xhr.onreadystatechange = () => {
				
				if (xhr.readyState === 4 && xhr.status === 200) {
					
					localStorage.setItem('files', JSON.stringify(this.files))
					
					if(dontReopen){
						return resolve()
					}else{
						return resolve(this.openFile("@File.files." + index))
					}
				}else if(xhr.readyState === 4 && xhr.status !== 200){
					reject()
				}
			}
			
			xhr.open('POST', 'http://localhost:1395/api/file', true)
			xhr.send(JSON.stringify({
				path: file.path,
				content: file.content
			}))
		})
	}
	
	openFile(el){
		var _this = window.ckode.File
		var file = E1.getModel(null, el)
		var fileIndex
		
		for(var i in _this.files){
			if(_this.files[i]){
				if(file.path === _this.files[i].path){
					E1.setModel(null, "@File.activeFile", i)
					fileIndex = i
					break
				}
			}
		}
		
		var xhr = new XMLHttpRequest()
		
		xhr.onreadystatechange = () => {
			
			if (xhr.readyState === 4 && xhr.status === 200) {
				
				var data = JSON.parse(xhr.responseText)
				var files = JSON.parse(localStorage.getItem('files') ? localStorage.getItem('files') : "{}")
				
				file.content = data
				file.originalContent = data
				file.lines = data.split('\n').map((el, i)=>{
					return i + 1
				})
				
				
				_this.files[btoa(file.path)] = file
				
				E1.setModel(null, "@File.files", _this.files)
				
				var keys = Object.keys(_this.files)
				var index = fileIndex !== undefined ? fileIndex : keys[keys.length - 1]
				_this.activeFile = index
				_this.activateFileByIndex()
			}
		}
		
		xhr.open('GET', 'http://localhost:1395/api/file?path=' + file.path, true)
		xhr.send()
	}
}


if(!window.ckode){window.ckode = {}}

window.ckode.File = new File()
module.exports = window.ckode.File