"use strict";

AppEguna.prototype.days = ["Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata", "Igandea"];
AppEguna.prototype.months= ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];

// Class to represent a row in the festival days grid
function AppEguna(id) {
    var self;
    self = this;
    self.id = id;
    self.data = ko.observable(); // Zergatik observable??
    
    self.dataString = ko.computed(function () {
      if (typeof self.data() !== "undefined"){
        var d = new Date(self.data().replace(/\-/g, '/'));
        var m = AppEguna.prototype.months[d.getMonth()];
        var dd = d.getDate();
        var dw = AppEguna.prototype.days[d.getDay()];
        return "" + m + "k "+ dd + ", " + dw;
      }
      return "datarik ez";
    });
    self.izena = ""; // Zergatik observable??
    self.deialdiak = ko.observableArray();
    self.deialdiak = ko.observableArray();
    self.url = ko.computed(function () {
        return "#eguna?id=" + self.id;
    });
    self.editagarria = ko.observable(false);
    self.toggleEditagarria = function () {
        self.editagarria(!self.editagarria());
    };
    
    self.klonatuDeialdia = function(deialdia) {
        var deialdiBerria = new AppDeialdi(deialdia.id);
        deialdiBerria.eguna = self;
        if (typeof deialdia.ordua === 'function') {
            deialdiBerria.ordua = deialdia.ordua();
        } else {
            deialdiBerria.ordua = deialdia.ordua;
        }
        if (typeof deialdia.izenburua === 'function') {
            deialdiBerria.izenburua = deialdia.izenburua();
        } else {
            deialdiBerria.izenburua = deialdia.izenburua;
        }
        if (typeof deialdia.xehetasunak === 'function') {
            deialdiBerria.xehetasunak = deialdia.xehetasunak();
        } else {
            deialdiBerria.xehetasunak = deialdia.xehetasunak;
        }
        if (typeof deialdia.hautatua === 'function') {
            deialdiBerria.hautatua(deialdia.hautatua());
        } else {
            deialdiBerria.hautatua(deialdia.hautatua);
        }
        
        return deialdiBerria;
    };
}

// Class to represent an event in a festival day
function AppDeialdi(id) {
    var self = this;
    self.id = parseInt(id);
    self.ordua = "00:00";
    self.eguna = null;
    self.izenburua = "";
    self.xehetasunak = "";
    self.url = ko.computed(function () {
        return "#deialdia?id=" + self.id;
    });
    self.hautatua = ko.observable(false);
    self.hautatuaMezua = ko.computed(function () {
        if (self.hautatua()) {
            return "Ez naiz joango";
        } else {
            return "Joango naiz";
        }
    });
    self.toggle = function () {
        if (self.hautatua()) {
            self.hautatua(false);
        } else {
            self.hautatua(true);
        }
        self.eguna.jaia.save();
    };
    self.editagarria = ko.observable(false);
    self.toggleEditagarria = function () {
        self.editagarria(!self.editagarria());
    };
}

// Overall viewmodel for this screen, along with initial state
function AppJaia() {
    var self, egunak, eguna, i, j, current;
    self = this;
    self.izena = "";
    self.kartelarenEgilea = "";
    self.xehetasunak = "";
    self.hautatutakoEguna = ko.observable();
    self.hautatutakoDeialdia = ko.observable();

    // Editable data
    self.egunak = ko.observableArray();

    self.hautatutakoDeialdiak = ko.observable();
    self.calculateHautatutakoDeialdiak = function () {
        var matchingItems = [];
        egunak = self.egunak();
        for (i = 0; i < egunak.length; i++) {
            eguna = egunak[i];
            if (typeof eguna.deialdiak() !== "undefined") {
                for (j = 0; j < eguna.deialdiak().length; j++) {
                    current = eguna.deialdiak()[j];
                    if (current.hautatua() === true) {
                        matchingItems.push(current);
                    }
                }
            }
        }
        self.hautatutakoDeialdiak(matchingItems);
    };
    //
    self.findDeialdiById = function (deialdiId) {
        var i, eguna, deialdia;
        for (i = 0; i < self.egunak().length; i++) {
            eguna = self.egunak()[i];
            deialdia = ko.utils.arrayFirst(eguna.deialdiak(), function (item) {
                return deialdiId === item.id;
            });
            if (deialdia !== undefined && deialdia !== null) {
                return deialdia;
            }
        }
    };
    
    self.save = function () {
        var jsonString = self.exportJson();
        AppJaia.saveToStorage(jsonString, self.makinaIzena);
    };
    
    self.exportJs = function () {
        var i, j, jaia, egunaOrig, eguna, deialdiak, deialdiaOrig, deialdia;
        jaia = {};
        jaia.izena = self.izena;
        jaia.kartelarenEgilea = self.kartelarenEgilea;
        jaia.xehetasunak = self.xehetasunak;
        jaia.egunak = [];
        for (i = 0; i < self.egunak().length; i++) {
            egunaOrig = self.egunak()[i];
            eguna = {};
            eguna.id = egunaOrig.id;
            eguna.data = egunaOrig.data();
            eguna.izena = egunaOrig.izena;
            deialdiak = [];
            for (j = 0; j < egunaOrig.deialdiak().length; j++) {
                deialdiaOrig = egunaOrig.deialdiak()[j];
                deialdia = {};
                deialdia.id = deialdiaOrig.id;
                deialdia.ordua = deialdiaOrig.ordua;
                deialdia.izenburua = deialdiaOrig.izenburua;
                deialdia.xehetasunak = deialdiaOrig.xehetasunak;
                deialdia.hautatua = deialdiaOrig.hautatua();
                deialdiak.push(deialdia);
            }
            eguna.deialdiak = deialdiak;
            jaia.egunak.push(eguna);
        }
        return jaia;
    };
    self.exportJson = function () {
        var jaia, string;
        jaia  = self.exportJs();
        string = JSON.stringify(jaia, undefined, 2);
        return string;
    };
    self.klonatuEguna = function(eguna) {
        var i, deialdia;
        var egunBerria = new AppEguna(eguna.id);
        egunBerria.jaia = self;
        if (typeof eguna.data === 'function') {
            egunBerria.data(eguna.data());
        } else {
            egunBerria.data(eguna.data);
        }
        if (typeof eguna.izena === 'function') {
            egunBerria.izena = eguna.izena();
        } else {
            egunBerria.izena = eguna.izena;
        }
        var deialdiak;
        if (typeof eguna.deialdiak === 'function') {
            deialdiak = eguna.deialdiak();
        } else {
            deialdiak = eguna.deialdiak;
        }
        
        for (i = 0; i < deialdiak.length; i++) {
            deialdia = egunBerria.klonatuDeialdia(deialdiak[i]);
            egunBerria.deialdiak.push(deialdia);
        }        
        
        return egunBerria;
    };

    self.egunak.subscribe(function (egunak) {
        for (i = 0; i < egunak.length; i++) {
            egunak[i].jaia = self;
        }
    });
    self.hautatuEguna = function (eguna) {
        self.hautatutakoEguna(eguna);
        self.hautatutakoDeialdia(null);
    };
    self.hautatuDeialdia = function (deialdia) {
        self.hautatutakoEguna(deialdia.eguna);
        self.hautatutakoDeialdia(deialdia);
    };
}

