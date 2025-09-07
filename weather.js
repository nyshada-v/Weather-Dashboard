const apiKey = 'e66a69f0b147245e922601ca1506cb81'; // Replace with your OpenWeatherMap API key

// Function to fetch coordinates from Geocoding API
async function getCoordinates(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${apiKey}`;
    
    try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        
        if (data.length === 0) {
            alert("Location not found. Try a nearby town or correct spelling.");
            return null;
        }

        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
    }
}

// Function to fetch weather data using coordinates
async function fetchWeatherData(city) {
    const coordinates = await getCoordinates(city);
    if (!coordinates) return;

    const { lat, lon } = coordinates;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=7&appid=${apiKey}`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod !== "200") {
            alert("Weather data not found. Try another location.");
            return;
        }

        const temperatures = data.list.map(item => item.main.temp);
        const timeStamps = data.list.map(item => item.dt_txt);

        renderWeatherChart(timeStamps, temperatures);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to render the weather graph using Chart.js
let weatherChart;

function renderWeatherChart(timeStamps, temperatures) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeStamps,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Temperature (°C)' } }
            }
        }
    });
}

// Function to handle user input and update weather data
function updateWeather() {
    const city = document.getElementById("cityInput").value;
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
}

// Fetch initial weather data for default city
fetchWeatherData("Hyderabad");
