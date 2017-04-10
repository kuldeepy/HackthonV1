// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var panorama;
var marker;
var infoWindow;
var loc;
var pos;
var nearbyMarkers = [];
var steps;
var lati = 42.3472379;
var longi = -71.163307;
var registerViewerEvents = false;

var destinations = [
      "Auckland",
      "Barcelona",
      "Beijing",
      "Berlin",
      "Boston",
      "Bournemouth",
      "Brighton",
      "Brisbane",
      "Bristol",
      "Cambridge",
      "Cape Town",
      "Chicago",
      "Dublin",
      "Eastbourne",
      "Honolulu",
      "London",
      "Los Angeles",
      "Madrid",
      "Malaga",
      "Manchester",
      "Miami Beach",
      "Munich",
      "New York",
      "Nice",
      "Oxford",
      "Paris",
      "Playa Tamarindo",
      "Rome",
      "San Diego",
      "San Francisco",
      "Santa Barbara",
      "Seattle",
      "Singapore",
      "St. Julians",
      "Sydney",
      "Tokyo",
      "Toronto",
      "Vancouver",
      "Washington D.C."
];

var map;

window.onload=function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
};

function initMap() {
    var markers = [];
    $('#userNavProgram').hide();
    $('#userNavCourse').hide();
    $('#infoContent').hide();
    loadPrograms();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lati, lng: longi },
        zoom: 6,
        mapTypeId: 'roadmap'
    });

    //Initialize autocomplete search 
    IntializeSearchDestination();

    $('.typeahead').on('typeahead:selected', function (evt, item) {
        var city = $('#search-textbox').val();
        if (city.length > 0) {
            clearMarkers();
            var geocoder = new google.maps.Geocoder();
            if (city === 'Beijing' || city === 'Boston' || city === 'Paris') {
                city = getDemoCordinates(city);
            }
            geocoder.geocode({ 'address': city }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lati = results[0].geometry.location.lat();
                    longi = results[0].geometry.location.lng();
                    loc = results[0].geometry.location;
                    markers.forEach(function (marker) {
                        marker.setMap(null);
                    });
                    markers = [];
                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();
                    var icon = {
                        //url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };
                    var marker = new google.maps.Marker({
                        map: map,
                        title: results[0].formatted_address,
                        animation: google.maps.Animation.DROP,
                        position: results[0].geometry.location
                    });
                    marker.addListener('click', showInfo);

                    // Create a marker for each place.
                    markers.push(marker);

                    if (results[0].geometry.viewport) {
                        bounds.union(results[0].geometry.viewport);
                    } else {
                        bounds.extend(results[0].geometry.location);
                    }
                    map.fitBounds(bounds);
                }
            });

            $('#search-textbox').val("");
        }

    });

    ////Initialize Viewer Evernts
    //if (!registerViewerEvents) {
    //    RegisterViewer();
    //    registerViewerEvents = true;
    //}

}

function getDemoCordinates(city) {
    switch (city) {
        case "Beijing":
            city = "Jiahua building Beijing, 100101, China";
            break;
        case "Boston":
            city = "200 Lake St, Brighton, MA 02135, USA";
            break;
        case "Paris":
            city = "56 Rue de Provence, 75009 Paris, France";
            break;
        default:
            city = city;
    }
    return city;
}

function drop() {
    clearMarkers();
    for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
}
//$(function () {
//    $('[data-toggle="tooltip"]').tooltip()
//})
function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
        }));
    }, timeout);
}

function loadPrograms() {
    var Pgmlst = ["--Select--", "ILS", "AY"];

    var sel = document.getElementById('Pgmlst');
    var fragment = document.createDocumentFragment();
    Pgmlst.forEach(function (pgm, index) {
        var opt = document.createElement('option');
        opt.innerHTML = pgm;
        opt.value = index;
        opt.title = pgm;
        fragment.appendChild(opt);
    });
    sel.appendChild(fragment);
}



