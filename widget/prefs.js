app.directive("prefs", function() {
	return {
		restrict : "A",
		replace : false,
		scope : true,

		link : function(scope, elt, attrs) {
			elt[0].parentNode.classList.toggle("w-prefs-parent");
			var e = document.createElement("div");
			while (elt[0].firstChild)
				e.appendChild(elt[0].firstChild);
			elt[0].appendChild(e);
			e = document.createElement("img");
			e.setAttribute("class", "w-prefs-img");
			e.setAttribute("src", "img/preferences.png");
			elt[0].appendChild(e);
			elt[0].classList.toggle("w-prefs");
		}
	}
})