service.combat = {
	init : function(perso, carac, comp) {
		var eqmt = perso.eqmt.arme[comp];
		if (!eqmt)
			return;
		// carac/2 + comp + bonus - viePerdue
		var bonus = eqmt.bonus === undefined || isNaN(eqmt.bonus) ? 0 : eqmt.bonus;
		return Math.floor(service.carac[carac](perso.carac) / 2) + perso.comp[comp].val + bonus;
	},
	initText : function(perso, carac, comp) {
		var init = service.combat.init(perso, carac, comp);
		return init == 0 ? "1d6" : init < 0 ? "1d6" + init : "1d6+" + init;
	}
};