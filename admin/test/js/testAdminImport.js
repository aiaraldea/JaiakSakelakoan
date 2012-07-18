test( "Kudeaketaren datuen inportazioa", function() {
    var data = {
    "izena": "Amurrioko jaiak 2012",
    "kartelarenEgilea": "egilea",
    "xehetasunak": "xehetasunak",
    "egunak": [
    {
        "id": 1,
        "data": "2012-08-04",
        "izena": "",
        "deialdiak": [
        {
            "id": 0,
            "ordua": "18:00",
            "izenburua": "Andra Mariaren Elizara SANTUAREN JAITSIERA",
            "xehetasunak": "Done Errokeren baselizatik Andra Mariaren Elizara SANTUAREN JAITSIERA. Antolatzailea: Vera Cruz Kofradia. Autobusak:  17:30 eta 17:45etan: Elizako errotondako bus geltokian, 17:35 eta  17:50etan Aretxondo Tabernan."
        }
        ]
    },
    {
        "id": 2,
        "data": "2012-08-10",
        "izena": "Txupinazoa",
        "deialdiak": [
        {
            "id": 1,
            "ordua": "09:30-13:30",
            "izenburua": "Odol ematea",
            "xehetasunak": "Jaiei elkartasunez ekingo diegu odola emateko autobusean, Larrinagako oinezkoen aldean."
        },
        {
            "id": 2,
            "ordua": "11:00",
            "izenburua": "'AMURRIOKO HIRIBILDUA' PILOTA TXAPELKETAko Finalerdiak, Udal Pilotalekuan.",
            "xehetasunak": ""
        }
        ]
    }
    ]
}
    var jaia = Jaia.loadFromData(data);
    
    equal(jaia.izena(), data.izena, "Jaiaren izena");
    equal(jaia.kartelarenEgilea(), data.kartelarenEgilea, "Jaiaren kartelaren egilea");
    equal(jaia.xehetasunak(), data.xehetasunak, "Jaiaren xehetasunak");
    equal(jaia.egunak().length, 2, "2 egun dago");
    equal(jaia.egunak()[0].data(), "2012-08-04", "Egunaren data");
    equal(jaia.egunak()[0].jaia, jaia, "Egunaren jaiarekiko lotura");
    equal(jaia.egunak()[0].deialdiak().length, 1, "Lehenengo egunean deialdi bat dago");
    equal(jaia.egunak()[1].deialdiak().length, 2, "Bigarren egunean deialdi bi dago");
    equal(jaia.egunak()[0].deialdiak()[0]().id, 0, "Lehenengo deialdiaren IDa");
    equal(jaia.egunak()[0].deialdiak()[0]().ordua(), "18:00", "Lehenengo deialdiaren ordua");
});

test("Kudeaketaren datuen esportazioa", function() {
    var jaia = new Jaia();
    jaia.izena("jaiaren izena");
    jaia.kartelarenEgilea("kartelaren egilea");
    jaia.xehetasunak("Jaiaren xehetasunak");
    
    jaia.egunak = ko.observableArray();
    var eguna = new Eguna("2012-01-01", "egunaren izena", []);
    jaia.egunak.push(eguna);
    //var  deialdia = new Deialdi(0, deialdiaOrig.ordua, deialdiaOrig.izenburua, deialdiaOrig.xehetasunak);
    
    var data = jaia.exportJs();
    equal(data.izena, jaia.izena(), "Jaiaren izena");
    equal(data.kartelarenEgilea, jaia.kartelarenEgilea(), "Jaiaren kartelaren egilea");
    equal(data.xehetasunak, jaia.xehetasunak(), "Jaiaren xehetasunak");
    equal(jaia.egunak().length, 1, "1 egun dago");
    
}); 