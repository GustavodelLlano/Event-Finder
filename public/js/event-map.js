let map

function initMap() {
    drawMap()
    getEvent()

}

function drawMap() {

    const { Map } = google.maps
    const myLat = document.getElementById('lat').innerText
    const myLng = document.getElementById('lng').innerText

    map = new Map(
        document.getElementById('myMap'),
        {
            zoom: 6,
            center: { lat: 40.449316977382615, lng: - 3.699531260450334 },

        }
    )
}

function getEvent() {
    axios.get('/api/maps')
        .then(response => printEventMarkers(response.data))
        .catch(err => console.log(err))


}


function printEventMarkers(event) {

    const { Marker } = google.maps
    const eventName = document.getElementById('enventName').innerHTML

    event.forEach(element => {
        if (eventName === element.name) {
            new Marker({
                map,
                position: {
                    lat: element.location.coordinates[0],
                    lng: element.location.coordinates[1]
                },
                title: element.name
            })
        }

    });
}


