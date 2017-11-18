controle.sort = function($scope) {
	$scope.sortVoies = function() {
		return ["oniros", "hypnos", "narcos", "thanatos"];
	};

	$scope.sortTypesCase = function() {
		return ["CITE", "COLLINES", "DESERT", "DESOLATION", "FLEUVE", "FORET", "GOUFFRE", "LAC", "MARAIS", "MONTS",
				"NECROPOLE", "PLAINES", "PONT", "SANCTUAIRE"];
	};

	$scope.sortSeuilNormale = function(sort) {
		var s = sort;
		if (!sort)
			if ($scope.ihm.magie.sortVu !== undefined)
				s = $scope.perso.magie.sorts[$scope.ihm.magie.sortVu];
			else
				return;
		var compDiff = service.competence.val($scope.perso.comp[s.voie]) + s.diff;
		if (!sort)
			compDiff += $scope.ihm.magie.castAstro;
		var out = service.seuil.normale($scope.perso.carac.reve.val, compDiff - $scope.ihm.jet.malus);
		if (!sort) {
			var bonusCase = s.bonus[$scope.perso.magie.terreMediane];
			if (bonusCase)
				out += bonusCase;
		}
		return out;
	};
	$scope.sortSeuilCritique = function(sort) {
		var normale = $scope.sortSeuilNormale(sort);
		return normale ? service.seuil.critique(normale) : undefined;
	};
	$scope.sortSeuilParticuliere = function(sort) {
		var normale = $scope.sortSeuilNormale(sort);
		return normale ? service.seuil.particuliere(normale) : undefined;
	};
	$scope.sortSeuilSignificative = function(sort) {
		var normale = $scope.sortSeuilNormale(sort);
		return normale ? service.seuil.significative(normale) : undefined;
	};
	$scope.sortSeuilEchecTotal = function(sort) {
		var normale = $scope.sortSeuilNormale(sort);
		return normale ? service.seuil.echecTotal(normale) : undefined;
	};

	var sortDetailFormat = function(text) {
		var out = "", i, ul = false, ol = false, lines = text ? text.split("\n") : "";
		var closeOrOpen = function(closeUl, closeOl) {
			if (closeUl) {
				if (ul) {
					out += "</ul>";
					ul = false;
				}
			} else if (!ul) {
				ul = true;
				out += "<ul>";
			}
			if (closeOl) {
				if (ol) {
					out += "</ol>";
					ol = false;
				}
			} else if (!ol) {
				ol = true;
				out += "<ol>";
			}
		}
		for (i = 0; i < lines.length; i++) {
			var j, k, line = lines[i];
			// bold
			while ((j = line.indexOf("'''", j)) != -1) {
				if ((k = line.indexOf("'''", j + 3)) != -1) {
					line = line.substring(0, j) + "<b>" + line.substring(j + 3, k) + "</b>" + line.substring(k + 3);
				}
				j += 3;
			}
			// italic
			while ((j = line.indexOf("''", j)) != -1) {
				if ((k = line.indexOf("''", j + 2)) != -1) {
					line = line.substring(0, j) + "<i>" + line.substring(j + 2, k) + "</i>" + line.substring(k + 2);
				}
				j += 2;
			}
			// title
			var j = line.match(/^=+ (.*) =+$/), k = line.indexOf(" ");
			if (j && k <= 3 && k == line.length - line.lastIndexOf(" ") - 1) {
				closeOrOpen(true, true);
				out += "<h" + k + ">" + j[1] + "</h" + k + ">";
			} else if (line.startsWith("* ")) { // unordered list
				closeOrOpen(false, true);
				out += "<li>" + line.substring(2) + "</li>";
			} else if (line.startsWith("# ")) { // ordered list
				closeOrOpen(true, false);
				out += "<li>" + line.substring(2) + "</li>";
			} else {
				closeOrOpen(true, true);
				out += line + "<br/>";
			}
		}
		closeOrOpen(true, true);
		return out;
	};

	$scope.sortVoir = function(index, sort) {
		if ($scope.ihm.magie.sortVu != index) {
			$scope.ihm.magie.sortVu = index;
			$scope.ihm.magie.typeCase = sort.typeCase;
			$scope.ihm.magie.castVar = 0;
			$scope.ihm.magie.castAstro = 0;
			if (sort.variable)
				document.getElementById("cadre-magie-sorts-var").removeAttribute("disabled");
			else
				document.getElementById("cadre-magie-sorts-var").setAttribute("disabled", "disabled");
			if (sort.rituel)
				document.getElementById("cadre-magie-sorts-astro").removeAttribute("disabled");
			else
				document.getElementById("cadre-magie-sorts-astro").setAttribute("disabled", "disabled");
			document.getElementById("cadre-magie-sorts-detail").innerHTML = sortDetailFormat($scope.perso.magie.sorts[$scope.ihm.magie.sortVu].detail);
		} else {
			$scope.ihm.magie.sortVu = undefined;
			$scope.ihm.magie.typeCase = undefined;
			document.getElementById("cadre-magie-sorts-detail").innerHTML = "";
		}
	};

	$scope.sortInitBonusText = function(index, sort) {
		var i, sorted = [];
		for (i in sort.bonus) {
			sorted.push(i);
		}
		sorted.sort();
		var nom, s = "";
		for (i = 0; i < sorted.length; i++) {
			nom = sorted[i];
			s += ", " + nom + ": " + sort.bonus[nom];
		}
		$scope.ihm.magie.sortBonusTexte[index] = s.substring(2);
	};

	var validSort = function(sort, bonus) {
		var err = [];
		if (!sort.nom)
			err.push("Le nom ne doit pas être vide");
		var i = parseInt(sort.diff);
		if (isNaN(i) || i > -1)
			err.push("La difficulté doit être un nombre inférieur à 0");
		i = parseInt(sort.conso);
		if (isNaN(i) || i < 1)
			err.push("La consommation doit être un nombre supérieur à 0");

		var a, b = {}, n, bs = bonus ? bonus.trim().split(",") : [];
		for (i = 0; i < bs.length; i++) {
			a = bs[i].trim().split(":");
			if (a.length == 2) {
				if ($scope.terresMedianesType(a[0].trim())) {
					n = parseInt(a[1].trim());
					if (!isNaN(n)) {
						if (n > 0) {
							b[a[0].trim()] = n;
						} else {
							err.push("La valeur de '<span class='emphase'>" + a[0].trim()
									+ "</span>' : '<span class='emphase'>" + a[1].trim()
									+ "</span>' est bien un nombre entier, mais il doit être supérieur à 0");
						}
					} else {
						err.push("La valeur de '<span class='emphase'>" + a[0].trim()
								+ "</span>' : '<span class='emphase'>" + a[1].trim()
								+ "</span>' n'est pas un nombre entier");
					}
				} else {
					err.push("'<span class='emphase'>" + a[0].trim()
							+ "</span>' n'est pas une case des terres médianes");
				}
			} else if (a.length == 1 && a[0].trim().length > 0) {
				err.push("'<span class='emphase'>" + a[0].trim() + "</span>' n'a pas de valeur, exemple correct : '"
						+ a[0].trim() + ": 3'");
			} else if (a.length > 2) {
				err.push("'<span class='emphase'>" + bs[i].trim() + "</span>' contient plus de un ':'");
			}
		}

		var msg = "";
		for (i = 0; i < err.length; i++) {
			msg += err[i];
			if (i < err.length)
				msg += "<br/>";
		}

		return {
			err : msg,
			bonus : b
		};
	}

	$scope.sortIsEdit = function(index) {
		return $scope.ihm.magie.sortEdit == index;
	};

	$scope.sortEdit = function(index) {
		var sort = $scope.perso.magie.sorts[index];
		if ($scope.sortIsEdit(index)) {
			var errAndBonus = validSort(sort, $scope.ihm.magie.sortBonusTexte[index]);
			if (errAndBonus.err) {
				util.notify(errAndBonus.err);
			} else {
				sort.bonus = errAndBonus.bonus;
				sort.detail = $scope.ihm.magie.sortDetail;
				$scope.ihm.magie.sortEdit = -1;
				$scope.ihm.magie.sortDetail = "";
			}
		} else {
			$scope.ihm.magie.sortEdit = index;
			$scope.ihm.magie.sortDetail = sort.detail;
		}

		var tr = document.getElementById("sort-" + index).parentNode;
		var i, inputs = tr.querySelectorAll("input");
		for (i = 0; i < inputs.length; i++) {
			var name = inputs[i].name;
			var input = document.querySelectorAll("#sort-new input[name=" + name + "]");
			if (input.length == 1)
				inputs[i].style.width = input[0].style.width;
		}
	};

	var initBonusTexts = function() {
		var i;
		for (i = 0; i < $scope.perso.magie.sorts.length; i++) {
			$scope.sortInitBonusText(i, $scope.perso.magie.sorts[i]);
		}
	}
	initBonusTexts();

	$scope.sortMoveDown = function(index) {
		var i, sorts = $scope.perso.magie.sorts;
		for (i = index; i < sorts.length - 1; i++) {
			sorts.push(angular.copy(sorts[i]));
			sorts.splice(i, 1);
		}
		initBonusTexts();
		if ($scope.ihm.magie.sortVu == index)
			$scope.ihm.magie.sortVu = index + 1;
		else if ($scope.ihm.magie.sortVu == index + 1)
			$scope.ihm.magie.sortVu = index;
	};

	$scope.sortAdd = function() {
		var s = $scope.ihm.magie.sortNew;
		var errAndBonus = validSort(s, s.bonus);
		if (errAndBonus.err) {
			util.notify(errAndBonus.err);
		} else {
			$scope.perso.magie.sorts.push(angular.copy({
				voie : s.voie,
				nom : s.nom,
				typeCase : s.typeCase,
				diff : s.diff,
				conso : s.conso,
				portee : s.portee,
				variable : s.variable,
				rituel : s.rituel,
				bonus : errAndBonus.bonus,
				detail : $scope.ihm.magie.sortDetail
			}));
			$scope.ihm.magie.sortNew = {
				voie : "oniros",
				typeCase : "CITE",
				diff : -1,
				conso : 1
			};
			$scope.ihm.magie.sortDetail = "";
			initBonusTexts();
		}
	};

	$scope.sortCanCast = function() {
		if (!$scope.perso.magie.monte)
			return false;
		var sort = $scope.perso.magie.sorts[$scope.ihm.magie.sortVu];
		return sort && $scope.perso.compteur.reve >= sort.conso + $scope.ihm.magie.castVar
				&& sort.typeCase == $scope.terresMedianesType($scope.perso.magie.terreMediane);
	};

	$scope.sortCast = function(reussi, reserve) {
		var sort = $scope.perso.magie.sorts[$scope.ihm.magie.sortVu];
		$scope.perso.compteur.reve -= sort.conso + $scope.ihm.magie.castVar;
		if (reussi) {
			var bonus = sort.bonus[$scope.perso.magie.terreMediane];
			sort.bonus[$scope.perso.magie.terreMediane] = bonus ? bonus + 1 : 1;
			$scope.sortInitBonusText($scope.ihm.magie.sortVu, sort);
			if (reserve) {
				var text = sort.nom;
				if (sort.variable) {
					var nb = $scope.ihm.magie.castVar;
					text += " (+" + nb + (nb > 1 ? " points)" : " point)");
				}
				$scope.perso.magie.reserve[$scope.perso.magie.terreMediane] = text;
			}
		}
	};
};