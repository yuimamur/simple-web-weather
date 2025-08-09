
//const req = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${MY_WEATHER_APIKEY}`;

function setWeatherIcon(humidity) {
    const icon = document.getElementById('weather-icon');
    if (humidity < 50) {
        icon.src = 'images/rainy.png'; // 低湿度
    } else {
        icon.src = 'images/cloudy.png'; // 高湿度
    }
}
document.getElementById("search").addEventListener("click", getWeather);
require('dotenv').config();


function getWeather() {
    //const MY_WEATHER_APIKEY = process.env.MY_WEATHER_APIKEY;
    const MY_WEATHER_APIKEY = "f43d5fBEBFAD1aA145Dsadafd306fA2c1FD61105D2"; //test
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    const result = document.getElementById("result");

    //if input field is empty

    if (isNaN(lat) || isNaN(lon)) {
        result.innerHTML = `<h3 class="msg">緯度と経度を入力してください。</h3>`;
        return;
    }
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${MY_WEATHER_APIKEY}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('API Response:', data);
            if (data.cod !== 200) {
                result.innerHTML = `<h3 class="msg">${data.message}</h3>`;
                return;
            }


            const weatherDescription = data.weather[0].description;
            const temperature = (data.main.temp - 273.15).toFixed(2); // ケルビンを摂氏に変換
            const humidity = data.main.humidity;
            const country = data.name;
            const weatherIcon = data.weather[0].icon; // アイコンコードを取得

//            document.getElementById('weather-description').textContent = `Weather: ${weatherDescription}`;
//            document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
//            document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
//            document.getElementById('country').textContent = `Country: ${country}`;
//            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
            result.innerHTML = `
                <div class="weather-details">
                    <p id="weather-description">天気: ${weatherDescription}</p>
                    <div class="yoko">
                        <p id="temperature">気温: ${temperature}°C</p>
                        <p id="humidity">湿度: ${humidity}%</p>
                        <p id="country">国名: ${country}</p>
                     </div>
                    <img id="weather-icon" src="http://openweathermap.org/img/wn/${weatherIcon}.png">
                </div>
            `;
            //setWeatherIcon(humidity);
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `<h3 class="msg">Error fetching weather data</h3>`;
        });
}



