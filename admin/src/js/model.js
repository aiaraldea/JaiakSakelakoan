"use strict";


// Class to represent a row in the festival days grid
function Eguna(id) {
    if (typeof Eguna.counter === 'undefined') {
        Eguna.counter = 0;
    }
    var self = this;
    // datuak
    if (id > Eguna.counter) {
        Eguna.counter = id + 1;
    }
    if(typeof id=="undefined") {
        id = Eguna.counter++;
    }
    self.id = id;
    self.data = ko.observable();
    self.dataString = ko.computed(function () {
        var d = new Date(self.data());
        var m = AppEguna.prototype.months[d.getMonth()];
        var dd = d.getDate();
        var dw = AppEguna.prototype.days[d.getDay()];
        return "" + m + "k "+ dd + ", " + dw;
    });
    self.izena = ko.observable();
    // erlazioak
    self.deialdiak = ko.observableArray();
    self.jaia = null;
    // transient
    self.editagarria = ko.observable(false);
    self.hasieraOrdua = ko.observable(8);
    // funtzioak
    self.toggleEditagarria = function () {
        self.editagarria(!self.editagarria());
    };
    
    self.sortuDeialdia = function() {
        var deialdia = new Deialdi();
        deialdia.eguna = self;
        return deialdia;
    };
    
    self.klonatuDeialdia = function(deialdia) {
        var deialdiBerria = new Deialdi(deialdia.id);
        deialdiBerria.eguna = self;
        if (typeof deialdia.ordua === 'function') {
            deialdiBerria.ordua(deialdia.ordua());
        } else {
            deialdiBerria.ordua(deialdia.ordua);
        }
        if (typeof deialdia.izenburua === 'function') {
            deialdiBerria.izenburua(deialdia.izenburua());
        } else {
            deialdiBerria.izenburua(deialdia.izenburua);
        }
        if (typeof deialdia.xehetasunak === 'function') {
            deialdiBerria.xehetasunak = deialdia.xehetasunak;
        } else {
            deialdiBerria.xehetasunak(deialdia.xehetasunak);
        }
        
        return deialdiBerria;
    };
    
    self.sort = function () {
        self.deialdiak.sort(function (left, right) {
            if (left.ordua() === right.ordua()) {
                return 0;
            }
            var orduKatea;
            if (self.hasieraOrdua() > 9) {
                orduKatea = '' + self.hasieraOrdua() + ":00";
            } else {
                orduKatea = "0" + self.hasieraOrdua() + ":00";
            }
            // 08 < 09
            // 09 < 07
            var result;
            if ((left.ordua() <= orduKatea && right.ordua() <= orduKatea) || (left.ordua() >= orduKatea && right.ordua() >= orduKatea)) {
                result =  (left.ordua() < right.ordua()? -1 : 1);
            } else {
                if (left.ordua() > orduKatea) {
                    result = -1;
                } else {
                    result = 1;
                }
            }
            return result;
        });
    };

    self.hasieraOrdua.subscribe(function (ordua) {
        self.sort();
    });
}

// Class to represent an event in a festival day
function Deialdi(id) {
    if (typeof Deialdi.counter === 'undefined') {
        // It has not... perform the initilization
        Deialdi.counter = 0;
    }
    var self = this;
    // datuak
    if (id > Deialdi.counter) {
        Deialdi.counter = id + 1;
    } 
    if(typeof id=="undefined") {
        id = Deialdi.counter++;
    }
    self.id = id;
    self.ordua = ko.observable();
    self.izenburua = ko.observable();
    self.xehetasunak = ko.observable();
    // erlazioak
    self.eguna = null;
    // transient
    self.editagarria = ko.observable(false);
    self.toggleEditagarria = function () {  
        self.editagarria(!self.editagarria());
    };

    self.ordua.subscribe(function (ordua) {
        if (self.eguna !== null) {
            self.eguna.sort();
        }
    });
}

