"use strict";
// jshint esversion: 6

app.directive("heure", function() {
	return {
		restrict : "A",
		replace : false,
		scope : {
			h : "=heure"
		},
		templateUrl : "widget/heure.html",

		link : function(scope, elt, attrs) {
			scope.nom = i18n.date.heure[scope.h - 1];
			scope.old = scope.h;
			scope.elt = elt[0];
			scope.elt.classList.toggle("w-heure");
			util.removeEmptyText(elt[0]);

			let h = scope.h;
			Object.defineProperty(scope, "h", {
				get : function() {
					return scope[pVal];
				},
				set : function(val) {
					if (val < 1 || val > 12)
						return;
					if (scope[pVal] === val)
						return;
					scope.nom = i18n.date.heure[val - 1];
					if (scope[pVal])
						scope.elt.classList.toggle("w-heure-" + scope[pVal]);
					scope.elt.classList.toggle("w-heure-" + val);
					scope[pVal] = val;
				}
			});
			scope.h = h;
		}
	}
});