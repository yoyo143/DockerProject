<template>
    <div class="row subHeader">
        <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <h2>
            <img :src="tenant && tenant.urlLogo" height="auto" width="183px" :alt="tenant && tenant.name"/>
          </h2>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6 welcomeText">
          <h3>Welcome, {{userInformation.firstName}}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name:'Header',
    data(){
        return{

        }
    },
    props:['userInformation','tenant'],
    created(){

    },
    mounted(){

    },
    methods:{
        reDirect(){
            this.$router.go()
        }
    }
}
</script>

<style>
    a{
        cursor: pointer;
    }
</style>
