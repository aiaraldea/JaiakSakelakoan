var TestData = TestData || {};

TestData.dataToSort = {
    "izena": "jaiak 2012",
    "egunak": [
    {
        "id": 1,
        "data": "2012-08-10",
        "izena": "Txupinazoa",
        "deialdiak": [
        {
            "id": 1,
            "ordua": "09:30-13:30",
            "izenburua": "A"
        },
        {
            "id": 2,
            "ordua": "11:00",
            "izenburua": "B"
        },
        {
            "id": 3,
            "ordua": "12:00",
            "izenburua": "C"
        },
        {
            "id": 4,
            "ordua": "19:00",
            "izenburua": "D"
        },
        {
            "id": 5,
            "ordua": "00:00",
            "izenburua": "E"
        },
        {
            "id": 6,
            "ordua": "02:00",
            "izenburua": "F"
        }
        ]
    }
    ]
};


test("Deialdien ordena", function() {
    var jaia = Jaia.loadFromData(TestData.dataToSort);
    var eguna = jaia.egunak()[0];
    eguna.sort();
    
    equal(eguna.deialdiak()[0].id, 1, "8 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 2, "8 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 6, "8 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(0);
    equal(eguna.deialdiak()[0].id, 5, "0 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 6, "0 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 4, "0 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(1);
    equal(eguna.deialdiak()[0].id, 6, "1 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 1, "1 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 5, "1 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(0);
    equal(eguna.deialdiak()[0].id, 5, "0 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 6, "0 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 4, "0 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(2);
    equal(eguna.deialdiak()[0].id, 6, "2 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 1, "2 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 5, "2 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(3);
    equal(eguna.deialdiak()[0].id, 1, "3 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 2, "3 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 6, "3 - Lehehenengo deialdia");
    
    eguna.hasieraOrdua(2);
    equal(eguna.deialdiak()[0].id, 6, "2 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[1].id, 1, "2 - Lehehenengo deialdia");
    equal(eguna.deialdiak()[5].id, 5, "2 - Lehehenengo deialdia");
});