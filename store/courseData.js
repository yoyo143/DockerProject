import axios from 'axios';
import { email } from 'vuelidate/lib/validators';




const state = () => ({
   studentData:{},
   countryList:[],
   shippingModes:[],
   shippingStateList:[],
   billingStateList:[],
   emailId:'',
   mapKey:'',
   successOrderObj :{
       
   },
   taxCalculation:{
    bncStoreId:'',
    shippingType:'',
    fdcItems:{
        enrollment:[

        ]
    },
    GMItems:[

    ],
    deliveryInfo:{
        shipping:{
            shipModeId:null,
            addressLine1:null,
            addressLine2:null,
            city:null,
            state:'State',
            zipcode:null,
            country:'United States',
        },
        storePickup:{
            storePickupLocationId:null,
        }
    }
    
   },
   order:{ 
    fdcOrderId:'',
    company:'', 
    storeNumber:'',
    unitNumber:'',  
    emailId:'a@b.com',
    shippingFirstName:null,
    shippingType:'',
    shippingMethod:'',
    shippingModeDescription:"Standard Shipping $7.50",
    shippingLastName:null,
    shippingAddress1:null,
    shippingAddress2:null,
    shippingCity:null,
    shippingPhoneNumber:null,
    shippingState:'State',
    shippingZipCode:null,
    shippingCountry:'US',
    storePickupLocationId:'',
    isBillingSameAsShipping:true,
    billingAddress1:null,
    billingAddress2:null,
    billingCity:null,
    billingPhoneNumber:null,
    billingState:'State', 
    billingZipCode:null,
    billingCountry:'US',
    termCode:null,
    termYear:null,
    selectedMaterials : [

    ],
    fdcItems:{
        enrollment:[

        ]
    },
    GMItems:[

    ]
   },
   upsellItems: [],
   storeDetails : {},
   alreadyOrderedItems:[],
   alreadyOrderedParams:{
       termYear:"",
       termCode:"",
       company:"",
       storeNumber:"",
       unitNumber:""
   },
   timelineTrackerParams:{
        startDate:"",
        endDate:"",
        registrationDate:"",
        censusDate:""
   },
   timeLineTracker:{},
   taxInformation:{}
})

const getters = {
    getStudentData: state => state.studentData,
    getSisUserId: state => state.sisUserId,
    getOrderObj: state => state.order,
    getStoreDetails: state => state.storeDetails,
    getUserEmail: state => state.emailId
}

