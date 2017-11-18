service.carac = {
	melee : function(caracs) {
		return Math.floor((caracs.force.val + caracs.agilite.val) / 2);
	},
	tir : function(caracs) {
		return Math.floor((caracs.dexterite.val + caracs.vue.val) / 2);
	},
	lance : function(caracs) {
		return Math.floor((caracs.force.val + service.carac.tir(caracs)) / 2);
	},
	derobee : function(caracs) {
		return Math.floor((21 - caracs.taille.val + caracs.agilite.val) / 2);
	},
	vieMax : function(caracs) {
		return Math.floor((caracs.taille.val + caracs.constitution.val) / 2);
	},
	enduMax : function(caracs) {
		return caracs.taille.val + Math.max(caracs.constitution.val, caracs.volonte.val);
	},
	bonusDommages : function(caracs) {
		if (caracs.taille.val < 6 || caracs.force.val < 6)
			return 0;
		return config.caracBonusDommages[caracs.taille.val - 6][caracs.force.val - 6];
	},
	vitesse : function(caracs) {
		return caracs.taille.val + caracs.agilite.val;
	},
	xpToUpFrom : function(carac) {
		if (carac < 8)
			return 6;
		if (carac < 10)
			return 7;
		if (carac < 12)
			return 8;
		if (carac < 14)
			return 9;
		if (carac < 15)
			return 10;
		if (carac < 16)
			return 20;
		if (carac < 17)
			return 30;
		if (carac < 18)
			return 40;
		if (carac < 19)
			return 50;
		return 60;
	},
	onXpChange : function(carac) {
		var outCarac = carac.val, outXp = carac.xp, up = true;
		while (up) {
			var seuil = service.carac.xpToUpFrom(outCarac);
			if (outXp >= seuil) {
				outCarac++;
				outXp -= seuil;
			} else
				up = false;
		}
		if (outXp != carac.xp) {
			carac.val = outCarac;
			carac.xp = outXp == 0 ? undefined : outXp;
		}
	}
};