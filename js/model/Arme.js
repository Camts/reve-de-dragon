"use strict";
// jshint esversion: 6

class Arme {
	constructor(perso, eqmt, data) {
		this[pPerso] = perso;
		if (!data)
			data = Arme.defaultData;

		if (eqmt.endsWith("-d")) {
			this.comp = eqmt.substring(0, eqmt.length - 2);
			this.label = Comp.typeLabel[this.comp][1] + " droite";
		} else if (eqmt.endsWith("-g")) {
			this.comp = eqmt.substring(0, eqmt.length - 2);
			this.label = Comp.typeLabel[this.comp][1] + " gauche";
		} else {
			this.comp = eqmt;
			this.label = Comp.typeLabel[this.comp][1];
		}
		this.carac = Arme.comp2carac[this.comp];
		this.types = Arme.carac2types[this.carac];
		let i;
		for (i in this.types)
			this[this.types[i]] = Arme.defaultType;

		this.nom = data.nom;
		this.bonus = data.bonus;
		this.dt = data.dt;
		this.dc = data.dc;
		this.dp = data.dp;
		this.res = data.res;
		this.enc = data.enc;

		this.computeInit();
		if (this.comp == "corpsACorps" || this.comp == "esquive")
			this.computeSeuils();
	}

	toData() {
		if (this.nom != "" || this.bonus !== undefined || this.dt !== undefined || this.dc !== undefined || this.dp !== undefined || this.res !== undefined || this.enc !== undefined ) {
			return {
				nom : this.nom,
				bonus : this.bonus,
				dt : this.dt,
				dc : this.dc,
				dp : this.dp,
				res : this.res,
				enc : this.enc
			};
		}
	}

	get bonus() {
		return this[pBonus];
	}

	set bonus(val) {
		if (isNaN(val) || val < 0)
			val = undefined;
		if (val === this[pVal])
			return;
		this[pBonus] = val;
		this.computeSeuils();
		this.computeInit();
		this.dtTotal = this.computeDTotal(this.dt);
		this.dcTotal = this.computeDTotal(this.dc);
		this.dpTotal = this.computeDTotal(this.dp);
	}

	computeSeuils() {
		let i, comp = this[pPerso].comp[this.comp];
		if (this.comp != "corpsACorps" && this.comp != "esquive" && comp.val == Comp.min[comp.type]) {
			for (i in this.types)
				this[this.types[i]] = Arme.defaultType;
			return;
		}
		for (i in this.types) {
			let type = this.types[i];
			let diff = comp.val + defZero(this[pPerso].combat.diff[type]) + defZero(this.bonus) - this[pPerso].compteur.malus;
			let normale = service.seuil.normale(this[pPerso].carac[this.carac], diff);
			this[type] = {
				diff : diff,
				crit : service.seuil.critique(normale),
				part : service.seuil.particuliere(normale),
				sign : service.seuil.significative(normale),
				norm : normale,
				total : service.seuil.echecTotal(normale)
			};
		}
	}

	computeDTotal(val) {
		if (val == undefined)
			return undefined;
		let total = val;
		if (this.carac == "melee")
			total += this[pPerso].carac.bonusDommages;
		else if (this.carac == "lance")
			total += Math.floor(this[pPerso].carac.bonusDommages / 2);
		if (!isNaN(this.bonus))
			total += Math.floor(this.bonus / 2);
		return total;
	}

	get dt() {
		return this[pDt];
	}
	set dt(val) {
		if (isNaN(val) || val < 0)
			val = undefined;
		if (val === this[pDt])
			return;
		this[pDt] = val;
		this.dtTotal = this.computeDTotal(val);
		this.computeMax();
	}

	get dc() {
		return this[pDc];
	}
	set dc(val) {
		if (isNaN(val) || val < 0)
			val = undefined;
		if (val === this[pDc])
			return;
		this[pDc] = val;
		this.dcTotal = this.computeDTotal(val);
		this.computeMax();
	}

	get dp() {
		return this[pDp];
	}
	set dp(val) {
		if (isNaN(val) || val < 0)
			val = undefined;
		if (val === this[pDp])
			return;
		this[pDp] = val;
		this.dpTotal = this.computeDTotal(val);
		this.computeMax();
	}

	computeMax() {
		let maxVal = undefined, maxType = undefined;
		if (this.dt != undefined) {
			maxVal = this.dt;
			maxType = "t";
		}
		if (this.dc != undefined && (maxVal == undefined || this.dc > maxVal)) {
			maxVal = this.dc;
			maxType = "c";
		}
		if (this.dp != undefined && (maxVal == undefined || this.dp > maxVal)) {
			maxVal = this.dp;
			maxType = "p";
		}
		this.max = maxType;
	}

	computeInit() {
		// carac/2 + comp + bonus arme - malus global
		let init = Math.floor(this[pPerso].carac[this.carac] / 2) + this[pPerso].comp[this.comp].val + defZero(this.bonus) - this[pPerso].compteur.malus;
		this.init = init == 0 ? "1d6" : init < 0 ? "1d6" + init : "1d6+" + init;
	}
}

Arme.armes = ["epee1m-d", "epee1m-g", "epee2m", "hache1m-d", "hache1m-g", "hache2m", "masse1m-d", "masse1m-g", "masse2m", "fleaux", "dague-d", "dague-g", "corpsACorps", "bouclier", "arc", "arbalete", "dagueLancee", "hacheLancee", "esquive"];

Arme.defaultData = {
	nom : "",
	bonus : undefined,
	dt : undefined,
	dc : undefined,
	dp : undefined,
	res : undefined,
	enc : undefined
};

Arme.comp2carac = {
	// Mélée
	epee1m : "melee",
	epee2m : "melee",
	hache1m : "melee",
	hache2m : "melee",
	masse1m : "melee",
	masse2m : "melee",
	fleaux : "melee",
	dague : "melee",
	corpsACorps : "melee",
	bouclier : "melee",
	// Distance
	arc : "tir",
	arbalete : "tir",
	dagueLancee : "lance",
	hacheLancee : "lance",
	// Défense
	esquive : "derobee"
};

Arme.carac2types = {
	melee : ["att", "def"],
	tir : ["dist"],
	lance : ["dist"],
	derobee : ["def"]
};

Arme.defaultType = {
	diff : 0,
	crit : "",
	part : "",
	sign : "",
	norm : "",
	total : ""
}