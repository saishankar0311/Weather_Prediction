const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const forecastSection = document.querySelector('.forecast');
const forecastContainer = document.querySelector('.forecast-container');

search.addEventListener('click', () => {
    const APIKey = '7bbb453ed256f4cff4b6c5a668399ee2';
    const city = document.querySelector('.search-box input').value;
    if (city === '') return;

    // Current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod !== 200 || !json.weather || !json.weather[0]) {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                forecastSection.style.display = 'none';
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                case 'Mist':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            // Set background based on weather
            const weatherMain = json.weather[0].main.toLowerCase();
            const body = document.body;
            switch (weatherMain) {
                case 'clear':
                    body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
                    break;
                case 'clouds':
                    body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
                    break;
                case 'rain':
                    body.style.background = "linear-gradient(to right, #314755, #26a0da)";
                    break;
                case 'snow':
                    body.style.background = "linear-gradient(to right, #e6dada, #274046)";
                    break;
                case 'thunderstorm':
                    body.style.background = "linear-gradient(to right, #141e30, #243b55)";
                    break;
                case 'haze':
                case 'mist':
                case 'fog':
                    body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
                    break;
                default:
                    body.style.background = "linear-gradient(135deg, #06283D, #256D85)";
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = 'auto';
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
            forecastSection.style.display = 'none';
        });

    // 5-day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(res => res.json())
        .then(data => {
            forecastContainer.innerHTML = '';
            const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));

            daily.forEach(day => {
                const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const icon = day.weather[0].icon;
                const temp = Math.round(day.main.temp);
                const desc = day.weather[0].main;

                const card = document.createElement('div');
                card.classList.add('forecast-card');
                card.innerHTML = `
                    <p class="forecast-date">${date}</p>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                    <p class="forecast-temp">${temp}°C</p>
                    <p class="forecast-desc">${desc}</p>
                `;
                forecastContainer.appendChild(card);
            });

            forecastSection.style.display = 'block';
        })
        .catch(err => {
            console.error("Error fetching forecast:", err);
            forecastSection.style.display = 'none';
        });
});
