const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "4c262e043c222412269b62322a66f704";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");

const renderCurrentWeather = (data) => {
  const weatherJSX = `
        <h1>${data.name}, ${data.sys.country}</h1>
        <div>
            <img alt='weather icon' src="http://openweathermap.org/img/w/${
              data.weather[0].icon
            }.png" />
            <span>${data.weather[0].main}</span>
            <span>${Math.round(data.main.temp)} ℃</span>
        </div>
        <div>
            <p>Humidity <span>${data.main.humidity} %</span></p>
            <p>Wind Speed <span>${data.wind.speed} m/s</span></p>
        </div>
    `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
    forecastContainer.innerHTML = ""
  data = data.list.filter((obj) => obj.dt_txt.endWith("12:00:00"));
  data.forEach((i) => {
    const forecastJsx = `
            <div>
                <img alt='wather icon' src="http://openweathermap.org/img/w/${
                  i.weather[0].icon
                }.png" />
                <h3>${DAYS[new Date(i.dt * 1000).getDay()]}</h3>
                <p>${Math.round(i.main.temp)}</p>
                <span>${i.weather[0].main}</span>
            </div>
        `;
    forecastContainer += forecastJsx;
  });
};

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

const getCurrentWeatherByCoordinates = async (lat, lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

const getForecastWeatherByName = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

const getForecastWeatherByCoordinates = async (lat, lon) => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("Please enter a city name..!");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getForecastWeatherByName(cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getCurrentWeatherByCoordinates(latitude, longitude);
  renderCurrentWeather(currentData);
  const forecastData = await getForecastWeatherByCoordinates(latitude, longitude)
  renderForecastWeather(forecastData)
};

const errorCallback = (position) => {
  console.log(error);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    alert("Your browser does not support geolocation");
  }
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
