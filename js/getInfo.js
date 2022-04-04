//array to display week name in table
const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

var date = moment();

$(() => {

    //gets all berufe and appends them to dropdown
    getBerufe();

    //gets klassen, in case there is a beruf_id in localstorage it filters them and appends to dropdown 
    getKlassen(localStorage.getItem('beruf_id'));
})

//to go back one week
$('#back').click(function () {

    $('#table').fadeOut();
    subtractWeek();
    getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
    $('#table').fadeIn();

});

//to go one week forward
$('#forward').click(function () {

    $('#table').fadeOut();
    addWeek();
    getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
    $('#table').fadeIn();
});

function getBerufe() {

    //clear any existing errors
    clearErrors();

    //getting all berufe for dropdown
    $.getJSON("http://sandbox.gibm.ch/berufe.php", function (berufe) {

        //removes blank space in the dropdown
        berufe = berufe.filter(x => !!x.beruf_name);

        //appending each to the dropdown
        berufe.forEach(beruf => {
            $('#drop-berufsgrupe').append(`<option value='${beruf.beruf_id}'>${beruf.beruf_name}</option>`)
        });

        //checking localstorage for beruf_id
        if (localStorage.getItem('beruf_id') != null) {

            //if not empty then set dropdown value to the id saved in the localstorage
            $("#drop-berufsgrupe").val(localStorage.getItem('beruf_id'));
        }
        //show warning in case request fails
    }).fail(function () {
        $('#berufsgruppe').prepend(`<div id="beruf-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed
  </div>`)
    });
}

function getKlassen(beruf_id) {

    //clear any existing errors
    clearErrors();

    //get klassen by beruf_if, in case there is none get all klassen
    $.getJSON(`http://sandbox.gibm.ch/klassen.php${beruf_id != null ? '?beruf_id=' + beruf_id : ''}`, function (klassen) {

        //empty dropdown
        $('#drop-klassenauswahl').empty();

        //add select option 
        $('#drop-klassenauswahl').append(`<option value='0'> - please select - </option>`)

        //appending each klasse to the dropdown
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
        //show warning in case request fails
    }).fail(function () {
        $('#klassenauswahl').prepend(`<div id="klasse-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed
  </div>`)
    });
}

function getTimeTable(klasse_id, weekNumber) {

    //clear any existing errors
    clearErrors();

    //show table
    $('#table').css("display", "block");

    //show week-picker
    $('#week-picker').css("display", "block");

    //empty table body
    $('#tbody').empty();

    //update week-picker
    $('#week-input').html(getCurrentWeek());

    //getting time table by klasse id and week number
    $.getJSON(`http://sandbox.gibm.ch/tafel.php?klasse_id=${klasse_id}&woche=${weekNumber}&format=JSON`, function (data) {

        //in case there is no data
        if (data == 0) {

            $('#tbody').html(`<div class="alert alert-info ">
            <strong>No data found!</strong>
          </div>`);

        } else {

            //fill table with filtered data
            data.forEach(element => {

                $('#tbody').append(`
                <tr id="${element.tafel_id}">
                    <td>${element.tafel_datum}</td>
                    <td>${days[element.tafel_wochentag]}</td>
                    <td>${moment(element.tafel_von, 'HH:mm').format('HH:mm')}</td>
                    <td>${moment(element.tafel_bis, 'HH:mm').format('HH:mm')}</td>
                    <td>${element.tafel_lehrer}</td>
                    <td>${element.tafel_longfach}</td>
                    <td>${element.tafel_raum}</td>
                </tr>`)
            })
        }
        //show warning in case request fails
    }).fail(function () {
        $('body').append(`<div  id="table-error" class="alert alert-danger">
    <strong>Warning!</strong> Request failed.
  </div>`)
    });
}



//in case dropdown changes 
$("#drop-berufsgrupe").change(function () {
    //set beruf_id from selected option in localstorage
    localStorage.setItem('beruf_id', $('#drop-berufsgrupe').val());

    $('#drop-klassenauswahl').val('').change();
    $('#tbody').empty();
    localStorage.removeItem('klasse_id');

    getKlassen(localStorage.getItem('beruf_id'));

});

//in case dropdown changes
$("#drop-klassenauswahl").change(function () {
    if ($('#drop-klassenauswahl').val()) {
        //set klasse_id from selected option in localstorage
        localStorage.setItem('klasse_id', $('#drop-klassenauswahl').val());

        //show table 
        $('#table').css("display", "block");

        //so that we still get the current week
        date = moment();

        getTimeTable($('#drop-klassenauswahl').val(), getCurrentWeek());
    } else {
        $('#tbody').empty();
    }
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




