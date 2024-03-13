const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const nameOutput = document.querySelector(".name");
const timeOutput = document.querySelector(".time");
const dateOutput = document.querySelector(".date");
const icon = document.querySelector(".icon");
const conditionOutput = document.querySelector(".condition");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".Humidity");
const windOutput = document.querySelector(".wind");

// Default city when the page loads
let cityInput = "Japan";

// Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // Changed from default city to the clicked one
    cityInput = e.target.innerHTML;
    /* Function that fetches and displays all the data from the weather API*/
    fetchWeatherData();
    // Fade out the app (simple animation)
    app.style.opacity = "1";
  });
});

// Add submit event to the form
form.addEventListener("submit", (e) => {
  /* If the inout  field is empty throw an error*/
  if (search.value.length == 0) {
    alert("Please type in a city name");
  } else {
    /* change from default city to the one written in the input field*/
    cityInput = search.value;
    /* function that fetches and displays all the data from the weather API*/
    fetchWeatherData();
    // remove all text from the input field
    search.value = "";
    // fade out the app (simple animation)
    app.style.opacity = "1";
  }
  // Prevent the dafault behaviour of the form
  e.preventDefault();
});

/* Function that returns a day of the week
(monday, tuesday,friday...) from a date(12 02 2021)*/
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

/* Function that fetches and displays the data from the weather API */
function fetchWeatherData() {
  /*fetch the data and dynamically add the city name and template literals */
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=a2c2c4a2cb6c40f094152332241203&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      /*Adding the temparature and weather condition to the page */
      temp.innerHTML = data.current.temp_c + "&#176;";
      conditionOutput.innerHTML = data.current.condition.text;
      /*Get the date and time from the city and extract the day, month, year and time into individual variables */
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);
      /*Reformat the date into something more appeal and add it to the page */
      /*original format: 2021-10-09 17:53 */
      /*New format: 17:53 - Friday 9, 10, 2021*/
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d},${m} ${y}`;
      timeOutput.innerHTML = time;
      /*add the name of the city into the page */
      nameOutput.innerHTML = data.location.name;
      /*get the corresponding icon url for the weather and extract a part of it */
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      /*Reformat the icon url to your own local folder path and add it to the page */
      icon.src = "./icons/" + iconId;
      console.log(icon.src);

      // add the weather details to the page
      cloudOutput.innerHTML = data.current.cloud + "%";

      humidityOutput.innerHTML = data.current.humidity = "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      // set default time of day
      let timeOfDay = "day";
      // get the unique id for each weather condition
      const code = data.current.condition.code;

      //change the night if its night time in the city
      if (!data.current.is_day) {
        timeOfDay = "night";
      }
      if (code == 1000) {
        /*set the background image is clear if the weather is clear */
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/clear.jpg)`;

        /*change the button bg color depending on if its day or night */
        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        /*same thing for cloudy weather */
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
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
        // and rain
      } else if (
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
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
          btn.style.background = "#325c80";
        }
        // and finally ... snow/
      } else {
        app.style.backgroundImage = `url(/assets/images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
        if (timeOfDay == "night") {
          btn.style.background = "#1b1b1b";
        }
      }
      // fade in the page once all is done
      app.style.opacity = "1";
    })
    /**if the user types a city that doesn't exost, throw an alert */
    .catch(() => {
      //   alert("city not found, please try again");
      app.style.opacity = "1";
    });
}
// call the function on page load
fetchWeatherData();
// fade out in the page
app.style.opacity = "1";