const mutations = {
    assignOrderEnrollments(state,value){
        console.log(state.order);
        state.order.fdcItems.enrollment = [...value];
    },
    assigngmItemsOrderEnrollments(state,value){
        state.order.GMItems = [...value];
    },
    assignUserId(state,value){
        state.emailId = value;
        state.order.emailId = value;
    },
    assignStudentData(state,value){
        state.studentData = {...value};
        state.alreadyOrderedParams.storeNumber = state.studentData.fdcItems[0].enrollment.store;
        state.alreadyOrderedParams.termCode = state.studentData.terms[0].termCode;
        state.alreadyOrderedParams.termYear = state.studentData.terms[0].termYear;
        state.alreadyOrderedParams.unitNumber = state.studentData.fdcItems[0].enrollment.unit;
        state.alreadyOrderedParams.company = state.studentData.fdcItems[0].enrollment.company;
        

        state.order.storeNumber = state.studentData.fdcItems[0].enrollment.store;
        state.order.unitNumber = parseInt(state.studentData.fdcItems[0].enrollment.unit);
        state.order.company = state.studentData.fdcItems[0].enrollment.company;
        state.order.storePickupLocationId = parseInt(state.studentData.shippingModeAndStorePickUp.storePickup.storeLocationId);
        state.order.termCode = state.studentData.terms[0].termCode;
        state.order.termYear = parseInt(state.studentData.terms[0].termYear);
        state.order.shippingMethod = state.studentData.shippingModeAndStorePickUp.shippingMode[0].shipModeId;

        state.timelineTrackerParams.startDate = state.studentData.terms[0].startDate;
        state.timelineTrackerParams.endDate = state.studentData.terms[0].endDate;
        state.timelineTrackerParams.registrationDate = state.studentData.terms[0].registrationDate;
        state.timelineTrackerParams.censusDate = state.studentData.terms[0].censusDate;
        
        state.taxCalculation.bncStoreId = state.studentData.fdcItems[0].enrollment.store;
        state.taxCalculation.deliveryInfo.storePickup.storePickupLocationId = parseInt(state.studentData.shippingModeAndStorePickUp.storePickup.storeLocationId);
        // state.order.bncStoreId = state.studentData.fdcItems[0].enrollment.store;
    },
    setShippingType(state,value){
        state.order.shippingType = value;
        state.taxCalculation.shippingType = value;
    },
    assignCountryData(state,value){
        state.countryList = [...value]
        },
    assignShippingStateData(state,value){
        state.shippingStateList = [...value]
    },
    assignBillingStateData(state,value){
        state.billingStateList = [...value]
    },
    assignStoresData(state, value){
      state.storeDetails = {...value}
    },
    assignOrder(state,value){
        console.log(value);
        state.order = Object.assign({},value);
    },
    assignSuccessOrder(state,value){
        state.successOrderObj = {...value};
    },
    assignEmptyObj(state,value){
        state.order = {...value};
    },
    assignUpsellItems(state, value){
      state.upsellItems = [...value];
    },
    assignMapKey(state,value){
        state.mapKey = value.key;
    },
    assignOrderedCourseMaterials(state,value){
        state.alreadyOrderedItems = [...value];
    },
    assignTimelineTracker(state,value){
        state.timeLineTracker = {...value.timeLineTracker};
    },
    assignTaxCalOrderEnrollments(state, value){
        state.taxCalculation.fdcItems.enrollment = [...value];
    },
    assignTaxCalGmItemsOrderEnrollments(state, value){
        state.taxCalculation.GMItems = [...value];
    },
    assignTaxInfo(state, value){
        state.taxInformation = {...value};
        state.taxInformation.message.shippingCost = '390';
        state.taxInformation.message.tax = '134';
    },
    pushCourseMaterial(state, value){
        let index = '';
        console.log(state.order.fdcItems);
        state.order.fdcItems["enrollment"].forEach((val,id)=>{
            if(val.enrollmentId == value.enrollmentId){
                index = state.order.fdcItems.enrollment.indexOf(val);
            }
        })

        state.order.fdcItems["enrollment"][index]["courseMaterialList"].push(value.courseMaterial);
    },
    removeOrderEnrollmentsCourseMaterials(state, value){
        console.log(value);
        value.enrollment[value.enrollmentIndex].courseMaterialList.splice(value.courseMaterialIndex,1);
        state.order.fdcItems.enrollment = [...value.enrollment];
    },
    removeTaxOrderEnrollmentsCourseMaterials(state, value){
        console.log(value);
        value.enrollment[value.enrollmentIndex].courseMaterialList.splice(value.courseMaterialIndex,1);
        state.taxCalculation.fdcItems.enrollment = [...value.enrollment];
    },    
    assignTaxCalculationFields(state,value){
            state.taxCalculation.deliveryInfo.shipping.addressLine1 = value.shippingAddress1;
            state.taxCalculation.deliveryInfo.shipping.addressLine2 = value.shippingAddress2;
            state.taxCalculation.deliveryInfo.shipping.country = value.shippingCountry;   
            state.taxCalculation.deliveryInfo.shipping.state = value.shippingState;
            state.taxCalculation.deliveryInfo.shipping.city = value.shippingCity;   
            state.taxCalculation.deliveryInfo.shipping.zipcode = parseInt(value.shippingZipCode); 
            state.taxCalculation.deliveryInfo.shipping.shipModeId = value.shippingMethod;
        // state.taxCalculation = {...value};
    },
    assignShippingModes(state,value){
        state.shippingModes = [...value.message.shippingMode];
    }    
}

