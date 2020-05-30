import { getCookie } from '~/cookies.js'

let qs = require('qs')
export const auth = async context => {
  let cookie = getCookie('user', context)

  cookie = cookie ? (!process.server ? cookie : cookie.user) : ''
  if (cookie) {
    await fetchUser(cookie, context)
  }
}

const fetchUser = async (cookie, context) => {
  let userId

  let globalModules = []
  if (cookie) {
    let user = JSON.parse(cookie)
    userId = user.userId
  }
  const { $axios, store } = context
  let currentInstance = process.server
    ? process.env['API_STUDENT_SSR']
    : process.env['API_STUDENT']
  await $axios({
    url_instance: currentInstance,
    url_suffix: `/courses/student/getUserById?userId=${userId}`,
    method: 'get'
  })
    .then(res => {
      if (res && res.data) {
        let userEmail = res && res.data && res.data.email
        store.dispatch('courseData/assignUserId', userEmail)
      }
    })
    .catch(error => {
      console.log(error, "Can't get user by id")
    })

  return globalModules
}

export default auth
