const studentInstance = process.env.API_STUDENT;
const authInstance = process.env.API_AUTH;
 
export default $axios => ({
  //GENERIC
  getUserDetails(email) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getUser?email=${email}`
    });
  },
  getUserFdcItems(email) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getUserFdcItems?email=${email}`
    });
  },
  getUserFdcItemsTerms(email,term) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getUserFdcItems?email=${email}&id=${term}`
    });
  },
  getCountryList() {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: "/courses/student/getCountryList"
    });
  },
  getStateList(params) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getStateList?countryCode=${params.countryName}`,
      data: params
    });
  },
  getStoreDetails(email) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getStoreDetails?email=${email}`
    });
  },
  createOrder(params) {
    return $axios({
      url_instance: studentInstance,
      method: "post",
      url_suffix: "/courses/student/createOrder",
      data: params
    });
  },
  fetchOrderedCourseMaterials(params) {
    console.log(params);
    return $axios({
      url_instance: studentInstance,
      method: "post",
      url_suffix: "/courses/student/getOrderedCourseMaterials",
      data: params
    });
  },
  getTimelineTracker(params) {
    console.log(params);
    return $axios({
      url_instance: studentInstance,
      method: "post",
      url_suffix: "/courses/student/getTimeLineTracker",
      data: params
    });
  },
   getTaxCalculations(params){
    console.log(params);
    return $axios({
      url_instance: studentInstance,
      method: "post",
      url_suffix: "/courses/student/calculateShippingAndTax",
      data: params
    });
  },
  fetchShippingMethods(params){
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/deliveryInfoForAStoreAndCountry?bncStoreId=${params.bncStoreId}&country=${params.country}`
    });
  },
  getCurrentWeather(params) {
    return $axios({
      url_instance: studentInstance,
      method: "get",
      url_suffix: `/courses/student/getCurrentWeather?city=${params.storeCity}&state=${params.storeState}`
    });
  },
//AUTH IMPLEMENTATION
  
  authenticateUser(params) {
    return $axios({
      url_instance: authInstance ,
      method: "post",
      url_suffix: "/api/users/un/fdc/authenticate",
      data: params
    });
  }
});
