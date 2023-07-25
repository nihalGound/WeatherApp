const API_KEY = "168771779c71f3d64106d8a88376808a";
const userWeatherBtn = document.querySelector("[user_Btn]");
const searchCityBtn = document.querySelector("[search_btn]");
const searchContainer = document.querySelector('[searchContaineer]');
const userWeatContainer = document.querySelector('[user-weather-container]');
const grantContainer =document.querySelector("[grant-container]");
const notFound = document.querySelector('[notFoundContainer]');
const loading = document.querySelector('[loadingDisplay]');
let CurrentTab= userWeatherBtn;
CurrentTab.classList.add('currentTab');
getSessionStorage();
function switchTab(newTab){
    if(CurrentTab!=newTab){
        CurrentTab.classList.remove('currentTab');
        CurrentTab = newTab;
        CurrentTab.classList.add('currentTab');

        //assume user clicked on search weaher button
        if(!searchContainer.classList.contains('active')){
            searchContainer.classList.add('active');
            userWeatContainer.classList.remove('active');
            grantContainer.classList.remove('active');
            notFound.classList.remove('active');
        }
        else{
            searchContainer.classList.remove('active');
            userWeatContainer.classList.remove('active');
            notFound.classList.remove('active');
            getSessionStorage();
        }

    }
}
userWeatherBtn.addEventListener('click',()=>{
    switchTab(userWeatherBtn);
})
searchCityBtn.addEventListener('click',()=>{
    switchTab(searchCityBtn);
})
function getSessionStorage(){
    const localcoordinates = sessionStorage.getItem('userCoordinates');
    if(localcoordinates){
        const coordinates = JSON.parse(localcoordinates);
        fetchWeather(coordinates);
    }
    else{
        grantContainer.classList.add('active');
    }
}
const grantAceessBtn =document.querySelector('[grantAccessBtn]');
grantAceessBtn.addEventListener('click',()=>{
    getUserLocation();
})
function getUserLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(SetPostion);
    }
    else{
        alert("Geolocation is not supported in your browser");
    }
}
function SetPostion(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("UserCoordinates",JSON.stringify(userCoordinates));
    loading.classList.add('active');
    fetchWeather(userCoordinates);
}
async function fetchWeather(coordinates){
    const {lat,lon}=coordinates;
    grantContainer.classList.remove('active');
    
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if(!data.sys){
            throw data;
        }
        loading.classList.remove('active');
        userWeatContainer.classList.add('active');
        notFound.classList.remove('active');
        renderWeather(data);
    }
    catch(err){
        notFound.classList.add('active');
    }
}
function renderWeather(data){
    const city = document.querySelector('[City]');
    const flag = document.querySelector('[country-flag]');
    const desc = document.querySelector('[desciption]');
    const weathImg = document.querySelector('[weather-image]');
    const temperature = document.querySelector('[temperature]');
    const windspeed = document.querySelector('[windspeed]');
    const humidity = document.querySelector('[humidity]');
    const clouds = document.querySelector('[clouds]');
    city.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weathImg.src =`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = data?.main?.temp;
    windspeed.innerText = data?.wind?.speed;
    humidity.innerText = data?.main?.humidity;
    clouds.innerText = data?.clouds?.all;
}
const searchInput = document.querySelector('[searchInput]');
searchContainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value===""){
        return ;
    }
    else{
        fetchSearchWeather(searchInput.value);
        searchInput.value = "";
    }
});


async function fetchSearchWeather(inputValue){
    userWeatContainer.classList.remove('active');
    loading.classList.add('active');
    notFound.classList.remove('active');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if(!data.sys){
            throw data;
        }
        renderWeather(data);
        loading.classList.remove('active');
        userWeatContainer.classList.add('active');
        notFound.classList.remove('active');
    } catch (err) {
        loading.classList.remove('active');
        userWeatContainer.classList.remove('active');
        notFound.classList.add('active');
    }
}