const actions = {
    assignOrder({commit},value){
        commit('assignOrder',value);
    },
    assignTaxCalculationFields({commit},obj){
        commit('assignTaxCalculationFields',obj);
    },
    assignUserId({commit},emailId){
        commit('assignUserId',emailId)
    },
    async fetchStudentData({commit,dispatch},emailId){
        let  _this = this;
        await this.$apis.baseService
        .getUserFdcItems(emailId)
        .then(function(res){
            commit('assignStudentData',res.data);
            commit('assignMapKey',res.data)
            dispatch('getTimelineTracker');
            dispatch('fetchOrderedCourseMaterials')
            dispatch('fetchShippingMethods',{bncStoreId:'',country:'US'})
            
        })
        .catch(error => {
            console.log(error);
            // console.log("Error--------------" + error);
            this.$router.push('/error');
        });
    },

    async fetchStudentDataOnTermChange({commit,state},term){
        let  _this = this;
        await this.$apis.baseService
        .getUserFdcItemsTerms(state.email, term)
        .then(function(res){
            commit('assignStudentData',res.data)
        })
        .catch(error => {
            // this.$router.push('/error');
        });
    },
    async fetchCountryData({commit,state}){
        let  _this = this;
        await this.$apis.baseService
        .getCountryList()
        .then(function(res){
            commit('assignCountryData',res.data)
        })
        .catch(error => {
            this.$router.push('/error');
        });
    },
    async fetchStateData({commit,state},countryObj){
        let  _this = this;
        const params= {
            "countryName": countryObj.country
        };
        await this.$apis.baseService
        .getStateList(params)
        .then(function(res){
            if(countryObj.type == 'shipping'){
                commit('assignShippingStateData',res.data)
            }
            else if(countryObj.type == 'billing'){
                commit('assignBillingStateData',res.data)
            }
            else{
                commit('assignShippingStateData',res.data)
                commit('assignBillingStateData',res.data)
            }            
        })
        .catch(error => {
            this.$router.push('/error');
        });
    },

    async fetchStoreData({commit}, emailId){
      let  _this = this;
      await this.$apis.baseService
      .getStoreDetails(emailId)
      .then(function(res){
          commit('assignStoresData', res.data)
      })
      .catch(error => {
        this.$router.push('/error');
       });
    },
    async fetchOrderedCourseMaterials({commit,state},emailId){
        let fetchOrderedMaterialsParams={
            storeNumber : state.studentData.fdcItems[0].enrollment.store,
            unitNumber : state.studentData.fdcItems[0].enrollment.unit,
            company : state.studentData.fdcItems[0].enrollment.company,
            termCode : state.studentData.terms[0].termCode,
            termYear : state.studentData.terms[0].termYear
        }
        await this.$apis.baseService
        .fetchOrderedCourseMaterials(fetchOrderedMaterialsParams)
        .then(function(res){
            console.log(res);
            commit('assignOrderedCourseMaterials',res.data)
        })
        .catch(error => {
            this.$router.push('/error');
        });
    },
    async getTimelineTracker({commit,state},emailId){
        let timelineObj = {
            startDate: state.studentData.terms[0].startDate,
            endDate: state.studentData.terms[0].endDate,
            censusDate: state.studentData.terms[0].censusDate,
            registrationDate: state.studentData.terms[0].registrationDate
        };
        
        await this.$apis.baseService
        .getTimelineTracker(timelineObj)
        .then(function(res){
            console.log(res);
            commit('assignTimelineTracker',res.data)
        })
        .catch(error => {
            this.$router.push('/error');
        });
    },
    async createOrder({state,commit},orderObj){
        // if(orderObj.orders.shippingZipCode!='' && orderObj.orders.shippingZipCode!=null){
        //     orderObj.orders.shippingZipCode = parseInt(orderObj.orders.shippingZipCode);
        // }

        // if(orderObj.orders.billingZipCode!='' && orderObj.orders.billingZipCode!=null){
        //     orderObj.orders.billingZipCode = parseInt(orderObj.orders.billingZipCode);
        // }
        await this.$apis.baseService
        .createOrder(orderObj)
        .then((res)=>{
            commit('assignSuccessOrder',res.data);
            commit('assignUpsellItems', res.data.upsellItems)
            this.$router.push('/success');
        })
        .catch(error => {
            this.$router.push('/error');
        });
    },
    async fetchShippingMethods({state,commit},countryObj){
        if(countryObj.bncStoreId == ''){
            countryObj.bncStoreId =  state.studentData.fdcItems[0].enrollment.store;
        }
        await this.$apis.baseService
        .fetchShippingMethods(countryObj)
        .then((res)=>{
            console.log(res);
            commit('assignShippingModes',res.data);
        })
        .catch(error => {
            // console.log(error)
            this.$router.push('/error');
        });
    },
    emptyObj({commit}){
        var obj = {
            bncStoreId:'',
    fdcOrderId:'',
    company:'',   
    emailId:'a@b.com',
    shippingFirstName:null,
    shippingType:'',
    shippingMethod:'',
    shippingModeDescription:"Standard Shipping $7.50",
    shippingLastName:null,
    shippingAddress1:null,
    shippingAddress2:null,
    shippingCity:null,
    shippingPhoneNumber:null,
    shippingState:'State',
    shippingZipCode:null,
    shippingCountry:'United States',
    storePickupLocationId:'',
    isBillingSameAsShipping:true,
    billingAddress1:null,
    billingAddress2:null,
    billingCity:null,
    billingPhoneNumber:null,
    billingState:'State', 
    billingZipCode:null,
    billingCountry:'United States',
    termCode:null,
    termYear:null,
    selectedMaterials : [

    ],
    fdcItems:{
        enrollments:[

        ]
    },
    GMItems:[

    ]
        }

        commit('assignEmptyObj',obj);
    },
    assignOrderEnrollments({commit}, orderEnrollments){
        commit('assignOrderEnrollments',orderEnrollments);
    },
    assigngmItemsOrderEnrollments({commit}, gmItems){
        commit('assigngmItemsOrderEnrollments',gmItems);
    },
    setShippingType({commit},shippingType){
        commit('setShippingType',shippingType);
    },
    pushCourseMaterial({commit,state},courseMaterialObj){
        commit('pushCourseMaterial',courseMaterialObj);
    },
    removeOrderEnrollmentsCourseMaterials({commit},enrollObj){
        commit('removeOrderEnrollmentsCourseMaterials',enrollObj);
    }, 
    removeTaxOrderEnrollmentsCourseMaterials({commit},enrollObj){
        commit('removeTaxOrderEnrollmentsCourseMaterials',enrollObj);
    },    
    assignTaxCalOrderEnrollments({commit}, orderEnrollments){
        commit('assignTaxCalOrderEnrollments',orderEnrollments);
    },
    assignTaxCalGmItemsOrderEnrollments({commit}, gmItems){
        commit('assignTaxCalGmItemsOrderEnrollments',gmItems);
    },
    async getTaxCalculations({commit},taxCalculationObject){
        if(taxCalculationObject.fdcItems.hasOwnProperty('enrollment') && taxCalculationObject.fdcItems.enrollment.length > 0){
            taxCalculationObject.fdcItems.enrollment.forEach((val,index)=>{
                delete val['enrollmentId'];
                delete val['type'];
                val.courseMaterialList.forEach((material,index2)=>{
                    delete material['isbn'];
                })
            })
        }
        else{
            delete taxCalculationObject.fdcItems['enrollment'];
        }
        
        await this.$apis.baseService
        .getTaxCalculations(taxCalculationObject)
        .then(function(res){
            console.log(res);
            commit('assignTaxInfo',res.data)
        })
        .catch(error => {
            this.$router.push('/error');
        });
    }
}
// let plugins=null;
// if(process.browser){
//      plugins = [
//         createPersis,tedState({
//             key:'successOrderObject',
//             paths:['courseData.successOrderObj'],
//             getItem: (key) => ls.get(key),
//             setItem: (key, value) => ls.set(key, value)
//           })
// ]
// }


export default{
    state,
    getters,
    mutations,
    actions
}