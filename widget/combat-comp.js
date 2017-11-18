"use strict";
// jshint esversion: 6

app.directive("combatComp", function() {
	return {
		restrict : "A",
		replace : true,
		scope : true,
		templateUrl : "widget/combat-comp.html",

		link : function(scope, elt, attrs) {
			elt[0].setAttribute("class", "w-combat-comp");
			scope.arme = attrs.combatComp;
			scope.type = attrs.type;
		}
	}
});
