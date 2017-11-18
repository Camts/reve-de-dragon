app.directive("combatComp", function() {
	return {
		restrict : "A",
		replace : false,
		scope : true,
		templateUrl : "widget/combat-comp.html",

		link : function(scope, elt, attrs) {
			elt[0].setAttribute("class", "w-combat-comp");
			var show = false;

			scope.attrs = attrs;
			scope.combatComp = {
				label : attrs.label,
				caracNom : attrs.carac,
				compNom : attrs.combatComp
			};

			var arme = scope.perso.eqmt.arme;
			if (!arme[attrs.combatComp]) {
				arme[attrs.combatComp] = {
					nom : "",
					bonus : undefined,
					dt : undefined,
					dc : undefined,
					dp : undefined,
					res : undefined,
					enc : undefined
				};
			}
			scope.eqmt = arme[attrs.combatComp];

			scope.carac = service.carac[attrs.carac](scope.perso.carac);
			scope.caracs = [];
			var i, caracs = config.caracBase[attrs.carac];
			for (i = 0; i < caracs.length; i++) {
				scope.caracs.push({
					nom : caracs[i],
					label : i18n.carac[caracs[i]],
					val : 0
				});
			}

			scope.seuil = {};
			var onSeuilChange = function() {
				if (!show)
					return;
				var diff = scope.perso.combat.diff[attrs.type];
				if (diff == undefined)
					diff = 0;
				var b = isNaN(scope.eqmt.bonus) ? 0 : scope.eqmt.bonus;
				diff += scope.comp.val + b - scope.ihm.jet.malus;
				var normale = service.seuil.normale(scope.carac, diff);
				scope.seuil.norm = normale;
				scope.seuil.crit = service.seuil.critique(normale);
				scope.seuil.part = service.seuil.particuliere(normale);
				scope.seuil.sign = service.seuil.significative(normale);
				scope.seuil.total = service.seuil.echecTotal(normale);
				scope.diff = diff;
			};
			scope.$parent.$watch("perso.combat.diff." + attrs.type, onSeuilChange);
			scope.$parent.$watch("ihm.jet.malus", onSeuilChange);

			scope.stat = {};
			scope.computeStat = function() {
				scope.stat.init = service.combat.initText(scope.perso, scope.attrs.carac, scope.attrs.combatComp);
				var bd = Math.floor((isNaN(scope.eqmt.bonus) ? 0 : scope.eqmt.bonus) / 2);
				if (attrs.carac == "melee")
					bd += scope.$parent.service.carac.bonusDommages(scope.perso.carac);
				else if (attrs.carac == "lance")
					bd += Math.floor(scope.$parent.service.carac.bonusDommages(scope.perso.carac) / 2);
				scope.stat.dt = isNaN(scope.eqmt.dt) ? "" : scope.eqmt.dt + bd;
				scope.stat.dc = isNaN(scope.eqmt.dc) ? "" : scope.eqmt.dc + bd;
				scope.stat.dp = isNaN(scope.eqmt.dp) ? "" : scope.eqmt.dp + bd;
				if (scope.stat.dt > scope.stat.dc)
					scope.stat.max = scope.stat.dt > scope.stat.dp ? "t" : "p";
				else
					scope.stat.max = scope.stat.dc > scope.stat.dp ? "c" : "p";
				onSeuilChange();
			};
			scope.computeStat();

			scope.comp = scope.perso.comp[attrs.combatComp];
			var onCompChange = function() {
				show = scope.comp.val || scope.comp.val == 0;
				if (show) {
					elt[0].style.display = "";
					onSeuilChange();
				} else
					elt[0].style.display = "none";
				scope.stat.init = service.combat.initText(scope.perso, attrs.carac, attrs.combatComp);
				onSeuilChange();
			};
			onCompChange();
			scope.$parent.$watch("perso.comp." + attrs.combatComp + ".val", onCompChange);

			var onCaracChange = function() {
				scope.carac = service.carac[attrs.carac](scope.perso.carac);
				scope.stat.init = service.combat.initText(scope.perso, attrs.carac, attrs.combatComp);
				onSeuilChange();
			};
			onCaracChange();
			var base = config.caracBase[attrs.carac];
			for (var i = 0; i < base.length; i++)
				scope.$parent.$watch("perso.carac." + base[i] + ".val", onCaracChange);

			// Bonus dommage
			scope.$parent.$watch("perso.carac.taille.val", scope.computeStat);
			scope.$parent.$watch("perso.carac.force.val", scope.computeStat);
		}
	}
});
