let map
const eventId = document.getElementById('eventId').innerHTML

function initMap() {
    drawMap()
    getEvent(eventId)
}

function drawMap() {

    const { Map } = google.maps

    axios.get(`/api/maps/${eventId}`)
    .then( response => {

        const lat = response.data.location.coordinates[0]
        const lng = response.data.location.coordinates[1]
        
        map = new Map(
        document.getElementById('myMap'),
        {
            zoom: 10,
            center: { lat: lat, lng: lng },

        })
    })
    

}

function getEvent(eventId) {
    axios.get(`/api/maps/${eventId}`)
        .then(response => printEventMarkers(response.data))
        .catch(err => console.log(err))
}



function printEventMarkers(event) {

    const { Marker } = google.maps
    const eventName = document.getElementById('eventName').innerHTML

  
            new Marker({
                map,
                position: {
                    lat: event.location.coordinates[0],
                    lng: event.location.coordinates[1]
                },
                title: event.name
            })
        }

 