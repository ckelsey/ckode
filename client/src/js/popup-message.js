const E1 = require("./e1")

/*
	attributes: [
		"active",
		"message",
		"icon",
		"type",
		"buttons"
	],
*/

class PopupMessage{
	constructor(){
		this.init = this.init
		this.update = this.update
	}

	init (el) {
		this.update(el)
	}

	update (el) {
		el.innerHTML = '<div class="popup"><div class="popup-component-wrapper"><div class="popup-component"><div class="popup-component-inner"><div class="message-icon"></div><div class="message"><div></div><div class="popup-buttons"></button></div></div></div></div></div>'

		var container = el.querySelector(".popup")
		var iconElement = el.querySelector(".message-icon")
		var messageElement = el.querySelector(".message div")
		var buttonsElement = el.querySelector(".popup-buttons")

		var icon = E1.getModel(el, "icon")
		var type = E1.getModel(el, "type")
		var message = E1.getModel(el, "message")
		var active = E1.getModel(el, "active")
		var buttons = E1.getModel(el, "buttons")

		if (active && active.toString() === "true") {
			container.classList.add("active")

			messageElement.innerHTML = "<div>" + E1.cleanHtml(message) + "</div>"
			iconElement.innerHTML = "<div>" + E1.cleanHtml(icon) + "</div>"
			iconElement.className = "message-icon" + (type ? " " + type : "")

			if (buttons && buttons.length) {
				buttonsElement.innerHTML = ""

				buttons.forEach(function (element) {
					buttonsElement.innerHTML = buttonsElement.innerHTML + '<button onclick="' + element.click + '">' + E1.cleanHtml(element.text) + '</button>'
				});
			} else {
				buttonsElement.innerHTML = '<button onclick="window.E1.setModel(null, \'' + el.getAttribute('active') + '\', false)">Ok</button>'
			}

		} else {
			container.classList.remove("active")
		}

	}
}

E1.registerComponent("popup-message", new PopupMessage())