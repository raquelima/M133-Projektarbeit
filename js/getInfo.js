$.getJSON("http://sandbox.gibm.ch/berufe.php", function (berufe) {

    berufe.forEach(beruf => {
        $('#drop-berufsgrupe').append(`<option value='${beruf.beruf_id}'>${beruf.beruf_name}</option>`)
    });

    if (localStorage.getItem('beruf_id') != null) {
        $("#drop-berufsgrupe").val(localStorage.getItem('beruf_id'));
    }

});

$.getJSON("http://sandbox.gibm.ch/klassen.php", function (klassen) {

    klassen.forEach(klasse => {
        $('#drop-klassenauswahl').append(`<option value='${klasse.klasse_id}'>${klasse.klasse_name}</option>`)
    });

    if (localStorage.getItem('klasse_id') != null) {
        $("#drop-klassenauswahl").val(localStorage.getItem('klasse_id'));
    }

});

$("#drop-berufsgrupe").change(function () {

    localStorage.setItem('beruf_id', $('#drop-berufsgrupe').val());

    $('#drop-klassenauswahl').empty();

    $('#drop-klassenauswahl').append(`<option value='0'> - please select - </option>`)

    $.getJSON(`http://sandbox.gibm.ch/klassen.php?beruf_id=${$('#drop-berufsgrupe').val()}&format=JSON`, function (klassen) {

        klassen.forEach(klasse => {
            $('#drop-klassenauswahl').append(`<option value='${klasse.klasse_id}'>${klasse.klasse_name}</option>`)
        });
    });


});


$("#drop-klassenauswahl").change(function () {

    localStorage.setItem('klasse_id', $('#drop-klassenauswahl').val());

    $.getJSON(`http://sandbox.gibm.ch/tafel.php?klasse_id=${$('#drop-klassenauswahl').val()}&format=JSON`, function (data) {

        data.forEach(element => {
            $('#table').html(`<table class="table">
                <tr>
                    <th>Datum</th>
                    <th>Wochentag</th>
                    <th>Von</th>
                    <th>Bis</th>
                    <th>Lehrer</th>
                    <th>Fach</th>
                    <th>Raum</th>

                </tr>
                <tr>
                    <td>${element.tafel_datum}</td>
                    <td>${element.tafel_wochentag}</td>
                    <td>${element.tafel_von}</td>
                    <td>${element.tafel_bis}</td>
                    <td>${element.tafel_lehrer}</td>
                    <td>${element.tafel_fach}</td>
                    <td>${element.tafel_raum}</td>
                </tr>
            </table>`)
        });
    });
});

