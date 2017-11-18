"use strict";
// jshint esversion: 6

service.competence = {
	computeUp : function(comp, xp) {
		let outComp = comp.val;
		let outXp = xp ? xp : 0, up = true;
		while (up) {
			let seuil = Comp.xpToUpFrom(outComp);
			if (outXp >= seuil) {
				outComp++;
				outXp -= seuil;
			} else
				up = false;
		}
		return [outXp != xp, outComp, outXp];
	},
	onXpChange : function(comp) {
		let up = service.competence.computeUp(comp, comp.xp);
		if (up[0]) {
			comp.val = up[1] == Comp.min[comp.type] ? undefined : up[1];
			comp.xp = up[2] && up[2] != 0 ? up[2] : undefined;
		}
	},
	emphaseArchetype : function(ihm, level) {
		if (ihm.archetype.emphase == level)
			ihm.archetype.emphase = undefined;
		else
			ihm.archetype.emphase = level;
	}
};