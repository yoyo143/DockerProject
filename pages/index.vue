<template>
  <Welcome v-if="Object.keys(studentData).length > 0" :studentData="studentData" />
</template>

<script>
import Logo from '~/components/Logo.vue'
import Welcome from '~/components/Welcome.vue'
import JWT from 'jsonwebtoken'
import { mapGetters } from 'vuex'
import { getCookie } from '../cookies.js'

export default {
  components: {
    Logo,
    Welcome
  },
  data() {
    return {
      showChevronUp: false,
      included: true,
      notIncluded: true
    }
  },
  beforeRouteEnter(to, from, next) {
    let _this = this
    next(vm => {
      let userEmail = vm.$store.state.courseData.emailId
      vm.$root.loading = true
      if (from.name == 'success') {
        // vm.$store.dispatch('courseData/assignUserId', userEmail)
        vm.$store.dispatch('courseData/fetchStudentData', userEmail)
        vm.$store.dispatch('courseData/fetchCountryData')
        vm.$store.dispatch('courseData/fetchStateData', {
          country: 'US',
          type: 'both'
        })
        vm.$store.dispatch('courseData/fetchStoreData', userEmail)
      }
    })
  },
  created() {
    let emailId = ''
    var cookie = getCookie('user')
    if (!cookie) {
      this.$router.push('/unauthorized')
    }
  },
  methods: {},
  computed: {
    ...mapGetters({
      studentData: 'courseData/getStudentData'
    })
  }
}
</script>
