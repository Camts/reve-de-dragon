controle.terresMedianes = function($scope) {
	var positionType = [
			["CITE", "DESERT", "DESOLATION", "FORET", "PLAINES", "NECROPOLE", "PLAINES", "GOUFFRE", "COLLINES",
					"SANCTUAIRE", "DESOLATION", "PLAINES", "FLEUVE", "COLLINES", "CITE"],
			["PLAINES", "COLLINES", "PLAINES", "MONTS", "COLLINES", "FORET", "MARAIS", "FLEUVE", "LAC", "MONTS",
					"CITE", "FLEUVE", "GOUFFRE", "NECROPOLE"],
			["NECROPOLE", "MARAIS", "FLEUVE", "PONT", "MARAIS", "CITE", "FLEUVE", "FORET", "MONTS", "MARAIS", "PONT",
					"LAC", "DESERT", "FORET", "PLAINES"],
			["FLEUVE", "CITE", "GOUFFRE", "LAC", "FLEUVE", "FLEUVE", "PLAINES", "CITE", "PONT", "FLEUVE", "DESOLATION",
					"COLLINES", "CITE", "SANCTUAIRE"],
			["MONTS", "PLAINES", "FORET", "PLAINES", "MONTS", "SANCTUAIRE", "FORET", "PLAINES", "FLEUVE", "GOUFFRE",
					"LAC", "MONTS", "PLAINES", "MONTS", "FORET"],
			["CITE", "LAC", "FLEUVE", "FLEUVE", "CITE", "FLEUVE", "FLEUVE", "LAC", "PLAINES", "MARAIS", "CITE",
					"NECROPOLE", "FORET", "PLAINES"],
			["DESOLATION", "MARAIS", "GOUFFRE", "SANCTUAIRE", "PONT", "MARAIS", "CITE", "PLAINES", "DESERT", "CITE",
					"FLEUVE", "PLAINES", "PLAINES", "DESERT", "PLAINES"],
			["LAC", "COLLINES", "FORET", "PLAINES", "DESERT", "MONTS", "GOUFFRE", "FORET", "COLLINES", "PLAINES",
					"FLEUVE", "COLLINES", "DESOLATION", "PLAINES"],
			["PLAINES", "FORET", "MONTS", "PLAINES", "DESOLATION", "NECROPOLE", "PLAINES", "FLEUVE", "FLEUVE", "LAC",
					"PONT", "GOUFFRE", "MONTS", "CITE", "MONTS"],
			["MONTS", "DESERT", "CITE", "COLLINES", "MARAIS", "LAC", "FLEUVE", "MONTS", "MARAIS", "FLEUVE", "PLAINES",
					"CITE", "GOUFFRE", "DESERT"],
			["CITE", "FORET", "PLAINES", "PONT", "FLEUVE", "DESOLATION", "CITE", "DESERT", "SANCTUAIRE", "PLAINES",
					"CITE", "DESOLATION", "FORET", "NECROPOLE", "COLLINES"],
			["FLEUVE", "FLEUVE", "LAC", "SANCTUAIRE", "COLLINES", "FORET", "GOUFFRE", "MONTS", "COLLINES", "DESERT",
					"COLLINES", "PLAINES", "MONTS", "PLAINES"],
			["CITE", "NECROPOLE", "MONTS", "GOUFFRE", "CITE", "DESOLATION", "DESERT", "PLAINES", "NECROPOLE", "FORET",
					"CITE", "COLLINES", "PLAINES", "DESOLATION", "CITE"]];
	var positionNom = [
			["VIDE", "de MIEUX", "de DEMAIN", "de FALCONAX", "de TRILKH", "de ZNIAK", "de l'ARC", "de SHOK",
					"de KORREX", "d'OLIS", "d'HIER", "SAGES", "", "de STOLIS", "de MIELH"],
			["d'ASSORH", "de DAWELL", "de RUBEGA", "CRÂNEURS", "de TANEGV", "de BUST", "BLUANTS", "", "de LUCRE",
					"SALÉS", "de BRILZ", "", "des LITIGES", "de GORLO"],
			["de KROAK", "GLIGNANTS", "", "de GIOLI", "FLOUANTS", "PAVOIS", "", "TURMIDE", "TUMÉFIÉS", "de DOM",
					"de ROI", "de FRICASA", "de NEIGE", "de BISSAM", "de TOUÉ"],
			["", "de FROST", "d'OKI", "de FOAM", "", "", "d'AFFA", "d'OLAK", "d'ORX", "", "de PARTOUT", "d'HUAÏ",
					"SORDIDE", "PLAT"],
			["de KANAÏ", "de FIASK", "d'ESTOUBH", "d'ORTI", "BRÛLANTS", "de PLAINE", "de GLUSKS", "d'IOLISE", "",
					"de JUNK", "de GLINSTER", "AJOURÉS", "de XNEZ", "de QUATH", "des FURIES"],
			["GLAUQUE", "de MISÈRE", "", "", "de PANOPLE", "", "", "des CHATS", "de FOE", "ZULTANTS", "de NOAPE",
					"de THROAT", "des CRIS", "BRISÉES"],
			["de JAMAIS", "NUISANTS", "de SUN", "BLANC", "d'IK", "GLUTANTS", "de TERWA", "SANS JOIE", "de SEL",
					"de SERGAL", "", "de LUFMIL", "CALCAIRES", "de SEK", "des SOUPIRS"],
			["d'ANTICALME", "de PARTA", "de GANNA", "de PSARK", "de KRANE", "GURDES", "de KAFPA", "d'OURF",
					"de NOIRSEUL", "NOIRES", "", "de TOOTH", "de RIEN", "BLANCHES"],
			["GRISES", "FADE", "GRINÇANTS", "de XIAX", "de TOUJOURS", "de XOTAR", "de TROO", "", "", "WANITO",
					"de YALM", "ABIMEUX", "BIGLEUX", "DESTITUÉE", "des DRAGÉES"],
			["FAINÉANTS", "de POLY", "VENIN", "d'ENCRE", "de JAB", "d'IAUPE", "", "BARASK", "GRONCHANTS", "",
					"de MILTIAR", "FOLLE", "de GROMPH", "de SANIK"],
			["d'ONKAUSE", "TAMÉE", "de DOIS", "de FAH", "", "de POOR", "de KOLIX", "de FUMÉE", "NOIR", "JAUNES",
					"TONNERRE", "d'AMOUR", "de KLUTH", "d'ANTINÉAR", "POURPRES"],
			["", "", "LAINEUX", "MAUVE", "SUAVES", "GUEUSE", "d'ÉPISOPHE", "TAVELÉS", "CORNUES", "de NICROP", "de KOL",
					"VENTEUSES", "DORMANTS", "de JISLITH"],
			["JALOUSE", "de LOGOS", "de VDAH", "GRISANT", "RIMARDE", "de PRESQUE", "de LAVE", "LAVÉES", "de ZONAR",
					"de JAJOU", "CRAPAUD", "RÉVULSANTES", "d'ANJOU", "d'APRÈS", "de KLANA"]];

	$scope.terresMedianesCol = function(position) {
		return position.charCodeAt(0) - "A".charCodeAt(0);
	};

	$scope.terresMedianesRow = function(position) {
		return parseInt(position.substr(1)) - 1;
	};

	$scope.terresMedianesType = function(position) {
		var col = $scope.terresMedianesCol(position);
		var row = $scope.terresMedianesRow(position);
		var col = positionType[col];
		return col ? col[row] : undefined;
	};

	$scope.terresMedianesTexte = function(position) {
		var col = $scope.terresMedianesCol(position);
		var row = $scope.terresMedianesRow(position);
		return position + " " + positionType[col][row] + " " + positionNom[col][row];
	};

	$scope.terresMedianesMonter = function(rapide) {
		$scope.perso.compteur.reve -= rapide ? 2 : 1;
		$scope.perso.compteur.fatigue += 1;
		$scope.perso.magie.monte = true;
		var reserve = $scope.perso.magie.reserve[$scope.perso.magie.terreMediane];
		if (reserve) {
			$scope.perso.magie.reserve[$scope.perso.magie.terreMediane] = undefined;
			util.notify("Le sort en réserve <span class='emphase'>" + reserve + "</span> a été lancé.");
		}
	};

	$scope.terresMedianesDescendre = function() {
		$scope.perso.magie.monte = false;
	};

	$scope.$watch("ihm.mode", function(newVal, oldVal) {
		var msg = "Vous avez quitté la vue magie et vous êtes toujours"
				+ " dans les terres médianes du rêve, voulez-vous redescendre";
		if (oldVal == "magie" && $scope.perso.magie.monte && window.confirm(msg)) {
			$scope.perso.magie.monte = false;
		}
	});
};