config = {
	caracBonusDommages /* [taille -6][force - 6] */: [
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
	/* 17 */[0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10]],
	caracFacteurTemps : [, , , 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0.5, 0.5],
	caracFacteurResistance : [, , , , , 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
	caracBase : {
		melee : ["force", "agilite"],
		tir : ["dexterite", "vue"],
		lance : ["force", "dexterite", "vue"],
		derobee : ["taille", "agilite"],
		vieMax : ["taille", "constitution"],
		enduMax : ["taille", "constitution", "volonte"],
		vitesse : ["taille", "agilite"]
	},
	caracNoXp : ["taille"]
};