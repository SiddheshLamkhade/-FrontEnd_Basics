document.addEventListener('DOMContentLoaded', () => {
    const vehicleForm = document.getElementById('vehicle-form');
    const timelineContainer = document.getElementById('timeline-container');
    const mapContainer = document.getElementById('map-container');
    let events = JSON.parse(localStorage.getItem('schedules')) || [];

    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vehicleId = document.getElementById('vehicle-id').value;
        const startTime = new Date(document.getElementById('start-time').value);
        const endTime = new Date(document.getElementById('end-time').value);

        if (startTime < endTime) {
            events.push({ vehicleId, startTime, endTime });
            localStorage.setItem('schedules', JSON.stringify(events));
            renderTimeline();
            vehicleForm.reset();
        } else {
            alert('End time must be after start time.');
        }
    });

    function renderTimeline() {
        timelineContainer.innerHTML = '';

        const minTime = Math.min(...events.map(event => event.startTime));
        const maxTime = Math.max(...events.map(event => event.endTime));
        const timelineWidth = timelineContainer.offsetWidth;
        const timeRange = maxTime - minTime;

        events.forEach(event => {
            const startPos = (event.startTime - minTime) / timeRange * timelineWidth;
            const endPos = (event.endTime - minTime) / timeRange * timelineWidth;
            const width = endPos - startPos;

            const timelineEvent = document.createElement('div');
            timelineEvent.classList.add('timeline-event');
            timelineEvent.style.left = ${startPos}px;
            timelineEvent.style.width = ${width}px;
            timelineEvent.innerText = ${event.vehicleId}: ${event.startTime.toLocaleTimeString()} - ${event.endTime.toLocaleTimeString()};

            timelineContainer.appendChild(timelineEvent);
        });
    }

    // Initialize Google Maps
    function initMap() {
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });

        // Example vehicle locations
        const vehicles = [
            { id: 'V1', position: { lat: -34.397, lng: 150.644 } },
            { id: 'V2', position: { lat: -35.397, lng: 149.644 } }
        ];

        vehicles.forEach(vehicle => {
            new google.maps.Marker({
                position: vehicle.position,
                map: map,
                title: vehicle.id
            });
        });
    }

    initMap();
    renderTimeline();
});