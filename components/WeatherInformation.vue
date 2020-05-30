<template>
   <div class="row mainHeader">
        <div class="col-lg-4 logo">
            <h1>{{storeDetails.storeInfo.name}}</h1>
        </div>
        <div class="col-lg-4 text-right">
            <div class="row float-right">
              <span class="weatherStyle">Current Weather on Campus</span>
              <div class="tempStyle"  v-if="Object.keys(weatherResponse).length > 0">
                  {{Math.round(weatherResponse.temp.main.temp)}} °F
                  <img typeof="foaf:Image" class="img-responsive" :src="'http://openweathermap.org/img/w/'+weatherResponse.temp.weather[0].icon+'.png'" alt="Partly cloudy" title="Partly cloudy" width="50" height="45">
              </div>
            </div>
        </div>
        <div class="col-lg-4"></div>
    </div>
</template>

<script>
export default {
    name:'WeatherInformation',
    data(){
        return{
            weatherResponse : {}
        }
    },
    created(){

    },
    async mounted(){
      let  _this = this;  
      
      let storeCity = this.storeDetails.storeInfo.storeAddress.city;
      let storeState = this.storeDetails.storeInfo.storeAddress.state;
      
        const params = {
            storeCity: storeCity,
            storeState: storeState
        }
        await this.$apis.baseService
            .getCurrentWeather(params)
            .then(function(response) {
                console.log(response);
                _this.weatherResponse = {...response.data};
            }).catch(errors => {
                console.log(errors);
            });
    },
    methods:{

    },
    props : ['storeDetails']
}
</script>

<style>

</style>
