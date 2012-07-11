"use strict";
ko.bindingHandlers.mlist = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var a = ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        if ($(element).hasClass('ui-listview')) {
            try {
                //this listview has already been initialized, so refresh it
                $(element).listview("refresh");
            } catch (e) {
                $(element).listview();
            }
        }
        return a;
    },
    'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var a = ko.bindingHandlers.foreach.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        if ($(element).hasClass('ui-listview')) {
            //this listview has already been initialized, so refresh it
            $(element).listview("refresh");
        }
        return a;
    }
};

ko.bindingHandlers.pageWith = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers["with"].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var t, value, valueUnwrapped;

        t = ko.bindingHandlers["with"].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);// First get the latest data that we're bound to
        value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        valueUnwrapped = ko.utils.unwrapObservable(value);
        if (valueUnwrapped !== null) {
            $(element).page().page('destroy').page();
        }
        return t;
    }
};

$(document).bind("pagebeforechange", function (event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData)
    ? data.options.pageData
    : null;
});
$("#eguna").live("pagebeforeshow", function (e, data) {
    var egunaId, eguna;
    if ($.mobile.pageData && $.mobile.pageData.id) {
        egunaId = parseInt($.mobile.pageData.id);
        eguna = ko.utils.arrayFirst(window.viewModel.egunak(), function (item) {
            return egunaId === item.id;
        });
        window.viewModel.hautatuEguna(eguna);
    }
});
$("#deialdia").live("pagebeforeshow", function (e, data) {
    var deialdiId, deialdia;
    if ($.mobile.pageData && $.mobile.pageData.id) {
        deialdiId = parseInt($.mobile.pageData.id);
        deialdia = window.viewModel.findDeialdiById(deialdiId);
        window.viewModel.hautatuDeialdia(deialdia);
    }
});
$('#jaia').live('pageshow', function (event, ui) {
    window.viewModel.hautatutakoEguna(null);
    window.viewModel.hautatutakoDeialdia(null);
    window.viewModel.calculateHautatutakoDeialdiak();
});


AppJaia.init();
$(function () {
    ko.applyBindings(window.viewModel);
});
