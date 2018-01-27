const E1 = require("./e1")

import io from 'socket.io-client'
var socket

class Terminal{
	constructor(){
		
		document.addEventListener('DOMContentLoaded', ()=>{
			E1.subscribe("@App.activeTab", (tab)=>{
				if(tab === "terminal"){
					var terminalInput = window.document.querySelector(".command-line-input-field")
					setTimeout(function(){
						terminalInput.focus()
					}, 10)
					console.log("FING")
				}
			})
			
			if(E1.getModel(null, "@App.activeTab") === "terminal"){
				var terminalInput = window.document.querySelector(".command-line-input-field")
				terminalInput.focus()
				console.log("focus")
			}
		}, false)
		
		E1.subscribe("@Terminal.history", (history)=>{
			localStorage.setItem('terminalHistory', this.history)
			this.goToBottom()
		})
		
		socket = io.connect('http://localhost:1396')
		socket.on('output', (data) => {
			data = data.replace('\n', '<br>')
			data = data.replace('\r', '<br>')
			E1.setModel(null, "@Terminal.history",this.history + '<br>' + data)
		})
		
		this.goToBottom()
		
		E1.registerService("Terminal", this)
		
		this.commandKeyup = this.commandKeyup
		this.history = null
		E1.setModel(null, "@Terminal.history", localStorage.getItem('terminalHistory') || "")
		this.commandHistory = localStorage.getItem('terminalCommandHistory') ? JSON.parse(localStorage.getItem('terminalCommandHistory')) : []
	}
	
	goToBottom(){
		setTimeout(function (params) {
			var out = document.querySelector('.command-line-output')
			
			if(out){
				out.scrollTop = out.scrollHeight
			}
			
		}, 100)
	}
	
	runCommand(value){
		this.commandHistory.push(value)
		localStorage.setItem('terminalCommandHistory', JSON.stringify(this.commandHistory))
		
		E1.setModel(null, "@Terminal.history",this.history + '<br><span class="history-command"><span class="history-command-text">&#8594;</span>' + value + '</span>')
		socket.emit('input', value)
		document.querySelector('.command-line-input-field').value = ''
	}
	
	commandKeyup(ev){
		if (ev.code === 'Enter') {
			ev.preventDefault()
			this.runCommand(ev.target.value)
		}
	}
}


if(!window.ckode){window.ckode = {}}
window.ckode.Terminal = new Terminal()
module.exports = window.ckode.Terminal