"use strict";
// jshint esversion: 6

class Magie {
	constructor(data) {
		this.monte = data.monte;
		this.sorts = data.sorts;
		this.reserve = data.reserve;
		this.terreMediane = data.terreMediane;
	}

	toData() {
		return {
			sorts : this.sorts,
			monte : this.monte,
			reserve : this.reserve,
			terreMediane : this.terreMediane
		};
	}

	get terreMediane() {
		return this[pCase];
	}
	set terreMediane(val) {
		if (val === this[pCase])
			return;
		this[pCase] = val;
		this.terreMedianeTexte = Magie.terresMedianesTexte(val);
		let reserve = this.reserve[val];
		if (reserve) {
			this.reserve[val] = undefined;
			util.notify("Le sort en réserve <span class='emphase'>" + reserve + "</span> a été lancé.");
		}

		let col = val.charCodeAt(0) - "A".charCodeAt(0);
		let row = parseInt(val.substr(1)) - 1;
		this.voisines = [];
		let otherRow = col % 2 == 0 ? row - 1 : row + 1;
		let i, poss = [[col - 1, row], [col - 1, otherRow], [col, row - 1], [col, row + 1], [col + 1, row], [col + 1, otherRow]];
		for (i in poss) {
			col = poss[i][0];
			row = poss[i][1];
			if (col >= 0 && col <= 12 && row >= 0 && Magie.positionType[col][row] != undefined)
				this.voisines.push(String.fromCharCode(65 + col) + (row + 1));
		}
	}
}

Magie.positionType = [
	["CITE", "DESERT", "DESOLATION", "FORET", "PLAINES", "NECROPOLE", "PLAINES", "GOUFFRE", "COLLINES", "SANCTUAIRE", "DESOLATION", "PLAINES", "FLEUVE", "COLLINES", "CITE"],
	["PLAINES", "COLLINES", "PLAINES", "MONTS", "COLLINES", "FORET", "MARAIS", "FLEUVE", "LAC", "MONTS", "CITE", "FLEUVE", "GOUFFRE", "NECROPOLE"],
	["NECROPOLE", "MARAIS", "FLEUVE", "PONT", "MARAIS", "CITE", "FLEUVE", "FORET", "MONTS", "MARAIS", "PONT", "LAC", "DESERT", "FORET", "PLAINES"],
	["FLEUVE", "CITE", "GOUFFRE", "LAC", "FLEUVE", "FLEUVE", "PLAINES", "CITE", "PONT", "FLEUVE", "DESOLATION", "COLLINES", "CITE", "SANCTUAIRE"],
	["MONTS", "PLAINES", "FORET", "PLAINES", "MONTS", "SANCTUAIRE", "FORET", "PLAINES", "FLEUVE", "GOUFFRE", "LAC", "MONTS", "PLAINES", "MONTS", "FORET"],
	["CITE", "LAC", "FLEUVE", "FLEUVE", "CITE", "FLEUVE", "FLEUVE", "LAC", "PLAINES", "MARAIS", "CITE", "NECROPOLE", "FORET", "PLAINES"],
	["DESOLATION", "MARAIS", "GOUFFRE", "SANCTUAIRE", "PONT", "MARAIS", "CITE", "PLAINES", "DESERT", "CITE", "FLEUVE", "PLAINES", "PLAINES", "DESERT", "PLAINES"],
	["LAC", "COLLINES", "FORET", "PLAINES", "DESERT", "MONTS", "GOUFFRE", "FORET", "COLLINES", "PLAINES", "FLEUVE", "COLLINES", "DESOLATION", "PLAINES"],
	["PLAINES", "FORET", "MONTS", "PLAINES", "DESOLATION", "NECROPOLE", "PLAINES", "FLEUVE", "FLEUVE", "LAC", "PONT", "GOUFFRE", "MONTS", "CITE", "MONTS"],
	["MONTS", "DESERT", "CITE", "COLLINES", "MARAIS", "LAC", "FLEUVE", "MONTS", "MARAIS", "FLEUVE", "PLAINES", "CITE", "GOUFFRE", "DESERT"],
	["CITE", "FORET", "PLAINES", "PONT", "FLEUVE", "DESOLATION", "CITE", "DESERT", "SANCTUAIRE", "PLAINES", "CITE", "DESOLATION", "FORET", "NECROPOLE", "COLLINES"],
	["FLEUVE", "FLEUVE", "LAC", "SANCTUAIRE", "COLLINES", "FORET", "GOUFFRE", "MONTS", "COLLINES", "DESERT", "COLLINES", "PLAINES", "MONTS", "PLAINES"],
	["CITE", "NECROPOLE", "MONTS", "GOUFFRE", "CITE", "DESOLATION", "DESERT", "PLAINES", "NECROPOLE", "FORET", "CITE", "COLLINES", "PLAINES", "DESOLATION", "CITE"]
];

