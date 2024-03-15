document.addEventListener('DOMContentLoaded', function () {
    // Load trips from local storage on page load
    loadTrips();
    // Add event listener to the form for adding trips
    document.getElementById('tripForm').addEventListener('submit', function (event) {
        event.preventDefault();
        addTrip();
    });
    // Initialize the search button event listener
    document.getElementById('searchButton').addEventListener('click', searchTrips);
});

// Function to add a new trip
function addTrip() {
    const date = document.getElementById('tripDate').value;
    const time = document.getElementById('tripTime').value;
    const place = document.getElementById('tripPlace').value;
    const thingsToDo = document.getElementById('thingsToDo').value;

    if (date && time && place && thingsToDo) {
        const newTrip = {
            date: date,
            time: time,
            place: place,
            thingsToDo: thingsToDo,
        };

        // Get existing trips from local storage
        let trips = getTripsFromLocalStorage();

        // Check if the trip already exists based on the date
        const existingTripIndex = trips.findIndex(trip => trip.date === date);

        if (existingTripIndex !== -1) {
            // If the trip already exists, update it
            trips[existingTripIndex] = newTrip;
            alert('Trip updated successfully!');
        } else {
            // If the trip does not exist, add it to the array
            trips.push(newTrip);
            alert('Trip added successfully!');
        }

        // Save the updated trips array to local storage
        saveTrips(trips);

        // Reload trips and clear the form
        loadTrips();
        clearForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to save trips to local storage
function saveTrips(trips) {
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Function to load trips from local storage and display them
function loadTrips() {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    // Get trips from local storage
    const trips = getTripsFromLocalStorage();

    // Display trips
    trips.forEach(function (trip) {
        const tripItem = document.createElement('div');
        tripItem.classList.add('trip-item');
        tripItem.innerHTML = `
            <strong>Date:</strong> ${trip.date}<br>
            <strong>Time:</strong> ${trip.time}<br>
            <strong>Place:</strong> ${trip.place}<br>
            <strong>Things to Do:</strong> ${trip.thingsToDo}<br>
            <button onclick="editTrip('${trip.date}')">Edit</button>
            <button onclick="deleteTrip('${trip.date}')">Delete</button>`;
        tripList.appendChild(tripItem);
    });
}

// Function to edit a trip
function editTrip(date) {
    // Get existing trips from local storage
    const trips = getTripsFromLocalStorage();

    // Find the trip with the specified date
    const selectedTrip = trips.find(trip => trip.date === date);

    if (selectedTrip) {
        // Populate the form with the selected trip's details
        document.getElementById('tripDate').value = selectedTrip.date;
        document.getElementById('tripTime').value = selectedTrip.time;
        document.getElementById('tripPlace').value = selectedTrip.place;
        document.getElementById('thingsToDo').value = selectedTrip.thingsToDo;
    } else {
        alert('Trip not found.');
    }
}

// Function to delete a trip
function deleteTrip(date) {
    // Get existing trips from local storage
    let trips = getTripsFromLocalStorage();

    // Remove the trip with the specified date
    trips = trips.filter(trip => trip.date !== date);

    // Save the updated trips array to local storage
    saveTrips(trips);

    // Reload trips
    loadTrips();
}

// Function to search trips based on the entered place
function searchTrips() {
    const searchPlace = document.getElementById('searchPlace').value.toLowerCase();

    // Get trips from local storage
    const trips = getTripsFromLocalStorage();

    // Filter trips based on the entered place
    const filteredTrips = trips.filter(trip => trip.place.toLowerCase().includes(searchPlace));

    // Display filtered trips
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    filteredTrips.forEach(function (trip) {
        const tripItem = document.createElement('div');
        tripItem.classList.add('trip-item');
        tripItem.innerHTML = `
            <strong>Date:</strong> ${trip.date}<br>
            <strong>Time:</strong> ${trip.time}<br>
            <strong>Place:</strong> ${trip.place}<br>
            <strong>Things to Do:</strong> ${trip.thingsToDo}<br>
            <button onclick="editTrip('${trip.date}')">Edit</button>
            <button onclick="deleteTrip('${trip.date}')">Delete</button>`;
        tripList.appendChild(tripItem);
    });
}

// Function to get trips from local storage
function getTripsFromLocalStorage() {
    const tripsString = localStorage.getItem('trips');
    return tripsString ? JSON.parse(tripsString) : [];
}

// Function to clear the form after adding or editing a trip
function clearForm() {
    document.getElementById('tripForm').reset();
}
