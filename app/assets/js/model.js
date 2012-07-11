"use strict";
// Class to represent a row in the festival days grid
function AppEguna(data, izena, deialdiak) {
    var days = ["Igandea", "Astelehena", "Asteartea", "Asteazkena", "Osteguna", "Ostirala", "Larunbata", "Igandea"];
    var months= ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
    var self, dldk, i;
    if (typeof AppEguna.counter === 'undefined') {
        // It has not... perform the initilization
        AppEguna.counter = 0;
    }
    self = this;
    self.id = AppEguna.counter++;
    self.data = ko.observable(data);
    
    self.dataString = ko.computed(function () {
        var d = new Date(self.data());
        var m = months[d.getMonth()];
        var dd = d.getDate();
        var dw = days[d.getDay()];
        return "" + m + "k "+ dd + ", " + dw;
    });
    self.izena = ko.observable(izena);
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
    self.url = ko.computed(function () {
        return "#eguna?id=" + self.id;
    });
    self.editagarria = ko.observable(false);
    self.toggleEditagarria = function () {
        self.editagarria(!self.editagarria());
    };
}
// Class to represent an event in a festival day
function AppDeialdi(id, ordua, izenburua, xehetasunak) {
    var self = this;
    self.id = parseInt(id);
    self.ordua = ko.observable(ordua);
    self.eguna = null;
    self.izenburua = izenburua;
    self.xehetasunak = xehetasunak;
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
    self.izena = ko.observable();
    self.kartelarenEgilea = ko.observable();
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
                console.log(typeof deialdiId);
                console.log(deialdiId);
                console.log("--");
        var i, eguna, deialdia;
        for (i = 0; i < self.egunak().length; i++) {
            eguna = self.egunak()[i];
            deialdia = ko.utils.arrayFirst(eguna.deialdiak(), function (item) {
                console.log(typeof item.id);
                console.log(item.id);
                console.log(item.id === deialdiId);
                return deialdiId === item.id;
            });
            if (deialdia !== undefined && deialdia !== null) {
                return deialdia;
            }
        }
    };
    self.save = function () {
        var mapping = {
            'ignore': ["url", "jaia", 'eguna', 'hautatutakoEguna', 'hautatutakoDeialdia', 'hautatuaMezua'],
            'egunak' : {
                'ignore': ["url", "jaia", 'eguna']
            },
            'deialdiak' : {
                'ignore': ['url', 'jaia', 'eguna']
            }
        };
        var jsonString = ko.mapping.toJSON(self, mapping);
        window.localStorage.setItem("data", jsonString);
        window.localStorage.setItem("data-date", new Date().getTime());
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

AppJaia.mapDeialdiak = function (deialdiak) {
    if (deialdiak !== undefined) {
        return ko.mapping.fromJS(deialdiak, {
            create: function (options) {
                return new AppDeialdi(options.data.id, options.data.ordua, options.data.izenburua, options.data.xehetasunak);
            }
        });
    }
};

AppJaia.mapping = {
    'egunak': {
        create: function (options) {
            var eguna = new AppEguna(
                options.data.data,
                options.data.izena,
                AppJaia.mapDeialdiak(options.data.deialdiak)
                );
            return eguna;
        },
        key: function (data) {
            return ko.utils.unwrapObservable(data.id);
        }
    }
};
AppJaia.loadFromFile = function () {
    var jaia = new AppJaia();
    jaia.izena = data.izena;
    jaia.kartelarenEgilea = data.kartelarenEgilea;
    jaia.egunak = ko.observableArray();
    for (var i=0;i<data.egunak.length;i++) {
        var egunaOrig = data.egunak[i];
        var deialdiak = new Array();
        for(var j=0; j<egunaOrig.deialdiak.length; j++) {
            var deialdiaOrig = egunaOrig.deialdiak[j];
            var deialdia = new AppDeialdi(deialdiaOrig.id, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
            deialdia.hautatua(deialdiaOrig.hautatua);
            deialdiak.push(deialdia);
        }
        var eguna = new AppEguna(egunaOrig.data, egunaOrig.izena, deialdiak);
        eguna.jaia = jaia;
        jaia.egunak.push(eguna);
    }
    return jaia;
}
AppJaia.loadFromStorage = function() {
    var jsonData = window.localStorage.getItem("data");
    if (typeof jsonData === "undefined") {
        return null;
    }
    var dfs = JSON.parse(jsonData);
    var jaia = new AppJaia();
    jaia.izena = dfs.izena;
    jaia.kartelarenEgilea = dfs.kartelarenEgilea;
    jaia.egunak = ko.observableArray();
    for (var i=0;i<dfs.egunak.length;i++) {
        var egunaOrig = dfs.egunak[i];
        var deialdiak = new Array();
        for(var j=0; j<egunaOrig.deialdiak.length; j++) {
            var deialdiaOrig = egunaOrig.deialdiak[j];
            var deialdia = new AppDeialdi(deialdiaOrig.id, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
            deialdia.hautatua(deialdiaOrig.hautatua);
            deialdiak.push(deialdia);
        }
        var eguna = new AppEguna(egunaOrig.data, egunaOrig.izena, deialdiak);
        eguna.jaia = jaia;
        jaia.egunak.push(eguna);
    }
    return jaia;
}

AppJaia.init = function() {
    var savedDate = window.localStorage.getItem("data-date");
    var origData = 1335994581394;
    if (savedDate < origData) {
        var j = AppJaia.loadFromFile();
        j.save();
    }
    window.viewModel = AppJaia.loadFromStorage();
}
