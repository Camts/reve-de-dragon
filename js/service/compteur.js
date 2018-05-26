"use strict";
// jshint esversion: 6

service.compteur = {
	stressToXP : function(compteur, jet) {
		let normale = service.seuil.normale(compteur.reve, 0);
		let out, stress = defZero(compteur.stress);
		if (jet <= service.seuil.critique(normale))
			out = Math.floor(1.5 * stress);
		else if (jet <= service.seuil.particuliere(normale))
			out = Math.floor(1 * stress);
		else if (jet <= service.seuil.significative(normale))
			out = Math.floor(0.75 * stress);
		else if (jet <= normale)
			out = Math.floor(0.5 * stress);
		else if (jet < service.seuil.echecTotal(normale))
			out = Math.floor(0.2 * stress);
		else
			out = 0;
		return out;
	},

	fumer : function(perso, index, resist) {
		let herbes = perso.eqmt.herbe.lune;
		let bonus = index + 1;
		let msg = "Vous avez fumé une herbe à <span class='emphase'>+" + bonus + "</span>";
		if (herbes[index] > 0) {
			herbes[index] = herbes[index] - 1;
			msg += ", il vous en reste <span class='emphase'>" + herbes[index] + "</span>";
		} else
			msg += " que l'on vous a donnée";
		if (resist) {
			msg += ".<br/>Vous avez résisté et ne gagnez aucun point de rêve actuel."
		} else {
			msg += ".<br/>Votre rêve actuel passe de <span class='emphase'>" + perso.compteur.reve
					+ "</span> à <span class='emphase'>";
			perso.compteur.reve = perso.compteur.reve + bonus;
			if (perso.compteur.reve > perso.carac.reve.val * 5)
				perso.compteur.reve = perso.carac.reve.val * 5;
			msg += perso.compteur.reve + "</span>.<br/>";
			if (perso.compteur.reve < perso.carac.reve.val * 5)
				msg += "Vous êtes à <span class='emphase'>" + (perso.carac.reve.val * 5 - perso.compteur.reve)
						+ "</span> point de votre maximum.";
			else
				msg += "Vous avez atteint votre maximum.";
		}
		msg += "<br/>Vous avez perdu <span class='emphase'>" + bonus + "</span> points d'endurance.";
		perso.compteur.perteEnduHorsBlessure += bonus;
		util.notify(msg);
	}
};