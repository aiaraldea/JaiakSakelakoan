"use strict";

function App() {
    var self = this;
    self.jaia = ko.observable();

    self.hautatutakoEguna = ko.observable();
    self.hautatutakoDeialdia = ko.observable();

    self.hautatuEguna = function (eguna) {
        self.hautatutakoEguna(eguna);
        //        self.hautatutakoDeialdia(null);
        self.ezarriEditatzekoEguna(null);
        self.ezarriEditatzekoDeialdia(null);
    };

    // Esportatu eta inportatu
    self.jsonImport = ko.observable();
    self.jsonExport = ko.observable();
    
    // Edukiak editatzeko
    self.deialdiaEditagarriaDa = function (id) {
        if (typeof self.editatzekoDeialdiaId() === null) {
            return false;
        }
        return self.editatzekoDeialdiaId() === id;
    }.bind(self);
    
    self.egunaEditagarriaDa = function (id) {
        if (typeof self.editatzekoEgunaId() === null) {
            return false;
        }
        return self.editatzekoEgunaId() === id;
    }.bind(self);
    
    self.jaiaEditagarriaDa = ko.observable(false);

    self.editatzekoEgunaId = ko.observable(null);
    self.editatzekoDeialdiaId = ko.observable(null);
    self.editatzekoJaia = ko.observable(false);

    self.ezarriEditatzekoJaia  = function () {
        self.editatzekoJaia(true);
        self.editatzekoEgunaId(null);
        self.editatzekoDeialdiaId(null);
    };
    
    self.ezarriEditatzekoDeialdia = function (deialdia) {
        if (deialdia === null) {
            self.editatzekoDeialdiaId(null);
        } else {
            self.editatzekoDeialdiaId(deialdia.id);
        }
        self.editatzekoEgunaId(null);
        self.editatzekoJaia(false);
        self.deialdiaGehitu(false);
        self.egunaGehitu(false);
    };
    
    self.ezarriEditatzekoEguna = function (eguna) {
        if (eguna !== null) {
            self.editatzekoEgunaId(eguna.id);
            self.hautatutakoEguna(null);
        } else {
            self.editatzekoEgunaId(null);
        }
        self.editatzekoDeialdiaId(null);
        self.editatzekoJaia(false);
        self.deialdiaGehitu(false);
        self.egunaGehitu(false);
    };

    self.berrezarriEditatzekoak = function () {
        self.editatzekoEgunaId(null);
        self.editatzekoDeialdiaId(null);
        self.editatzekoJaia(false);
        self.deialdiaGehitu(false);
        self.egunaGehitu(false);
    };

    // Edukiak gehitzeko
    self.egunaGehitu = ko.observable(false);
    self.deialdiaGehitu = ko.observable(false);
    
    self.toggleEgunaGehitu = function () {
        self.editatzekoEgunaId(null);
        self.editatzekoDeialdiaId(null);
        self.editatzekoJaia(false);
        self.deialdiaGehitu(false);
        self.egunaGehitu(!self.egunaGehitu());
    };
    
    self.toggleDeialdiaGehitu = function () {
        self.editatzekoEgunaId(null);
        self.editatzekoDeialdiaId(null);
        self.editatzekoJaia(false);
        self.egunaGehitu(false);
        self.deialdiaGehitu(!self.deialdiaGehitu());
    };
    
    self.egunBerria = ko.observable(new Eguna());
    
    self.gehituEguna = function () {
        self.jaia().egunak.push(self.egunBerria());
        self.egunBerria(new Eguna());
//        self.egunaGehitu(false);
    };
    
    self.deialdiBerria = ko.observable(new Deialdi());
    
    self.gehituDeialdia = function () {
        self.deialdiBerria().id = Deialdi.counter++;
        self.hautatutakoEguna().deialdiak.push(self.deialdiBerria());
        self.hautatutakoEguna().sort();
        self.deialdiBerria(new Deialdi());
//        self.deialdiaGehitu(false);
    };

    // Edukiak ezabatzeko
    self.ezabatuEguna = function () {
        var eguna = ko.utils.arrayFirst(self.jaia().egunak(), function (item) {
            return self.editatzekoEgunaId() === item.id;
        });
        self.jaia().egunak.remove(eguna);
    };
    
    self.ezabatuDeialdia = function () {
        var deialdia = ko.utils.arrayFirst(self.hautatutakoEguna().deialdiak(), function (item) {
            return self.editatzekoDeialdiaId() === item.id;
        });
        self.hautatutakoEguna().deialdiak.remove(deialdia);
    };
}

App.init = function () {
    var savedDate = window.localStorage.getItem("data-date");
    var origData = 1335994581394;
    if (savedDate < origData) {
        var j = Jaia.loadFromFile();
        j.save();
    }
    var app = new App();
    app.jaia(Jaia.loadFromStorage());
    window.viewModel = app;
};

App.init();

$(function () {
    ko.applyBindings(window.viewModel);
    $('#egunaEzabatuModal').modal().modal('hide');
    $('#deialdiaEzabatuModal').modal().modal('hide');
    $('#esportatzeModal').modal().modal('hide');
    $('#esportatzeModal').on('show', function () {
        viewModel.jsonExport(viewModel.jaia().exportJson());
    });
    $('#inportatzeModal').modal().modal('hide');
    $('#aurreikusiModal').modal().modal('hide');
    $('.dropdown-toggle').dropdown();
    $('.datepicker').datepicker({language: 'eu', autoclose: true, weekStart: 1})
});
