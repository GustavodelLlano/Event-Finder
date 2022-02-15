let map

function initMap() {
    drawMap()
    getEvent()

}

function drawMap() {

    const { Map } = google.maps
    // const lat = document.getElementById('lat')
    // const lng = document.getElementById('lng')


    map = new Map(
        document.getElementById('myMap'),
        {
            zoom: 10,
            center: { lat: 40.3, lng: -3.7 },

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
