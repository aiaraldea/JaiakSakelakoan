"use strict";

// Class to represent a row in the festival days grid
function Eguna(data, izena, deialdiak) {
    var days = ["Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata", "Igandea"];
    var months= ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
    
    var i, dldk;
    if (typeof Eguna.counter === 'undefined') {
        Eguna.counter = 0;
    }
    var self = this;
    // datuak
    self.id = Eguna.counter++;
    self.data = ko.observable(data);
    self.dataString = ko.computed(function () {
        var d = new Date(self.data());
        var m = months[d.getMonth()];
        var dd = d.getDate();
        var dw = days[d.getDay()];
        return "" + m + "k "+ dd + ", " + dw;
    });
    self.izena = ko.observable(izena);
    // erlazioak
    if (typeof deialdiak === 'function') {
        self.deialdiak = deialdiak;
    } else {
        self.deialdiak = ko.observableArray(deialdiak);
    }
    dldk = self.deialdiak();
    if (typeof dldk !== 'undefined') {
        for (i = 0; i < dldk.length; i++) {
            dldk[i].eguna = self;
        }
    }
    self.jaia = null;
    // transient
    self.editagarria = ko.observable(false);
    self.hasieraOrdua = ko.observable(8);
    // funtzioak
    self.toggleEditagarria = function () {
        self.editagarria(!self.editagarria());
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
            console.log(orduKatea);
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
            console.log(result);
            return result;
        });
    };

    self.hasieraOrdua.subscribe(function (ordua) {
        self.sort();
    });
    
//    self.data.subscribe(function (data) {
//        console.log("self.jaia");
//        console.log(self.jaia);
//        if (self.jaia !== null) {
//            self.jaia.sort();
//        }
//    });
}

// Class to represent an event in a festival day
function Deialdi(id, ordua, izenburua, xehetasunak) {
    if (typeof Deialdi.counter === 'undefined') {
        // It has not... perform the initilization
        Deialdi.counter = 0;
    }
    var self = this;
    // datuak
    if (id > Deialdi.counter) {
        Deialdi.counter = id + 1;
    }
    self.id = id;
    self.ordua = ko.observable(ordua);
    self.izenburua = ko.observable(izenburua);
    self.xehetasunak = ko.observable(xehetasunak);
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
            if (left.data() === right.data()) {
                console.log(0);
                return 0;
            }
            if (left.data() > right.data()) {
                console.log-(1);
                return 1;
            } else {
                console.log(-1);
                return -1;
            }
        });
    };
}

Jaia.mapDeialdiak = function (deialdiak) {
    if (deialdiak !== undefined) {
        return ko.mapping.fromJS(deialdiak, {
            create: function (options) {
                return new Deialdi(options.data.id, options.data.ordua, options.data.izenburua, options.data.xehetasunak);
            }
        });
    }
};

Jaia.loadFromdata = function (data) {
    var i, j, jaia, egunaOrig, deialdiak, deialdiaOrig, deialdia, eguna;
    jaia = new Jaia();
    jaia.izena(data.izena);
    jaia.kartelarenEgilea(data.kartelarenEgilea);
    jaia.egunak = ko.observableArray();
    for (i = 0; i < data.egunak.length; i++) {
        egunaOrig = data.egunak[i];
        deialdiak = [];
        for (j = 0; j < egunaOrig.deialdiak.length; j++) {
            deialdiaOrig = egunaOrig.deialdiak[j];
            deialdia = new Deialdi(deialdiaOrig.id, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
            //            deialdia.hautatua(deialdiaOrig.hautatua);
            deialdiak.push(deialdia);
        }
        eguna = new Eguna(egunaOrig.data, egunaOrig.izena, deialdiak);
        eguna.id = egunaOrig.id;
        eguna.jaia = jaia;
        jaia.egunak.push(eguna);
    }
    return jaia;
};
Jaia.loadFromFile = function () {
    var jaia, i, j, egunaOrig, deialdiak, deialdiaOrig, deialdia, eguna;
    jaia = new Jaia();
    jaia.izena(data.izena);
    jaia.kartelarenEgilea(data.kartelarenEgilea);
    jaia.egunak = ko.observableArray();
    for (i = 0; i < data.egunak.length; i++) {
        egunaOrig = data.egunak[i];
        deialdiak = [];
        for (j = 0; j < egunaOrig.deialdiak.length; j++) {
            deialdiaOrig = egunaOrig.deialdiak[j];
            deialdia = new Deialdi(deialdiaOrig.id, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
//            deialdia.hautatua(deialdiaOrig.hautatua);
            deialdiak.push(deialdia);
        }
        eguna = new Eguna(egunaOrig.data, egunaOrig.izena, deialdiak);
        eguna.jaia = jaia;
        jaia.egunak.push(eguna);
    }
    return jaia;
};
Jaia.loadFromStorage = function () {
    var dfs, jaia, i, j, jsonData, egunaOrig, deialdiak, deialdiaOrig, deialdia, eguna;
    jsonData = window.localStorage.getItem("data");
    if (typeof jsonData === "undefined") {
        return null;
    }
    dfs = JSON.parse(jsonData);
    jaia = new Jaia();
    jaia.izena(dfs.izena);
    jaia.kartelarenEgilea(dfs.kartelarenEgilea);
    jaia.egunak = ko.observableArray();
    for (i = 0; i < dfs.egunak.length; i++) {
        egunaOrig = dfs.egunak[i];
        deialdiak =  [];
        for (j = 0; j < egunaOrig.deialdiak.length; j++) {
            deialdiaOrig = egunaOrig.deialdiak[j];
            deialdia = new Deialdi(deialdiaOrig.id, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
            //            deialdia.hautatua(deialdiaOrig.hautatua);
            deialdiak.push(deialdia);
        }
        eguna = new Eguna(egunaOrig.data, egunaOrig.izena, deialdiak);
        eguna.jaia = jaia;
        jaia.egunak.push(eguna);
    }
    return jaia;
};