AppJaia.loadFromFile = function () {
    return AppJaia.loadFromData(data);
};

AppJaia.loadFromStorage = function() {
    var dfs = AppJaia.loadObjectFromStorage();
    return AppJaia.loadFromData(dfs);
};

AppJaia.loadObjectFromStorage = function() {
    var jaiakString = window.localStorage.getItem("jaia.list");
    var jaienDatak = JSON.parse(jaiakString)||{};
    var last;
    // momentuz azkena erabiliko dut, geroago aplikazio anitz kudeatzeko gaitasuna
    // gehitu nahi dut.
    for (var name in jaienDatak) {
      if (jaienDatak.hasOwnProperty(name)) {
      }
      last = name;
    }
    var jsonData = window.localStorage.getItem(last+".data");
    if (jsonData == null) {
        return null;
    }
    return JSON.parse(jsonData);
};

AppJaia.saveToStorage = function (data, name) {
    var itemName, jaienDatak;
    if (name != null && name.length > 0) {
        itemName = "jaia-"+name;
    } else {
        itemName = "jaia";
    }
    var jaiakString = window.localStorage.getItem("jaia.list");
    if (typeof jaiakString !== "undefined" && jaiakString!=null){
      jaienDatak = JSON.parse(jaiakString);
    } else {
      jaienDatak = {};
    }
    jaienDatak[itemName] = new Date().getTime();
    jaiakString = JSON.stringify(jaienDatak);
    window.localStorage.setItem("jaia.list", jaiakString);
    window.localStorage.setItem(itemName + ".data", data); 
};

AppJaia.klonatuJaia = function(jaiaJatorria) {
    var i, jaia, eguna;
    jaia = new AppJaia();
        
    jaia.izena = jaiaJatorria.izena;
    jaia.kartelarenEgilea = jaiaJatorria.kartelarenEgilea;
    jaia.xehetasunak = jaiaJatorria.xehetasunak;
    var egunak;
    if (typeof jaiaJatorria.egunak === 'function') {
        egunak = jaiaJatorria.egunak();
    } else {
        egunak = jaiaJatorria.egunak;
    }    
    for (i = 0; i < egunak.length; i++) {
        eguna = jaia.klonatuEguna(egunak[i]);
        jaia.egunak.push(eguna);
    }
    return jaia;
};

AppJaia.loadFromData = function (data) {
    return AppJaia.klonatuJaia(data);
};

AppJaia.init = function() {
    var jaiakString = window.localStorage.getItem("jaia.list");
    var jaienDatak;
    if (typeof jaiakString !== "undefined" && jaiakString!=null) {
      jaienDatak = JSON.parse(jaiakString);
    } else {
      jaienDatak = {};
    }
    var last;
    // momentuz azkena erabiliko dut, geroago aplikazio anitz kudeatzeko gaitasuna
    // gehitu nahi dut.
    for (var name in jaienDatak) {
      if (jaienDatak.hasOwnProperty(name)) {
      }
      last = name;
    }
    var savedDate = jaienDatak[name];
    var origData = 1344447563698;
    if (savedDate == null || savedDate < origData) {
        var j = AppJaia.loadFromFile();
        j.save();
    }
    window.viewModel = AppJaia.loadFromStorage();
}
