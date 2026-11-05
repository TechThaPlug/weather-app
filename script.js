const weatherForm = document.querySelector("#weatherForm");
const locationInput = document.querySelector("#locationInput");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");
const weather = document.querySelector("#weather");
const toggle = document.querySelector("#toggle");

const locationName = document.querySelector("#locationName");
const conditions = document.querySelector("#conditions");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");

const celsiusButton = document.querySelector("#celsiusButton");
const fahrenheitButton = document.querySelector("#fahrenheitButton");

const apiKey = "YOUR_VISUAL_CROSSING_API_KEY";

let weatherData = null;
let unit = "celsius";

function processWeatherData(data) {
  const today = data.days[0];

  return {
    location: data.resolvedAddress,
    conditions: today.conditions,
    tempF: today.temp,
    feelsLikeF: today.feelslike,
    humidity: today.humidity,
    windSpeed: today.windspeed,
  };
}

function showWeather() {
  const temp =
    unit === "celsius"
      ? ((weatherData.tempF - 32) * 5) / 9
      : weatherData.tempF;

  const feelsLike =
    unit === "celsius"
      ? ((weatherData.feelsLikeF - 32) * 5) / 9
      : weatherData.feelsLikeF;

  const unitLabel = unit === "celsius" ? "°C" : "°F";

  locationName.textContent = weatherData.location;
  conditions.textContent = weatherData.conditions;
  temperature.textContent = `${Math.round(temp)}${unitLabel}`;
  feelsLike.textContent = `Feels like: ${Math.round(feelsLike)}${unitLabel}`;
  humidity.textContent = `Humidity: ${weatherData.humidity}%`;
  wind.textContent = `Wind: ${weatherData.windSpeed} mph`;
}

async function getWeather(location) {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  weather.classList.add("hidden");
  toggle.classList.add("hidden");

  try {
    const url =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      encodeURIComponent(location) +
      "?key=" +
      apiKey +
      "&unitGroup=us&include=days,current";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather not found");
    }

    const data = await response.json();
    weatherData = processWeatherData(data);

    showWeather();

    weather.classList.remove("hidden");
    toggle.classList.remove("hidden");
  } catch (err) {
    error.textContent = "Could not find that location.";
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

weatherForm.addEventListener("submit", event => {
  event.preventDefault();

  const location = locationInput.value.trim();

  if (location === "") {
    error.textContent = "Please enter a location.";
    error.classList.remove("hidden");
    return;
  }

  getWeather(location);
});

celsiusButton.addEventListener("click", () => {
  unit = "celsius";
  showWeather();
});

fahrenheitButton.addEventListener("click", () => {
  unit = "fahrenheit";
  showWeather();
});