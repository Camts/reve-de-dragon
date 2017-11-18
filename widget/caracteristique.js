"use strict";
// jshint esversion: 6

app.directive("caracteristique", function() {
	return {
		restrict : "A",
		replace : false,
		scope : true,
		templateUrl : "widget/caracteristique.html",

		link : function(scope, elt, attrs) {
			scope.nom = attrs.caracteristique;
			elt[0].setAttribute("class", "w-caracteristique");
			scope.label = i18n.carac[attrs.caracteristique];
			scope.m = function() {
				return scope.perso.carac[attrs.caracteristique];
			};
			scope.noXp = Carac.noXp.indexOf(attrs.caracteristique) != -1;
		}
	}
});