function showInfo(marker) {
    $('#searchbox').hide();
    if (steps == undefined) {
        steps = document.getElementById('steps');
    }
    steps.style.display = 'block';
    infoWindow = new google.maps.InfoWindow({ map: map });
    if (infoWindow.map == null) {
        infoWindow.map = map;
    }

    infoWindow.setPosition(marker.latLng);

    //infoWindow.setContent(($('#steps')[0]).cloneNode(true));
    infoWindow.setContent(steps);

    google.maps.event.addListener(infoWindow, 'closeclick', closeMarker);
    google.maps.event.addListener(infoWindow, 'domready', DomReadyEvent);
}

function LoadCourses(SelectedProgram) {
    if (SelectedProgram === undefined || SelectedProgram === null) {
        return;
    }
    var lst;
    $('#CourseDDL option').remove();
    var PgmlstILS = ["--Select--", "EF INTENSIVE COURSE", "EF GENERAL", "ADDITIONAL LANGUAGE EXAMS", "EF INTERNSHIP EXEPRIENCE"];
    var PgmlstAY = ["--Select--", "LANGUAGE", "EXAM PREPARATION", "EF ADVANCED DIPLOMAS", "EF UNIVERSITY PREPARATION ABROAD"];
    if (SelectedProgram == "ILS") {
        lst = PgmlstILS;
    }
    if (SelectedProgram == "AY") {
        lst = PgmlstAY;
    }
    var sel = document.getElementById('CourseDDL');
    var fragment = document.createDocumentFragment();
    lst.forEach(function (pgm, index) {
        var opt = document.createElement('option');
        opt.innerHTML = pgm;
        opt.value = index;
        opt.title = pgm;
        fragment.appendChild(opt);
    });
    sel.appendChild(fragment);
}
function DomReadyEvent() {
    UpdateSelectedDestination();
}

function closeMarker() {
    $('#searchbox').show();
}

function UpdateSelectedDestination() {
    document.getElementById('SelectedDestination').innerHTML = "Welcome to EF  " + document.getElementById('search-textbox').value.toUpperCase() + " !!!";
}

function GoBack(slideto, slidefrom) {
    currentmenu = slideto;
    $('#' + slidefrom).hide();
    $('#' + slideto).show('slide', { direction: 'left' }, 600);
}

function Moreinfo() {
    var SelectedProgram = $('#Pgmlst option:selected').text();
    var SelectedCourse = $('#CourseDDL option:selected').text();
    //var e = document.getElementById('Pgmlst');
    //var SelectedProgram = e.options[e.selectedIndex].text
    if (SelectedProgram == "AY") {
        if (SelectedCourse == "LANGUAGE") {
            window.open('http://www.ef.com/aya/programmes/language-programmes/', "_blank");
        }
        else if (SelectedCourse == "EXAM PREPARATION") {
            window.open('http://www.ef.com/aya/programmes/exam-preparation-programmes/', "_blank");
        }
        else if (SelectedCourse == "EF ADVANCED DIPLOMAS") {
            window.open('http://www.ef.com/aya/programmes/advanced-diplomas/', "_blank");
        }
        else {
            window.open('http://www.ef.com/aya/programmes/university-preparation/', "_blank");
        }
    }
    else {
        window.open('http://www.ef.com/ils/destinations/united-states/boston/', "_blank");
    }
}

function Book() {
    var SelectedProgram = $('#Pgmlst option:selected').text();

    //var SelectedProgram = e.options[e.selectedIndex].text;
    if (SelectedProgram == "AY") {
        window.open('http://www.ef.com/aya/book-now/', "_blank");
    }
    else {
        window.open('http://www.ef.com/ils/book-now/', "_blank");


    }
}

function toggleBounce() {
    marker.setAnimation(google.maps.Animation.BOUNCE);
}

function TakeMeAround() {
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: loc,
        radius: 500,
        type: ['neighborhood']
    }, callback);
}

