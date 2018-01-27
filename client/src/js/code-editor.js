const E1 = require("./e1")
const FileService = require("./service-file")
const ace = require('brace')
const Range = ace.acequire('ace/range').Range
require('brace/mode/javascript')
require('brace/mode/css')
require('brace/mode/html')
require('brace/mode/json')
require('brace/mode/less')
require('brace/mode/scss')
require('brace/theme/twilight')
require("brace/ext/language_tools")
require("brace/ext/searchbox")

class CodeEditor{
	constructor(){
		this.init = this.init
		this.update = this.update
	}
	
	init(el){
		el.editor = ace.edit(el)
		el.editor.setOptions({
		    enableBasicAutocompletion: true
		})
		el.editor.setTheme('ace/theme/twilight')
		el.editor.getSession().setTabSize(4)
		el.editor.getSession().setUseSoftTabs(false)
		el.editor.getSession().setUseWrapMode(false)
		el.editor.getSession().on('change', (e) => {
			
			var file = E1.getModel(el, "file")
			
			if(file){
				file.content = el.editor.getValue()
				var codeupdate = E1.getModel(el, "codeupdate")
			
				if(codeupdate && typeof codeupdate === "function"){
					var controller = el.getAttribute("codeupdate").split(".")
					controller.pop()
					controller = E1.getModel(null, controller.join("."))
					codeupdate(controller, file, el)
				}
			}
		})
		
		el.editor.commands.addCommand({
		    name: 'selectLines',
		    bindKey: {win: 'Ctrl-i',  mac: 'Ctrl-i'},
		    exec: function(editor) {
		    	
		    	var ranges = el.editor.getSession().selection.getAllRanges()
		    	ranges[0].start.column = 0
		    	
		    	var endString = el.editor.getSession().getLine(ranges[0].end.row)
		    	ranges[0].end = {row: ranges[0].end.row, column: endString.length}
		    	
		    	el.editor.getSession().selection.setSelectionRange(ranges[0])
		    }
		})
		
		el.editor.commands.addCommand({
		    name: 'moveLinesUp',
		    bindKey: {win: 'Ctrl-Up',  mac: 'Ctrl-Up'},
		    exec: function(editor) {
		    	el.editor.moveLinesUp()
		    }
		})
		
		el.editor.commands.addCommand({
		    name: 'moveLinesDown',
		    bindKey: {win: 'Ctrl-Down',  mac: 'Ctrl-Down'},
		    exec: function(editor) {
		    	el.editor.moveLinesDown()
		    }
		})
		
		el.editor.commands.addCommand({
		    name: 'save',
		    bindKey: {win: 'Ctrl-s',  mac: 'Ctrl-s'},
		    exec: function() {
		    	var file = E1.getModel(el, "file")
		
				if(file){
		    		FileService.saveFile(file, el.editor.getValue())
				}
		    }
		})
		
		el.addEventListener("keydown", (e)=>{
			
			if(e.key === "s" && e.ctrlKey){
				e.preventDefault()
			}
		}, false)
		
		this.update(el)
	}
	
	setType(el, file){
		var type = false
		switch (file.ext) {
			case 'js':
				type = 'javascript'
				break
				
			case 'css':
				type = 'css'
				break
				
			case 'sass':
				type = 'scss'
				break
				
			case 'html':
				type = 'html'
				break
				
			case 'json':
				type = 'json'
				break
		}
		
		if(type){
			el.editor.getSession().setMode('ace/mode/'+type)
		}
	}
	
	update(el){
		var file = E1.getModel(el, "file")
		
		if(file){
			el.editor.setValue(file.content)
			this.setType(el, file)
		}
	}
}

E1.registerComponent("code-editor", new CodeEditor())