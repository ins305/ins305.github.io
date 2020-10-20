const api = {
  key: "be271747b817f9e330659ee0fc2b5625",
  baseurl: "https://api.openweathermap.org/data/2.5/",
  language: "de"
}

const timeapi = {
  apikey:"IWJ9MX4X7K3A",
  base: "http://api.timezonedb.com/v2.1/get-time-zone",
  format: "json",
  by: "position",
}
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

var now;
var nulltime;
var timediff;
var diff;

function setQuery(evt){
  if(evt.keyCode == 13){
    getResults(searchbox.value);
  }
}

function getResults(query){
  fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}&lang=${api.language}`)
  .then(weather => {
    return weather.json();
  }).then(displayResults);
}

function displayResults(weather){
  if(weather.sys != undefined){
    console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector(".current .temp");
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_des = document.querySelector(".current .weather");
    weather_des.innerText = `${weather.weather[0].description}`;

    let high_low = document.querySelector(".current .high-low");
    high_low.innerText = `${Math.round(weather.main.temp_min)}°C/ ${Math.round(weather.main.temp_max)}°C`

    timeOfTheDay(weather);
  }
}

function dateBuilder(d){
  let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  let days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date}. ${month} ${year}`;
}

function timeOfTheDay(weather){
  now = new Date();
  nulltime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  timediff = now.valueOf() - nulltime.valueOf();
  var sunrise = new Date(weather.sys.sunrise*1000);
  var sunset = new Date(weather.sys.sunset*1000);
    if(nulltime.valueOf() >= sunrise.valueOf() && nulltime.valueOf() < sunset.valueOf()){
      daytime = true;
    }
    else{
      daytime = false;
    }
    setBackground(weather);
}


function setBackground(weather){
  let weathername = weather.weather[0].main;
  if(weathername == "Snow"){
     /*werchojansk*/
     if(daytime == true){
       background = 'url(./data/schnee.jpg)';
     }
     else{
       background = 'url(./data/schneenacht.jpg)';
     }
  }
  else if(weathername == "Clouds"){
    if(daytime == true){
      background = 'url(./data/wolken.jpg)';
    }
    else{
      background = 'url(./data/wolkennacht.jpg)';
    }
  }
  else if(weathername == "Clear"){
    if(daytime == true){
      background = 'url(./data/klar.jpg)';
    }
    else{
      background = 'url(./data/klarnacht.jpg)';
    }
  }
  else if(weathername == "Thunderstorm"){
    if(daytime == true){
      background = 'url(./data/gewitter.jpg)';
    }
    else{
      background = 'url(./data/gewitternacht.jpg)';
    }
  }

  else if(weathername == "Rain" || weathername == "Drizzle"){
    if(daytime == true){
      background = 'url(./data/regen.jpg)';
    }
    else{
      background = 'url(./data/regennacht.jpg)';
    }
  }
  else{
    if(daytime == true){
      background = 'url(./data/nebel.jpg)';
    }
    else{
      background = 'url(./data/nebelnacht.jpg)';
    }
  }
  document.body.style.backgroundImage = background;
  getTimenew(weather);
}

function getTime(weather){
  let latitude = weather.coord.lat;
  let longitude = weather.coord.lon;
  fetch(`${timeapi.base}?key=${timeapi.apikey}&format=${timeapi.format}&by=${timeapi.by}&lat=${latitude}&lng=${longitude}&fields=timestamp`)
  .then(timezone => {
    return timezone.json();
  }).then(setTime);
}

function setTime(timezone){
  console.log(timezone);
  var localTime = new Date(timezone.timestamp * 1000 - timediff);
  var clock = document.querySelector(".current .time");
  clock.innerText = localTime.getHours() + ":" + localTime.getMinutes();
}


function getTimenew(weather){
  diff = weather.timezone * 1000;
  var localTime = new Date(nulltime.valueOf() + diff);
  var clock = document.querySelector(".current .time");
  var hour = timenum(localTime.getHours());
  var minute = timenum(localTime.getMinutes());
  var second = timenum(localTime.getSeconds());
  clock.innerText = hour + ":" + minute + ":" + second;
}
getResults("Esthal");

function timeupdate(){
  updatenulltime();
  var localTime = new Date(nulltime.valueOf() + diff);
  var clock = document.querySelector(".current .time");
  var hour = timenum(localTime.getHours());
  var minute = timenum(localTime.getMinutes());
  var second = timenum(localTime.getSeconds());
  clock.innerText = hour + ":" + minute + ":" + second;
}

function updatenulltime(){
  now = new Date();
  nulltime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}
var t = setInterval(timeupdate, 1000);

function timenum(k) {
  if (k < 10) {
    return "0" + k;
  }
  else {
    return k;
  }
}
