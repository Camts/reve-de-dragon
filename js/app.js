"use strict";
// jshint esversion: 6

let app = angular.module("rdd", []);
// package for services sub-packages
let service = {};
// package for controllers constructors
let controle = {};

window.onerror = function(message, url, line, column, error) {
	alert(message + " " + url + " " + line + ":" + column);
	alert(error.stack);
};

function defZero(val) {
	return val ? val : 0;
}

app.directive("typeIntMin", function() {
	return {
		require : "ngModel",
		link : function(scope, element, attr, mCtrl) {
			mCtrl.$parsers.push(function(value) {
				let i, valid;
				if (typeof (value) == "string") {
					valid = value.match(/^-?[0-9]+$/) != null;
					i = valid ? parseInt(value) : undefined;
				} else if (typeof (value) == "number") {
					valid = true;
					i = value;
				} else if (value === undefined) {
					valid = true;
					i = undefined;
				}
				mCtrl.$setValidity("intMin", valid && i >= parseInt(attr.typeIntMin));
				return i;
			});
		}
	};
});

app.directive("typeIntMax", function() {
	return {
		require : "ngModel",
		link : function(scope, element, attr, mCtrl) {
			mCtrl.$parsers.push(function(value) {
				let i, valid;
				if (typeof (value) == "string") {
					valid = value.match(/^-?[0-9]+$/) != null;
					i = valid ? parseInt(value) : undefined;
				} else if (typeof (value) == "number") {
					valid = true;
					i = value;
				} else if (value === undefined) {
					valid = true;
					i = undefined;
				}
				mCtrl.$setValidity("intMax", valid && i <= parseInt(attr.typeIntMax));
				return i;
			});
		}
	};
});

app.directive("typeHeure", function() {
	return {
		require : "ngModel",
		link : function(scope, element, attr, mCtrl) {
			function myValidation(value) {
				let i, valid;
				if (typeof (value) == "string") {
					valid = value.match(/^-?[0-9]+$/) != null;
					i = valid ? parseInt(value) : undefined;
				} else if (typeof (value) == "number") {
					valid = true;
					i = value;
				} else if (value === undefined) {
					valid = false;
					i = undefined;
				}
				mCtrl.$setValidity("intMin", valid && i >= 1 && i <= 12);
				return i;
			}
			mCtrl.$parsers.push(myValidation);
		}
	};
});

let util = {
	rand : function(max) {
		return Math.ceil(Math.random() * max);
	},
	setNumberInputsWidth : function(node) {
		let inputs = node.querySelectorAll("input[maxlength]");
		for (let i = 0; i < inputs.length; i++) {
			let input = inputs[i];
			let width = input.maxLength * (input.clientHeight > 0 ? input.clientHeight - 3 : 14) / 2 + 5;
			if (input.type && input.type == "number")
				width += 10;
			input.style.width = width + "px";
		}
	},
	indexOf : function(a, e) {
		for (let i = 0; i < a.length; i++) {
			if (a[i] == e)
				return i;
		}
		return -1;
	},
	indexOfSameNodeName : function(a, e) {
		let out = 0, name = e.nodeName;
		for (let i = 0; i < a.length; i++) {
			if (a[i].nodeName == name)
				if (a[i] == e)
					return out;
				else
					out++;
		}
		return -1;
	},
	removeEmptyText : function(elt) {
		for (let i = elt.childNodes.length - 1; i >= 0; i--) {
			let child = elt.childNodes[i];
			if (child.nodeType == 3) { // text
				if (child.nodeValue.trim().length == 0)
					elt.removeChild(child);
			} else
				util.removeEmptyText(child);
		}
	},
	notify : function(msg) {
		let div = document.createElement("div");
		div.setAttribute("class", "notification");
		div.setAttribute("onclick", "this.parentNode.removeChild(this)");
		div.innerHTML = msg;
		let notifs = document.getElementById("notifications");
		notifs.insertBefore(div, notifs.firstChild);
	}
};

document.addEventListener("click", function(evt) {
	if (evt.target.nodeName == "INPUT") {
		evt.target.select();
	}
}, false);

setTimeout(function() {
	util.setNumberInputsWidth(document);
}, 3000);