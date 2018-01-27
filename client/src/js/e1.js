class E1{
	constructor(){
		this.bindings = {}
		this.components = {}
		this.services = {}
		this.models = {}
		this.subscriptions = {}
		this.ids = []
		
		this.observer = new window.MutationObserver(
			(records) => {
				var components = Object.keys(this.components)
	
				var initElement = (componentName) => {
					if (this.nodeName && this.nodeName.toLowerCase() === componentName) {
						this.components[componentName]._initElement(this)
					}
				}
	
				records.forEach( (record) => {
					if (record.addedNodes.length) {
						for (var i = 0; i < record.addedNodes.length; i++) {
							var element = record.addedNodes[i]
							components.forEach(initElement.bind(element))
						}
					}
				})
			}
		)
		
		this.cleanHtml = this.cleanHtml
		this.generateId = this.generateId
		this.getModel = this.getModel
		this.getThis = this.getThis
		this.registerComponent = this.registerComponent
		this.registerElement = this.registerElement
		this.registerService = this.registerService
		this.scan = this.scan
		this.setModel = this.setModel
		this.setThis = this.setThis
		this.subscribe = this.subscribe
		
		this.registerService("window", window)
		
		if (window.document.readyState === 'complete') {
			this.observer.observe(window.document.body, {
				attributes: true,
				attributeOldValue: true,
				childList: true,
				subtree: true,
				characterData: true
			})
		
			this.scan(window.document.body)
		} else {
			window.document.addEventListener("DOMContentLoaded", () => {
				this.observer.observe(window.document.body, {
					attributes: true,
					attributeOldValue: true,
					childList: true,
					subtree: true,
					characterData: true
				})
		
				this.scan(window.document.body)
			});
		}
	}
	
	cleanHtml(html){
		return html ? html.toString()
			.replace(/<script[^>]*?>.*?<\/script>/gi, '')
			.replace(/<style[^>]*?>.*?<\/style>/gi, '')
			.replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '')
			: ""
	}
	
	generateId() {
		var generate = () => {
			var text = ""
			var possible = "abcdefghijklmnopqrstuvwxyz"

			for (var i = 0; i < 26; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length))
			}

			return text
		}

		var id = generate()

		while (this.ids.indexOf(id) > -1) {
			id = generate()
		}

		this.ids.push(id)

		return id
	}

	getModel(element, attribute, defaultValue) {
		var path

		if (!element && !attribute) {
			return defaultValue
		}

		if (element && attribute) {
			var _path = element.getAttribute(attribute)

			if (_path && _path.substring(0, 1) === "@") {

				path = _path.substring(1, _path.length)

			} else {

				try {
					_path = JSON.parse(_path)
				} catch (error) { }

				return _path ? _path : defaultValue
			}
		} else if (!element && attribute && attribute.substring(0, 1) === "@") {
			path = attribute.substring(1, attribute.length)
		}

		if (!path) {
			return defaultValue
		}

		return this.getThis(this.services, path, defaultValue)
	}

	getThis(el, path, emptyVal) {
		if (path && path.toString().split) {
			path = [el].concat(path.toString().split("."))
		} else {
			path = [el]
		}

		var result = path.reduce((accumulator, currentValue) => {
			if (accumulator === undefined) {
				return emptyVal
			}

			if (currentValue) {
				return accumulator[currentValue]
			} else {
				return accumulator
			}

		})

		if (result === undefined) {
			return emptyVal
		}

		return result
	}
	
	registerComponent(name, service) {
		this.components[name] = {
			service: service,
			_initElement: (el) => {
				if (this.components[name].registeredElements.indexOf(el) === -1) {
					this.components[name].registeredElements.push(el)
					el.setAttribute("component-id", this.generateId())
					el.onUpdate = () => {
						this.components[name].service.update(el)
					}
					this.registerElement(el)
					this.components[name].service.init(el)
				}
			},
			registeredElements: [],
			scan: (element) => {
				var existingElements = element.querySelectorAll(name)

				if (existingElements.length) {
					for (var i = 0; i < existingElements.length; i++) {
						this.components[name]._initElement(existingElements[i])
					}
				}
			}
		}

		if (window.document.readyState === 'complete') {
			this.components[name].scan(window.document.body)
		}
	}

	registerElement (el) {
		if (!el || !el.attributes) { return }

		var attributes = el.attributes

		for (var i = 0; i < attributes.length; i++) {
			var attributeValue = attributes[i].value

			if (attributeValue.substring(0, 1) === "@") {
				if (!this.bindings[attributeValue]) {
					this.bindings[attributeValue] = []
				}

				this.bindings[attributeValue].push(el)
			}
		}
	}
	
	registerService(name, service){
		this.services[name] = service
	}

	scan (element) {
		for (var c in this.components) {
			if (this.components[c]) {
				this.components[c].scan(element)
			}
		}
	}

	setModel(element, attribute, value) {
		var path

		if (!element && !attribute) {
			return false
		}

		if (element && attribute) {
			var _path = element.getAttribute(attribute)

			if (_path && _path.substring(0, 1) === "@") {
				path = _path.substring(1, _path.length)
			}
		} else if (!element && attribute && attribute.substring(0, 1) === "@") {
			path = attribute.substring(1, attribute.length)
		}

		if (!path) {
			return false
		}

		var clone = this.getThis(this.services, path)

		try { clone = JSON.parse(JSON.stringify(clone)) } catch (e) { }

		this.setThis(this.services, path, value)

		var newVal = this.getThis(this.services, path)

		var updated = clone

		try {
			if (typeof clone === "object" && typeof newVal === "object") {
				updated = Object.assign(clone, newVal)
			} else if (newVal) {
				updated = newVal
			}
		} catch (e) { }

		this.updateBindings("@" + path, updated)

		return newVal
	}

	setThis(el, path, val) {
		if (path) {
			path = [el].concat(path.split("."))
		} else {
			path = [el]
		}

		var result = path.reduce( (accumulator, currentValue) => {
			if (!accumulator) {
				accumulator = {}
			}

			if (!accumulator[currentValue]) {
				accumulator[currentValue] = {}
			}

			if (currentValue) {
				if (currentValue === path[path.length - 1]) {
					accumulator[currentValue] = val
				}

				return accumulator[currentValue]
			} else {
				accumulator[currentValue] = null
				return accumulator
			}
		})

		return result
	}

	subscribe(path, callback) {
		if (!this.subscriptions[path]) {
			this.subscriptions[path] = []
		}

		this.subscriptions[path].push(callback)
	}

	updateBindings (path, clone) {
		var elements = this.bindings[path]
		var subscribes = this.subscriptions[path]

		if (subscribes && subscribes.length) {
			subscribes.forEach((element) => {
				element(clone)
			});
		}

		if (elements && elements.length) {
			elements.forEach( (element, index) => {
				if(window.document.body.contains(element)){
					if (element.onUpdate && typeof element.onUpdate === "function") {
						element.onUpdate(path)
					}
				}else{
					this.bindings[path].splice(index, 1)
				}
			});
		}

		if (clone && typeof clone === "object") {
			for (var p in clone) {
				if (clone[p]) {
					this.updateBindings(path + "." + p, clone[p])
				}
			}
		}
	}
}

window.E1 = new E1()
module.exports = window.E1