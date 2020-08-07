const alertList = document.querySelector('.alerts');

// function to set attributes for different elements
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// Function that returns name of the place from latitude and longitude works only if the lat,long are exact and have more decimal places

async function reverseGeocoding(latitude, longitude) {
    let response = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + longitude + ',' + latitude + ".json?access_token=FORWARD GEOCODING API ACCESS TOKEN ");
    let data = await response.json()
    return data;
}

// Pulsing dot animation for live alerts
async function createDot() {
    var size = 200;

    let newDot = 'pulsingDot' + Math.random();
    newDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render: function () {
            var duration = 1000;
            var t = (performance.now() % duration) / duration;

            var radius = (size / 2) * 0.3;
            var outerRadius = (size / 2) * 0.7 * t + radius;
            var context = this.context;

            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fill();

            // draw inner circle
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // continuously repaint the map, resulting in the smooth animation of the dot
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    };
    return newDot;
}


// Function that renders alert on sidebar from firebase
async function renderAlert(doc) {
    count_id = 0;
    let li = document.createElement('li');
    setAttributes(li, { 'class': 'list-group-item dropdown', 'id': doc.id });

    let message = document.createElement('button');
    message.innerHTML = 'Alert: ' + doc.data().alert;
    setAttributes(message, { 'class': 'alertMessage mb-2 mr-2 dropdown-toggle btn btn-danger', 'data-toggle': 'dropdown' });
    let menu = document.createElement('div');
    setAttributes(menu, { 'class': 'dropdown-menu', 'tabIndex': -1 })

    let divider = document.createElement('div');
    setAttributes(divider, { 'class': 'dropdown-divider', 'tabIndex': -1 });

    let coordinates = document.createElement('li');

    coordinates.innerHTML = '<strong>Coordinates</strong>: ' + doc.data().location.latitude + ' ' + doc.data().location.longitude;
    setAttributes(coordinates, { 'class': 'dropdown-item', 'tabIndex': 0 });

    let time = document.createElement('li');
    time.innerHTML = '<strong>Time: </strong>: ' + new Date(doc.data().timeStamp).toUTCString().split(' ').slice(0, 5).join(' ');
    setAttributes(time, { 'class': 'dropdown-item', 'tabIndex': 0 });

    let uniqueId = document.createElement('li');
    uniqueId.innerHTML = '<strong>ID: </strong>' + doc.id;
    setAttributes(uniqueId, { 'class': 'dropdown-item', 'tabIndex': 0 });

    let nameOfSender = document.createElement('li');
    nameOfSender.innerHTML = '<strong>Name : </strong>' + doc.data().sender;
    setAttributes(nameOfSender, { 'class': 'dropdown-item', 'tabIndex': 0 });

    let locateOnMap = document.createElement('li');
    locateOnMap.textContent = 'Locate';
    setAttributes(locateOnMap, { 'class': 'dropdown-item font-weight-bold text-danger', 'tabIndex': 0 });

    menu.appendChild(uniqueId);
    menu.appendChild(divider);
    menu.appendChild(coordinates);
    menu.appendChild(divider.cloneNode(true));
    menu.appendChild(time);
    menu.appendChild(divider.cloneNode(true));
    menu.appendChild(nameOfSender);
    menu.appendChild(locateOnMap);
    li.appendChild(message);
    li.appendChild(menu);
    alertList.appendChild(li);

    var pulsingDot = await createDot();
    // Display alerts on map after click
    locateOnMap.addEventListener('click', async function () {

        var location = []
        latitude = doc.data().location.latitude;
        longitude = doc.data().location.longitude;
        location.push(longitude);
        location.push(latitude);
        reverseLatLong = await reverseGeocoding(latitude, longitude);

        // Message alerts on map
        mapAlert = '<strong>id: </strong>' + doc.id + '<br><strong>Name: </strong> :' + doc.data().sender + '<br><strong>Message: </strong>' + doc.data().alert + '<br><strong>Location: </strong>' + location + '<br><strong>Time: </strong>' + new Date(doc.data().timeStamp) + '<br><strong>Place Name: </strong>' + reverseLatLong.features[0].place_name.split(',');

        // API to set alert marker
        var popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(location)
            .setHTML(mapAlert)
            .addTo(map);
        // API to go to that location
        map.flyTo({
            center: location,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        let dynamicImage = 'img' + Date.now();

        // console.log(dynamicImage, await createDot());
        map.addImage(dynamicImage, pulsingDot, { pixelRatio: 2 });

        map.addSource(dynamicImage, {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': location
                        }
                    }
                ]
            }
        });
        map.addLayer({
            'id': dynamicImage,
            'type': 'symbol',
            'source': dynamicImage,
            'layout': {
                'icon-image': dynamicImage
            }
        });
    });
}
// Function that iterates over firebase
var docRef = db.collection('Emergency Mode').get().then((snapshot) => {

    snapshot.docs.forEach(doc => {
        renderAlert(doc);
    })
});
