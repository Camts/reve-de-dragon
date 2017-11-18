"use strict";
// jshint esversion: 6

class CombatDiff {
	constructor(perso, data) {
		this[pPerso] = perso;
		this.att = data.att;
		this.dist = data.dist;
		this.def = data.def;
	}

	toData() {
		return {
			att : this.att,
			dist : this.dist,
			def : this.def
		};
	}

	get att() {
		return this[pAtt];
	}
	set att(val) {
		if (isNaN(val))
			val = 0;
		if (val === this[pAtt])
			return;
		this[pAtt] = val;
		let i, armes = this[pPerso].eqmt.arme;
		for (i in armes)
			if (armes[i].types.indexOf("att") != -1)
				armes[i].computeSeuils();
	}

	get dist() {
		return this[pDist];
	}
	set dist(val) {
		if (isNaN(val))
			val = 0;
		if (val === this[pDist])
			return;
		this[pDist] = val;
		let i, armes = this[pPerso].eqmt.arme;
		for (i in armes)
			if (armes[i].types.indexOf("dist") != -1)
				armes[i].computeSeuils();
	}

	get def() {
		return this[pDef];
	}
	set def(val) {
		if (isNaN(val))
			val = 0;
		if (val === this[pDef])
			return;
		this[pDef] = val;
		let i, armes = this[pPerso].eqmt.arme;
		for (i in armes)
			if (armes[i].types.indexOf("def") != -1)
				armes[i].computeSeuils();
	}
}