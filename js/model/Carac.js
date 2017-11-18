"use strict";
// jshint esversion: 6

class Carac {
	constructor(perso, nom, data, isModele) {
		if (!data)
			data = {val : 6};
		this[pPerso] = perso;
		perso.carac[nom].val = data.val;
		this.isModele = isModele;
		this.nom = nom;
		this.noXp = Carac.noXp.indexOf(nom) != -1 || Carac.base[nom];
		this.hasFT = Carac.hasFT.indexOf(nom) != -1;
		this.hasFR = Carac.hasFR.indexOf(nom) != -1;
		this.val = data.val;
		if (!this.noXp) {
			this.xp = data.xp;
			this.arch = data.arch;
		}
		if (isModele)
			this.max = data.max !== undefined && data.max > this.val ? data.max : this.val;
	}

	toData() {
		let out = {
			val : this.val,
			xp : this.xp,
			arch : this.arch
		};
		if (this.isModele)
			out.max = this.max;
		return out;
	}

	get val() {
		return this[pVal];
	}
	set val(val) {
		if (val === undefined)
			val = 6;
		if (val === this[pVal])
			return;
		this[pVal] = val;
		if (this.max !== undefined && this.max < this[pVal])
			this.max = this[pVal];

		if (!this.noXp) {
			this.xpToUp = Carac.xpToUpFrom(val);
		}
		this.title = "";
		if (this.hasFT) {
			this.ft = Carac.facteurTemps[val];
			this.title += "FT : " + this.ft;
		}
		if (this.hasFR) {
			this.fr = Carac.facteurResistance[val];
			if (this.title)
				this.title += ", ";
			this.title += "FR : " + this.fr;
		}

		if (this.nom == "force" || this.nom == "agilite") {
			this[pPerso].carac.melee = Math.floor((this[pPerso].carac.force.val + this[pPerso].carac.agilite.val) / 2);
			let i;
			for (i in this[pPerso].eqmt.arme) {
				let arme = this[pPerso].eqmt.arme[i];
				if (arme.carac == "melee") {
					arme.computeSeuils();
					arme.computeInit();
				}
			}
		}
		if (this.nom == "dexterite" || this.nom == "vue") {
			this[pPerso].carac.tir = Math.floor((this[pPerso].carac.dexterite.val + this[pPerso].carac.vue.val) / 2);
			let i;
			for (i in this[pPerso].eqmt.arme) {
				let arme = this[pPerso].eqmt.arme[i];
				if (arme.carac == "tir") {
					arme.computeSeuils();
					arme.computeInit();
				}
			}
		}
		if (this.nom == "force" || this.nom == "dexterite" || this.nom == "vue") {
			this[pPerso].carac.lance = Math.floor((this[pPerso].carac.force.val + this[pPerso].carac.tir) / 2);
			let i;
			for (i in this[pPerso].eqmt.arme) {
				let arme = this[pPerso].eqmt.arme[i];
				if (arme.carac == "lance") {
					arme.computeSeuils();
					arme.computeInit();
				}
			}
		}
		if (this.nom == "taille" || this.nom == "agilite") {
			this[pPerso].carac.derobee = Math.floor((21 - this[pPerso].carac.taille.val + this[pPerso].carac.agilite.val) / 2);
			let i;
			for (i in this[pPerso].eqmt.arme) {
				let arme = this[pPerso].eqmt.arme[i];
				if (arme.carac == "derobee") {
					arme.computeSeuils();
					arme.computeInit();
				}
			}
		}
		if (this.nom == "taille" || this.nom == "constitution") {
			this[pPerso].carac.vieMax = Math.floor((this[pPerso].carac.taille.val + this[pPerso].carac.constitution.val) / 2);
		}
		if (this.nom == "taille" || this.nom == "constitution" || this.nom == "volonte") {
			let newVal = this[pPerso].carac.taille.val + Math.max(this[pPerso].carac.constitution.val, this[pPerso].carac.volonte.val);
			let diff = newVal - this[pPerso].carac.enduMax;
			this[pPerso].carac.enduMax = newVal;
			this[pPerso].compteur.enduMax += diff;
			this[pPerso].compteur.enduLimite += diff;
			this[pPerso].compteur.endu += diff;
		}
		if (this.nom == "taille" || this.nom == "force") {
			this[pPerso].carac.bonusDommages = Carac.bonusDommages[this[pPerso].carac.taille.val - 6][this[pPerso].carac.force.val - 6];
			let i;
			for (i in this[pPerso].eqmt.arme) {
				let arme = this[pPerso].eqmt.arme[i];
				if (arme.constructor.name == "Arme") {
					arme.dtTotal = arme.computeDTotal(arme.dt);
					arme.dcTotal = arme.computeDTotal(arme.dc);
					arme.dpTotal = arme.computeDTotal(arme.dp);
				}
			}
		}
		if (this.nom == "taille" || this.nom == "agilite") {
			this[pPerso].carac.vitesse = this[pPerso].carac.taille.val + this[pPerso].carac.agilite.val;
		}
	}

	get xp() {
		return this[pXp];
	}
	set xp(xp) {
		if (xp === this[pXp])
			return;
		if (xp && xp >= this.xpToUp) {
			xp -= this.xpToUp;
			this[pXp] = 0;
			this.val ++;
			this.xp = xp;
		} else
			this[pXp] = xp == 0 ? undefined : xp;
	}
	get xpIhm() {
		return this[pXp] == 0 ? undefined : this[pXp];
	}
	set xpIhm(val) {
		this.xp = val;
	}

	get max() {
		return this[pMax];
	}
	set max(max) {
		if (max === this[pMax] || max < this[pVal])
			return;
		this[pMax] = max;
	}
}

Carac.noms = ["taille", "apparence", "constitution", "force", "agilite", "dexterite", "vue", "ouie", "odorat", "gout", "volonte", "intellect", "empathie", "eloquence", "reve", "chance"];

Carac.bonusDommages /* [taille - 6][force - 6] */ = [
	/* 6 */[0, 0, 0, 0],
	/* 7 */[0, 0, 0, 0, 0],
	/* 8 */[0, 0, 0, 0, 0, 0, 0],
	/* 9 */[0, 0, 0, 0, 0, 0, 0, 1],
	/* 10 */[0, 0, 0, 0, 0, 0, 1, 1, 1, 2],
	/* 11 */[0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2],
	/* 12 */[0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4],
	/* 13 */[0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6],
	/* 14 */[0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8],
	/* 15 */[0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9],
	/* 16 */[0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10],
	/* 17 */[0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10]];

Carac.hasFT = ["constitution", "force", "agilite", "dexterite", "intellect"];
Carac.facteurTemps = [null, null, null, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0.5, 0.5];

Carac.hasFR = ["constitution", "force"];
Carac.facteurResistance = [null, null, null, null, null, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6];

Carac.base = {
	melee : ["force", "agilite"],
	tir : ["dexterite", "vue"],
	lance : ["force", "dexterite", "vue"],
	derobee : ["taille", "agilite"],
	vieMax : ["taille", "constitution"],
	enduMax : ["taille", "constitution", "volonte"],
	vitesse : ["taille", "agilite"]
};

Carac.noXp = ["taille"];
Carac.xpToUpFrom = function(val) {
	if (val < 8)
		return 6;
	if (val < 10)
		return 7;
	if (val < 12)
		return 8;
	if (val < 14)
		return 9;
	if (val < 15)
		return 10;
	if (val < 16)
		return 20;
	if (val < 17)
		return 30;
	if (val < 18)
		return 40;
	if (val < 19)
		return 50;
	return 60;
};