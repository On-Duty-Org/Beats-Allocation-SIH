async function forwardGeocoding(place) {
    let response = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + place + ".json?access_token=GEOCODING ACCESS TOKEN HERE")
    let data = await response.json();

    return data['features'][0].center;

}

async function getZones() {
    let response = await fetch("https://aman28.pythonanywhere.com/allocation");
    let data = await response.json()
    data.forEach(async u => {
        //fetch name from coordinates of alloted beats
        let allocate = await forwardGeocoding(u.zone_name);
        // create the popup
        var popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML('<br><strong>Name: </strong> :' + u.police_name + '<br><strong>Zone: </strong>' + u.zone_name)

        // create DOM element for the marker
        var el = document.createElement('div');
        el.id = 'marker';

        // create the marker
        new mapboxgl.Marker(el)
            .setLngLat(allocate)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
    })
    return data;
}

getZones();