function LetsWalk() {

    document.getElementById('carousel-example-generic').style.display = "none";
    document.getElementById('streetViewContent').style.display = "block";

    var fenway = { lat: lati, lng: longi };
    map.center = fenway;
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('streetViewContent'), {
          position: fenway,
          pov: {
              heading: 34,
              pitch: 10
          }
      });

    map.setStreetView(panorama);
}

function OpenGallery() {
    document.getElementById('carousel-example-generic').style.display = "block";
    document.getElementById('streetViewContent').style.display = "none";
    infoWindow.setContent(($('#infoContent')[0]).cloneNode(true));
}

var currentmenu;

function SlideDiv(SelectedDropDown) {
    if (SelectedDropDown.value == "0") {
        return;
    }
    if (undefined == currentmenu || currentmenu == '') {
        currentmenu = 'userNavAge';
        if ($('#userNavAge').is(':hidden')) {
            $('#userNavAge').show('slide', { direction: 'right' }, 600);
        } else {
            $('#userNavAge').hide();
            $('#userNavProgram').show('slide', { direction: 'right' }, 600);

        }
    }
    else if (currentmenu == 'userNavAge') {
        currentmenu = 'userNavProgram';
        if ($('#userNavProgram').is(':hidden')) {
            $('#userNavAge').hide();
            $('#userNavProgram').show('slide', { direction: 'right' }, 600);
        } else {
            $('#userNavProgram').hide();
            var selected = $(SelectedDropDown).find('option:selected');
            LoadCourses(selected.text());
            $('#userNavCourse').show('slide', { direction: 'right' }, 600);
        }
    }
    else if (currentmenu == 'userNavProgram') {
        currentmenu = 'userNavCourse';
        if ($('#userNavCourse').is(':hidden')) {
            $('#userNavProgram').hide();
            var selected = $(SelectedDropDown).find('option:selected');
            LoadCourses(selected.text());
            $('#userNavCourse').show('slide', { direction: 'right' }, 600);
        } else {
            currentmenu = '';
            $('#userNavCourse').hide();
            $('#infoContent').show('slide', { direction: 'right' }, 600);
        }
    }
    else if (currentmenu == 'userNavCourse') {
        currentmenu = '';
        if ($('#infoContent').is(':hidden')) {
            $('#infoContent').show('slide', { direction: 'right' }, 600);
            $('#userNavCourse').hide();
        } else {

            $('#userNavProgram').hide();
            $('#infoContent').show('slide', { direction: 'right' }, 600);
            $('#streetViewContent').hide();
            $('#carousel-example-generic').hide();
        }
    }
};

function callback(results, status) {
    nearbyMarkers = [];
    clearMarkers();
    infoWindow.close();
    closeMarker();
    createMarker(loc);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i].geometry.location);
        }
        setMapOnAll(map);
    }
}

function createMarker(place) {

    var placeLoc = place;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    nearbyMarkers.push(marker);
}

function clearMarkers() {
    if (nearbyMarkers.length > 0) {
        for (var i = 0; i < nearbyMarkers.length; i++) {
            nearbyMarkers[i].setMap(null);
        }
    }
}
function setMapOnAll(map) {
    if (map !== undefined && map !== null) {
        for (var i = 0; i < nearbyMarkers.length; i++) {
            nearbyMarkers[i].setMap(map);
        }
        if (nearbyMarkers.length > 0) {
            var p = nearbyMarkers[0].getPosition();
            map.setCenter(p);
            nearbyMarkers[0].addListener('click', showInfo);
            map.setZoom(15);
        }

    }
}

function IntializeSearchDestination() {
    // Constructing the suggestion engine
    var dest = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: destinations
    });

    // Initializing the typeahead
    $('.typeahead').typeahead({
        hint: true,
        highlight: true, /* Enable substring highlighting */
        minLength: 1 /* Specify minimum characters required for showing suggestions */
    },
    {
        name: 'destinations',
        source: dest
    });
};