// Overall viewmodel for this screen, along with initial state
function Jaia() {
    var self = this;
    self.izena = ko.observable();
    self.kartelarenEgilea = ko.observable();
    self.xehetasunak = ko.observable();

    // Editable data
    self.egunak = ko.observableArray();
    
    self.sortuEguna = function() {
        var eguna = new Eguna();
        eguna.jaia = self;
        return eguna;
    };
    
    self.klonatuEguna = function(eguna) {
        var i, deialdia;
        var egunBerria = new Eguna(eguna.id);
        egunBerria.jaia = self;
        if (typeof eguna.data === 'function') {
            egunBerria.data(eguna.data());
        } else {
            egunBerria.data(eguna.data);
        }
        if (typeof eguna.izena === 'function') {
            egunBerria.izena(eguna.izena());
        } else {
            egunBerria.izena(eguna.izena);
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

    self.save = function () {
        var jsonString = self.exportJson();
        window.localStorage.setItem("data", jsonString);
        window.localStorage.setItem("data-date", new Date().getTime());
    };
    self.exportJs = function () {
        var i, j, jaia, egunaOrig, eguna, deialdiak, deialdiaOrig, deialdia;
        jaia = {};
        jaia.izena = self.izena();
        jaia.kartelarenEgilea = self.kartelarenEgilea();
        jaia.xehetasunak = self.xehetasunak();
        jaia.egunak = [];
        for (i = 0; i < self.egunak().length; i++) {
            egunaOrig = self.egunak()[i];
            eguna = {};
            eguna.id = egunaOrig.id;
            eguna.data = egunaOrig.data();
            eguna.izena = egunaOrig.izena();
            deialdiak = [];
            for (j = 0; j < egunaOrig.deialdiak().length; j++) {
                deialdiaOrig = egunaOrig.deialdiak()[j];
                deialdia = {};
                deialdia.id = deialdiaOrig.id;
                deialdia.ordua = deialdiaOrig.ordua();
                deialdia.izenburua = deialdiaOrig.izenburua();
                deialdia.xehetasunak = deialdiaOrig.xehetasunak();
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
    self.importJson = function () {
        var data = JSON.parse(self.jsonImport());
        self = Jaia.loadFromdata(data);
    };
    self.egunak.subscribe(function (egunak) {
        var i;
        for (i = 0; i < egunak.length; i++) {
            egunak[i].jaia = self;
        }
    });

    self.syncToStorage = function () {
        var dfs, jaia, length, i, string;
        dfs = AppJaia.loadFromStorage();
        dfs.calculateHautatutakoDeialdiak();
        jaia  = self.exportJs();
        console.log(jaia);
        length = dfs.hautatutakoDeialdiak().length;
        for (i = 0; i < length; i++) {
            self.findDeialdiById(jaia, dfs.hautatutakoDeialdiak()[i].id).hautatua = dfs.hautatutakoDeialdiak()[i].hautatua();
        }

        string = JSON.stringify(jaia, undefined, 2);

        window.localStorage.setItem("data", string);
        window.localStorage.setItem("data-date", new Date().getTime());
    };

    self.findDeialdiById = function (jaia, deialdiId) {
        var i, eguna, deialdia, comparator;
        comparator = function (item) {
            return deialdiId === item.id;
        };
        for (i = 0; i < jaia.egunak.length; i++) {
            eguna = jaia.egunak[i];
            deialdia = ko.utils.arrayFirst(eguna.deialdiak, comparator);
            if (deialdia !== undefined && deialdia !== null) {
                return deialdia;
            }
        }
    };

    self.calculateHautatutakoDeialdiak = function () {
        var matchingItems, egunak, eguna, i, j, current;
        matchingItems = [];
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
        return matchingItems;
    };
    
    self.sort = function () {
        self.egunak.sort(function (left, right) {
            if (left.data() < right.data()) {
                return -1;
            }
            if (left.data() > right.data()) {
                return 1;
            }
            return 0;
        });
    };
}

Jaia.klonatuJaia = function(jaiaJatorria) {
    var i, jaia, eguna;
    jaia = new Jaia();
    
    if (typeof jaiaJatorria.izena === 'function') {
        jaia.izena(jaiaJatorria.izena());
    } else {
        jaia.izena(jaiaJatorria.izena);
    }
    if (typeof jaiaJatorria.kartelarenEgilea === 'function') {
        jaia.kartelarenEgilea(jaiaJatorria.kartelarenEgilea());
    } else {
        jaia.kartelarenEgilea(jaiaJatorria.kartelarenEgilea);
    }
    if (typeof jaiaJatorria.xehetasunak === 'function') {
        jaia.xehetasunak(jaiaJatorria.xehetasunak());
    } else {
        jaia.xehetasunak(jaiaJatorria.xehetasunak);
    }
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

Jaia.loadFromData = function (data) {
    return Jaia.klonatuJaia(data);
};

Jaia.loadFromFile = function () {
    return Jaia.loadFromData(data);
};

Jaia.loadFromStorage = function () {
    var dfs, jsonData;
    jsonData = window.localStorage.getItem("data");
    if (typeof jsonData === "undefined") {
        return null;
    }
    dfs = JSON.parse(jsonData);
    return Jaia.loadFromData(dfs);
};
