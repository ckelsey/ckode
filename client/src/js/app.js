const E1 = require("./e1")

class App{
	constructor(){
		this.activeTab = window.localStorage.getItem("tab") || "code"
		this.activateTab = this.activateTab
		
		E1.registerService("App", this)
	}
	
	activateTab(tab){
		E1.setModel(null, "@App.activeTab", tab)
		window.localStorage.setItem("tab", tab)
	}
}


if(!window.ckode){window.ckode = {}}

window.ckode.App = new App()
module.exports = window.ckode.App