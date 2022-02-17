let map
const eventId = document.getElementById('eventId').innerHTML

function initMap() {
    drawMap()
    getEvent(eventId)
}

function drawMap() {

    const { Map } = google.maps
    const lat = document.getElementById('lat')
    const lng = document.getElementById('lng')


    map = new Map(
        document.getElementById('myMap'),
        {
            zoom: 10,
            center: { lat: 4, lng: -3 },

        }
    )
}

function getEvent(eventId) {
    axios.get(`/api/maps/${eventId}`)
        .then(response => printEventMarkers(response.data))
        .catch(err => console.log(err))
}



function printEventMarkers(event) {

    const { Marker } = google.maps
    const eventName = document.getElementById('eventName').innerHTML

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
