const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const nameOutput = document.querySelector(".name");
const timeOutput = document.querySelector(".time");
const dateOutput = document.querySelector(".date");
const icon = document.querySelector(".icon");
const condition = document.querySelector(".condition");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const cloud = document.querySelector(".cloud");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

// default city when the page loads
let cityInput = "Tokyo";

// add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // changed from default city to the clicked one
    cityInput = e.target.innerHTML;
    // function to fetches and displays data from the weather API
    fetchWeatherData();
    //fade out the app
    app.style.opacity = "0";
  });
});

// add submit event to the form
form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type a city name");
  } else {
    // changed from default city to the searched one
    cityInput = search.value;
    console.log(cityInput);
    // function that fetches and displays the data from weather API
    fetchWeatherData();
    // clear the input field
    search.value = "";
    // fade out the app
    app.style.opacity = "0";
  }
  // prevent the default behavior of the form
  e.preventDefault();
});
// function that returns a day of the week
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${year},${month},${day}`).getDay()];
}

// function that fetches and displays the data from the weather API
function fetchWeatherData() {
  // fetch the data and dynamically add the city name and template literals
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=a2c2c4a2cb6c40f094152332241203&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      // add the temparature and weather condition to the page
      temp.innerHTML = data.current.temp_c + "&#176";
      condition.innerHTML = data.current.condition.text;

      // add the name of the city to the page
      nameOutput.innerHTML = data.location.name;

      // get the time and date from the city and extract the day,year,month, time and stores into individual variables
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = date.substr(5, 2);
      const d = date.substr(8, 2);
      const time = date.substr(11);

      /*Reformat the date*/
      /*original format: 2024-10-09 17:53 /*
      /*New format: 17:53 - Friday 9, 10, 2024*/
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
      timeOutput.innerHTML = time;

      //       code: 1009
      // get the corresponding icon url from the weather and extract a part of it
      const iconId = data.current.condition.icon.substr(
        `//cdn.weatherapi.com/weather/64x64/`.length
      );

      // reformat the icon url to own folder path and display the icon to the page
      icon.src = `/assets/icons/${iconId}`;

      // add the cloud, humidity, wind details to the page
      cloud.innerHTML = data.current.cloud + "%";
      humidity.innerHTML = data.current.humidity + "%";
      wind.innerHTML = data.current.wind_kph + " km/h";

      // set default time of day
      let timeOfDay = "day";

      // change to night if it's night time
      if (!data.current.is_day == 1) {
        timeOfDay = "night";
      }

      // get the unique id for each weather condition
      const code = data.current.condition.code;

      // for clear weather
      if (code == 1000) {
        // set the clear background image when the weather is clear
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/clear.jpg)`;
        // change the button clr depend on if its day or night
        btn.style.background = `#e5ba92`;
        if (timeOfDay == "night") {
          btn.style.background = `#181e27`;
        }
      } // for cloudy weather
      else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        // set the cloudy background image when the weather is cloudy
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/cloudy.jpg)`;

        // change the btn clr depend on its day or night
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } // for rainy weather
      else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        // set the rainy background image when the weather is rainy
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/rainy.jpg)`;

        // change the btn clr depend on its day or night
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
          btn.style.background = "#325c80";
        }
      } // finally for snowy weather
      else {
        // set the snow background image when the weather is snowy
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/snowy.jpg)`;
      }

      app.style.opacity = "1";
    })
    .catch(() => {
      alert("City not found. Please enter a correct city name");
      app.style.opacity = "1";
    });
}

// call the function on page loads
fetchWeatherData();
