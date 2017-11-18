service.compteur = {
	enduMax : function(perso) {
		return service.carac.enduMax(perso.carac) + defZero(perso.compteur.xpEndu);
	},
	stressToXP : function(compteur, jet) {
		var normale = service.seuil.normale(compteur.reve, 0);
		var out, stress = defZero(compteur.stress);
		if (jet <= service.seuil.critique(normale))
			out = Math.floor(1.5 * stress);
		else if (jet <= service.seuil.particuliere(normale))
			out = Math.floor(1 * stress);
		else if (jet <= service.seuil.significative(normale))
			out = Math.floor(0.75 * stress);
		else if (jet <= normale)
			out = Math.floor(0.5 * stress);
		else if (jet <= service.seuil.echecTotal(normale))
			out = Math.floor(0.2 * stress);
		else
			out = 0;
		return out;
	},
	fumer : function(scope, index) {
		var herbes = scope.perso.eqmt.herbe.lune;
		var msg = "Vous avez fumé une herbe à <span class='emphase'>+" + (index + 1) + "</span>";
		if (herbes[index] > 0) {
			herbes[index] = herbes[index] - 1;
			msg += ", il vous en reste <span class='emphase'>" + herbes[index] + "</span>";
		} else
			msg += " que l'on vous a donnée";
		msg += ".<br/>Votre rêve actuel passe de <span class='emphase'>" + scope.perso.compteur.reve
				+ "</span> à <span class='emphase'>";
		scope.perso.compteur.reve = scope.perso.compteur.reve + (index + 1);
		if (scope.perso.compteur.reve > scope.perso.carac.reve.val * 5)
			scope.perso.compteur.reve = scope.perso.carac.reve.val * 5;
		msg += scope.perso.compteur.reve + "</span>.<br/>";
		if (scope.perso.compteur.reve < scope.perso.carac.reve.val * 5)
			msg += "Vous êtes à <span class='emphase'>" + (scope.perso.carac.reve.val * 5 - scope.perso.compteur.reve)
					+ "</span> point de votre maximum.";
		else
			msg += "Vous avez atteint votre maximum."
		util.notify(msg);
	}
};