<template>
  <div id="app" v-if="Object.keys(studentData).length > 0">
    <a
      class="skipToMainContent"
      role="link"
      tabindex="1"
      @click="skipToContent()"
      href="javascript:void(0)"
    >Skip to main content</a>
    <div id="mainHeader" class="mainHeaderWrap">
      <WeatherInformation v-if="Object.keys(storeDetails).length > 0" :storeDetails="storeDetails"/>
      <hr />
      <Header :userInformation="studentData.user" :tenant="studentData.tenant" />
      <hr />
    </div>
    <nuxt />
    <div id="mainFooter">
      <Footer />
    </div>
  </div>
</template>


<script>
import WeatherInformation from '~/components/WeatherInformation'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import { setCookie, getCookie } from '../cookies.js'
import { mapGetters } from 'vuex'

export default {
  middleware: "auth",
  components: {
    WeatherInformation,
    Header,
    Footer
  },
  data() {
    return {
      studData: '',
      hasData: false
    }
  },
  beforeMount() {
    var cookie = getCookie('user')
    if (cookie) {

      this.fetchStudentData(this.$store.state.courseData.emailId)
      this.fetchCountryData()
      this.fetchStateData()
      this.fetchStoreData(this.$store.state.courseData.emailId)
      //this.fetchOrderedCourseMaterials(this.$store.state.courseData.emailId)
    } else {
      this.$router.push('/unauthorized')
    }
  },
  methods: {
    fetchStudentData(emailId) {
      this.$store.dispatch('courseData/fetchStudentData', emailId)
    },
    fetchCountryData() {
      this.$store.dispatch('courseData/fetchCountryData')
    },
    fetchStateData() {
      this.$store.dispatch('courseData/fetchStateData', {
        country: 'US',
        type: 'both'
      })
     //this.$store.dispatch('courseData/fetchStateData', { country: 'United States', type: 'billing' })
    },
    fetchStoreData(emailId) {
      this.$store.dispatch('courseData/fetchStoreData', emailId)
    },
    skipToContent() {
      const elmnt = document.getElementById('mainContent')
      elmnt.scrollIntoView()
      $('.contentHeader').focus()
    },
    // fetchOrderedCourseMaterials(emailId){
    //   this.$store.dispatch("courseData/fetchOrderedCourseMaterials", emailId);
    // }
   
   },
  computed:{
    ...mapGetters({
      studentData: 'courseData/getStudentData',
      storeDetails: 'courseData/getStoreDetails'
    })
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
