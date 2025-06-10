
//const req = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${MY_WEATHER_APIKEY}`;

function setWeatherIcon(humidity) {
    const icon = document.getElementById('weather-icon');
    if (humidity < 50) {
        icon.src = 'images/rainy.png'; // 低湿度のアイコン
    } else {
        icon.src = 'images/cloudy.png'; // 高湿度のアイコン
    }
}
document.getElementById("search").addEventListener("click", getWeather);
require('dotenv').config();


function getWeather() {
    const MY_WEATHER_APIKEY = process.env.MY_WEATHER_APIKEY;
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




//
//document.getElementById('coordinates-form').addEventListener('submit', function (e) {
//    e.preventDefault();
//    const latInput = document.getElementById('lat-input');
//    const lonInput = document.getElementById('lon-input');
//    const lat = parseFloat(latInput.value);
//    const lon = parseFloat(lonInput.value);
//
//    const MY_WEATHER_APIKEY = "e95aa28a8261b5084561dab6946047fc"; // ここにAPIキーを設定
//
//    const req = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${MY_WEATHER_APIKEY}`;
//
//    fetch(req)
//        .then((response) => response.json())
//        .then((data) => {
//            console.log('API Response:', data);
//            const weatherDescription = data.weather[0].description;
//            const temperature = (data.main.temp - 273.15).toFixed(2); // ケルビンを摂氏に変換
//            const humidity = data.main.humidity;
//            const country = data.name;
//            const weatherIcon = data.weather[0].icon; // アイコンコードを取得
//
//            // 受け取った値に応じて要素を更新
//            document.getElementById('weather-description').textContent = `Weather: ${weatherDescription}`;
//            document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
//            document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
//            document.getElementById('country').textContent = `Country: ${country}`;
//            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
//
//           // setWeatherIcon(humidity);
//        })
//        .catch((error) => {
//            console.error(error);
//        });
//});