Magie.positionNom = [
	["VIDE", "de MIEUX", "de DEMAIN", "de FALCONAX", "de TRILKH", "de ZNIAK", "de l'ARC", "de SHOK", "de KORREX", "d'OLIS", "d'HIER", "SAGES", "", "de STOLIS", "de MIELH"],
	["d'ASSORH", "de DAWELL", "de RUBEGA", "CRÂNEURS", "de TANEGV", "de BUST", "BLUANTS", "", "de LUCRE", "SALÉS", "de BRILZ", "", "des LITIGES", "de GORLO"],
	["de KROAK", "GLIGNANTS", "", "de GIOLI", "FLOUANTS", "PAVOIS", "", "TURMIDE", "TUMÉFIÉS", "de DOM", "de ROI", "de FRICASA", "de NEIGE", "de BISSAM", "de TOUÉ"],
	["", "de FROST", "d'OKI", "de FOAM", "", "", "d'AFFA", "d'OLAK", "d'ORX", "", "de PARTOUT", "d'HUAÏ", "SORDIDE", "PLAT"],
	["de KANAÏ", "de FIASK", "d'ESTOUBH", "d'ORTI", "BRÛLANTS", "de PLAINE", "de GLUSKS", "d'IOLISE", "", "de JUNK", "de GLINSTER", "AJOURÉS", "de XNEZ", "de QUATH", "des FURIES"],
	["GLAUQUE", "de MISÈRE", "", "", "de PANOPLE", "", "", "des CHATS", "de FOE", "ZULTANTS", "de NOAPE", "de THROAT", "des CRIS", "BRISÉES"],
	["de JAMAIS", "NUISANTS", "de SUN", "BLANC", "d'IK", "GLUTANTS", "de TERWA", "SANS JOIE", "de SEL", "de SERGAL", "", "de LUFMIL", "CALCAIRES", "de SEK", "des SOUPIRS"],
	["d'ANTICALME", "de PARTA", "de GANNA", "de PSARK", "de KRANE", "GURDES", "de KAFPA", "d'OURF", "de NOIRSEUL", "NOIRES", "", "de TOOTH", "de RIEN", "BLANCHES"],
	["GRISES", "FADE", "GRINÇANTS", "de XIAX", "de TOUJOURS", "de XOTAR", "de TROO", "", "", "WANITO", "de YALM", "ABIMEUX", "BIGLEUX", "DESTITUÉE", "des DRAGÉES"],
	["FAINÉANTS", "de POLY", "VENIN", "d'ENCRE", "de JAB", "d'IAUPE", "", "BARASK", "GRONCHANTS", "", "de MILTIAR", "FOLLE", "de GROMPH", "de SANIK"],
	["d'ONKAUSE", "TAMÉE", "de DOIS", "de FAH", "", "de POOR", "de KOLIX", "de FUMÉE", "NOIR", "JAUNES", "TONNERRE", "d'AMOUR", "de KLUTH", "d'ANTINÉAR", "POURPRES"],
	["", "", "LAINEUX", "MAUVE", "SUAVES", "GUEUSE", "d'ÉPISOPHE", "TAVELÉS", "CORNUES", "de NICROP", "de KOL", "VENTEUSES", "DORMANTS", "de JISLITH"],
	["JALOUSE", "de LOGOS", "de VDAH", "GRISANT", "RIMARDE", "de PRESQUE", "de LAVE", "LAVÉES", "de ZONAR", "de JAJOU", "CRAPAUD", "RÉVULSANTES", "d'ANJOU", "d'APRÈS", "de KLANA"]
];

Magie.terresMedianesCol = function(position) {
	return position.charCodeAt(0) - "A".charCodeAt(0);
};

Magie.terresMedianesRow = function(position) {
	return parseInt(position.substr(1)) - 1;
};

Magie.terresMedianesType = function(position) {
	let col = Magie.terresMedianesCol(position);
	let row = Magie.terresMedianesRow(position);
	let colTypes = Magie.positionType[col];
	return colTypes ? colTypes[row] : undefined;
};

Magie.terresMedianesTexte = function(position) {
	let col = Magie.terresMedianesCol(position);
	let row = Magie.terresMedianesRow(position);
	return position + " " + Magie.positionType[col][row] + " " + Magie.positionNom[col][row];
};