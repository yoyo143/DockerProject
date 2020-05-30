<template>
  <div class="mainContent">
    <div class="middleContentDiv">
      <p>{{errorMessage}}</p>
      <div v-if="showLoader" class="courseModalLoader">
        <Loader />
      </div>
    </div>
  </div>
</template>
<script>
import Loader from '~/components/Loader'
import { setCookie, getCookie } from '../cookies.js'
export default {
  name: 'sso',
  components: {
    Loader
  },
  middleware: "auth",
  layout: 'nonAuthView',
  data() {
    return {
      showLoader: true,
      validUser: null,
      errorMessage: ''
    }
  },
  mounted() {
    let queryParams = JSON.parse(
      new Buffer(this.$route.query.data, 'base64').toString('ascii')
    )
    this.fetchUserDetails(queryParams)
  },
  methods: {
    async fetchUserDetails(params) {
      let queryParams = params
      let expiresAt = new Date(queryParams.refreshTokenExpiresAt)
      const data = {
        tenantId: queryParams.tenantId,
        userId: queryParams.userId,
        refreshToken: queryParams.refreshToken,
        accessToken: queryParams.accessToken,
        refreshTokenExpiresAt: queryParams.refreshTokenExpiresAt,
        firstLogin: queryParams.firstLogin || false
      }
      this.$store.dispatch('courseData/assignUserId', queryParams.username)
      setCookie('user', JSON.stringify(data), {
        expires: expiresAt
      })
      if (queryParams.userId && queryParams.tenantId) {
        await this.$apis.baseService
          .getUserDetails(queryParams.username)
          .then(async res => {
            if (res.data) {
              this.validUser = res.data
              this.$store.dispatch('courseData/assignUserId', res.data.email)
              await this.authoriseUser(queryParams)
            } else {
              this.showLoader = false
              this.errorMessage =
                'Error occurred authenticating user. Please try after sometime.'
            }
          })
          .catch(error => {
            this.showLoader = false
            this.errorMessage =
              'Error occurred authenticating user. Please try after sometime.'
            console.error(error)
          })
      } else {
        this.showLoader = false
        this.errorMessage =
          'Error occurred authenticating user. Please try after sometime.'
      }
    },
    async authoriseUser(queryParams) {
      if (this.validUser) {
        let user = {}
        let cookie = getCookie('user')
        if (cookie) {
          user = JSON.parse(cookie)
        }
        let expiresAt = new Date(user.refreshTokenExpiresAt)

        let tenantId = this.validUser.tenantId
        let userEmail = this.validUser.email
        let userId = this.validUser.id
        let currentRole = 'student'
        let accessToken = user.accessToken
          ? user.accessToken
          : queryParams.accessToken
        let refreshToken = user.refreshToken
          ? user.refreshToken
          : queryParams.refreshToken
        let refreshTokenExpiresAt = user.refreshTokenExpiresAt
          ? user.refreshTokenExpiresAt
          : queryParams.refreshTokenExpiresAt
        const data = {
          tenantId,
          userId,
          currentRole,
          accessToken,
          refreshToken,
          refreshTokenExpiresAt
        }
        await setCookie('user', JSON.stringify(data), {
          expires: expiresAt
        })

        this.$store.dispatch('courseData/assignUserId', this.validUser.email)

        this.routeUser()
        this.showLoader = false
      } else {
        this.showLoader = false
        this.errorMessage =
          'Error occurred authenticating user. Please try after sometime.'
      }
    },

    routeUser(currentTier) {
      window.location.replace('/courses/')
    }
  }
}
</script>
