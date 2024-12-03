const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit('send-location', { latitude, longitude }); // rend client side response or request or message
    },
    (error) => {
      console.log(err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0, // To have no caching
      timeout: 5000, // To have a 5 seconds timeout, indicates to check and update again after 5sec intervals
    }
  );
}

const map = L.map('map').setView([0, 0], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OpenstreetMap',
}).addTo(map);

// navigator is attached to window object.
// 3rd function to pass inside watchPosition is settings preferences

const markers = {};

socket.on('receive-location', (data) => {
  const { id, latitude, longitude } = data;

  map.setView([latitude, longitude], 14);

   if(markers[id]){
        markers[id].setLatLng([latitude, longitude])
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
});


socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);  // remove from map
        delete markers[id]  // delete from markers obj
    }
})