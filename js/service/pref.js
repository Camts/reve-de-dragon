"use strict";
// jshint esversion: 6

service.pref = {
	onBackgroundChange : function(val) {
		if (!val || isNaN(val) || val < 0)
			val = 0;
		if (val > 100)
			val = 100;
		document.getElementById("glasspane").style.backgroundColor = "rgba(255,255,255," + (val / 100.0) + ")";
	},
	onZonesChange : function(bVal) {
		zone.setVisible(bVal);
	},
	applyAll : function(prefs) {
		service.pref.onBackgroundChange(prefs.background);
		zone.setVisible(false);
	}
};