app.directive("eqmtSac",
		function() {
			return {
				restrict : "A",
				replace : false,
				scope : true,
				templateUrl : "widget/eqmt-sac.html",

				controller : function($scope) {
					$scope.onNomClick = function(evt) {
						var elt = evt.target;
						while (elt.nodeName != "TD")
							elt = elt.parentNode;
						elt.classList.toggle("eqmt-edit");
						setTimeout(function() {
							elt.querySelectorAll("input")[0].focus();
						}, 100);
					};

					$scope.onNomBlur = function(evt) {
						evt.target.parentNode.classList.toggle("eqmt-edit");
					};

					$scope.moveLeft = function() {
						var sacs = $scope.display.sac;
						var i = $scope.$parent.$parent.$index;
						sacs[i].splice($scope.getIndexInCol(), 1);
						sacs[i - 1].push($scope.sac.nom);
					};

					$scope.moveRight = function() {
						var sacs = $scope.display.sac;
						var i = $scope.$parent.$parent.$index;
						sacs[i].splice($scope.getIndexInCol(), 1);
						sacs[i + 1].push($scope.sac.nom);
					};

					$scope.remove = function() {
						$scope.perso.eqmt.sac.splice($scope.sacGetIndex($scope.sac.nom), 1);
						$scope.display.sac[$scope.getColIndex()].splice($scope.getIndexInCol(), 1);
					};

					$scope.addItem = function(evt) {
						$scope.sac.liste.push({
							nom : "",
							qte : 1
						});
						setTimeout(function() {
							var elt = evt.target;
							while (elt.nodeName != "TR")
								elt = elt.parentNode;
							var nodes = elt.parentNode.querySelectorAll("input[type=text]");
							nodes[nodes.length - 1].parentNode.click();
						}, 100);
					};
				},

				link : function(scope, elt, attrs) {
					elt[0].setAttribute("class", "eqmt-sac");

					scope.sac = scope.perso.eqmt.sac[scope.sacGetIndex(attrs.eqmtSac)];
					scope.getColIndex = function() {
						var td = elt[0].parentNode;
						while (td.nodeName != "TD")
							td = td.parentNode;
						return util.indexOfSameNodeName(td.parentNode.childNodes, td);
					};
					scope.getIndexInCol = function() {
						var td = elt[0].parentNode;
						return util.indexOfSameNodeName(td.parentNode.childNodes, td);
					};

					elt[0].addEventListener("dragover", function(evt) {
						if (evt.dataTransfer.types.indexOf("eqmt-item") != -1)
							evt.preventDefault();
					});

					var onDrop = function(evt) {
						var item = evt.dataTransfer.getData("eqmt-item");
						if (!item)
							return;
						var split = item.split("-");
						var dragContenant = parseInt(split[0]), dragItem = parseInt(split[1]);

						var dropContenant = scope.sacGetIndex(scope.sac.nom), dropItem, elt = evt.target;
						while (elt
								&& (!elt.className || (!elt.classList.contains("eqmt-item") && !elt.classList
										.contains("eqmt-sac"))))
							elt = elt.parentNode;
						var contenants = scope.perso.eqmt.sac;
						if (elt.classList.contains("eqmt-item"))
							dropItem = util.indexOf(elt.parentNode.querySelectorAll(".eqmt-item"), elt);
						else
							dropItem = scope.sac.liste.length;
						if (dropContenant == dragContenant) {
							if (dropItem == dragItem || dropItem == dragItem + 1)
								return;
							if (dropItem > dragItem)
								dropItem--;
						}

						var item = contenants[dragContenant].liste[dragItem];
						if (evt.shiftKey) {
							scope.sac.liste.splice(dropItem, 0, {
								nom : item.nom,
								qte : Math.ceil(item.qte / 2)
							});
							item.qte = Math.floor(item.qte / 2);
						} else {
							contenants[dragContenant].liste.splice(dragItem, 1);
							var dropLentgh = scope.sac.liste.length;
							if (dropItem < dropLentgh && item.nom == scope.sac.liste[dropItem].nom)
								scope.sac.liste[dropItem].qte += item.qte;
							else if (dropItem > 0 && dropItem - 1 < dropLentgh
									&& item.nom == scope.sac.liste[dropItem - 1].nom)
								scope.sac.liste[dropItem - 1].qte += item.qte;
							else
								scope.sac.liste.splice(dropItem, 0, item);
						}
						scope.$parent.$apply();
					}
					elt[0].addEventListener("drop", onDrop);
				}
			}
		});