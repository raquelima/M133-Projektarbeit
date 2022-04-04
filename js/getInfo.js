const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

var date = moment();

$(() => {
    //getting all berufe for dropdown
    getBerufe();
    getKlassen(localStorage.getItem('beruf_id'));

})

$('#back').click(function () {
    $('#table').fadeOut();
    subtractWeek();
    getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
    $('#table').fadeIn();

});


$('#forward').click(function () {
    $('#table').fadeOut();
    addWeek();
    getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
    $('#table').fadeIn();
});

function getBerufe() {

    clearErrors();

    $.getJSON("http://sandbox.gibm.ch/berufe.php", function (berufe) {

        //appending each to the dropdown
        berufe.forEach(beruf => {
            $('#drop-berufsgrupe').append(`<option value='${beruf.beruf_id}'>${beruf.beruf_name}</option>`)
        });

        //checking localstorage for beruf_id
        if (localStorage.getItem('beruf_id') != null) {

            //if not empty then set dropdown value to the id saved in the localstorage
            $("#drop-berufsgrupe").val(localStorage.getItem('beruf_id'));
        }

    }).fail(function () { $('#berufsgruppe').prepend(`<div id="beruf-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed
  </div>`) });
}

function getKlassen(beruf_id) {

    clearErrors();

    //getting all klassen for dropdown
    $.getJSON(`http://sandbox.gibm.ch/klassen.php${beruf_id != null ? '?beruf_id=' + beruf_id : ''}`, function (klassen) {

        //empty dropdown with klassen
        $('#drop-klassenauswahl').empty();

        //add select option 
        $('#drop-klassenauswahl').append(`<option value='0'> - please select - </option>`)

        //appending each to the dropdown
        klassen.forEach(klasse => {
            $('#drop-klassenauswahl').append(`<option value='${klasse.klasse_id}'>${klasse.klasse_name}</option>`)
        });

        //if klasse_id saved in localstorage then
        if (localStorage.getItem('klasse_id') != null) {

            //set dropdown value to the id saved in the localstorage
            $("#drop-klassenauswahl").val(localStorage.getItem('klasse_id'));

            //get stundenplan for selected class 
            getTimeTable(localStorage.getItem('klasse_id'), getCurrentWeek());
        }

    }).fail(function () { $('#klassenauswahl').prepend(`<div id="klasse-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed
  </div>`) });
}

function getTimeTable(klasse_id, weekNumber) {

    clearErrors();

    //show table
    $('#table').css("display", "block");

    $('#week-picker').css("display", "block");

    $('#tbody').empty();

    $('#week-input').html(getCurrentWeek());

    $.getJSON(`http://sandbox.gibm.ch/tafel.php?klasse_id=${klasse_id}&woche=${weekNumber}&format=JSON`, function (data) {

        if (data == 0) {

            $('#tbody').html(`<div class="alert alert-info w-75">
            <strong>No data found!</strong>
          </div>`);

        } else {

            //fill table with new data
            data.forEach(element => {

                $('#tbody').append(`
                <tr id="${element.tafel_id}">
                    <td>${moment(element.tafel_datum).format('d. MMMM, YYYY')}</td>
                    <td>${days[element.tafel_wochentag]}</td>
                    <td>${moment(element.tafel_von, 'HH:mm').format('HH:mm')}</td>
                    <td>${moment(element.tafel_bis, 'HH:mm').format('HH:mm')}</td>
                    <td>${element.tafel_lehrer}</td>
                    <td>${element.tafel_longfach}</td>
                    <td>${element.tafel_raum}</td>
                </tr>`)
            })
        }
    }).fail(function () { $('body').append(`<div  id="table-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed.
  </div>`)});
}



//in case dropdown changes 
$("#drop-berufsgrupe").change(function () {

    //set beruf_id from selected option in localstorage
    localStorage.setItem('beruf_id', $('#drop-berufsgrupe').val());

    getKlassen(localStorage.getItem('beruf_id'));

});


//in case dropdown changes
$("#drop-klassenauswahl").change(function () {

    //set klasse_id from selected option in localstorage
    localStorage.setItem('klasse_id', $('#drop-klassenauswahl').val());

    //show table 
    $('#table').css("display", "block");

    date = moment();

    //getting all timetable data with the klasse_id from the klasse selected 
    getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
});

function getCurrentWeek() {
    return date.isoWeek() + "-" + date.year();
}

function addWeek() {
    date.add(1, 'w');
}

function subtractWeek() {
    date.subtract(1, 'w');
}

function getYear() {
    return date.year();
}

function clearErrors() {
    $('#beruf-error').remove();
    $('#klasse-error').remove();
    $('#table-error').remove();
}




