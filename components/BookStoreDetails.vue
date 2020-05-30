<template>
  <div class="row mx-0 bookStoreDetailsWrap">
    <div class="col-lg-4 col-sm-12 mb-3 small">
      <h5 class="normalFont">
          <i class="fas fa-map-marker-alt"></i><strong>  Pickup Location </strong>
      </h5>
      <p class="addressLine">
          {{bookStoreDetails.addressLine1 ? bookStoreDetails.addressLine1+',':''}} <br> 
          {{bookStoreDetails.addressLine2!=null ? bookStoreDetails.addressLine2+',' : ''}}
          <br v-if="bookStoreDetails.addressLine2"> {{bookStoreDetails.city}}, <br>
          {{bookStoreDetails.state}} {{bookStoreDetails.zipcode}}
      </p>

      <h5 class="normalFont shippingMethodHeader">
          <strong>Store Hours</strong>
      </h5>                    
      <p class="addressLine">
        <!-- Mon: 8:30am-5:30pm<br>
        Tue: 8:30am-5:30pm<br>
        Wed: 8:30am-5:30pm<br>
        Thu: 8:30am-5:30pm<br>
        Fri: 8:30am-2pm<br>
        Sat: CLOSED<br>
        Sun: CLOSED -->
        <ul>
            <li v-for="(val, i) in storeDetails.storeInfo.storeHours" :key="i" class="row">
              <div class="col-2 p-0">{{val.day}}:</div>
              <div v-if="val.time_from === 'CLOSED'" class="col-5">CLOSED</div>
              <div v-else class="col-5">{{val.time_from}}-<br>{{val.time_to}}</div>  
            </li>
        </ul>
      </p>
    </div>
    <div class="col-lg-8 col-sm-12 mb-3 text-center">
      <div calss="store_map">
        <p></p>
        <img :src="mapkey" class="googleMapImg">
      </div>
      <!-- <a href="https://maps.googleapis.com/maps/api/staticmap?center=Syracuse4585%20West%20Seneca%20Turnpike,NY&zoom=15&size=400x400&markers=Syracuse4585%20West%20Seneca%20Turnpike,NY&maptype=roadmap&key=AIzaSyBR4ZJhuhsHtaok7gNQeaQHWQHwrT6sJkc&signature=bFpmW6n-tLxZIbosrCTrP0o1TbM=">GET DIRECTIONS</a> -->
    </div>
  </div>
</template>

<script>
export default {
    name:'BookStoreDetails',
    components:{

    },
    props:['bookStoreDetails','mapkey'],
    data(){
        return{

        }
    },
    created(){
      Object.keys(this.bookStoreDetails).forEach((val)=>{
        if(this.bookStoreDetails[val] == null || this.bookStoreDetails[val] == ''){
          delete this.bookStoreDetails[val];
        }
      })
    },
    mounted(){

    },
    methods:{

    },
    computed:{
      storeDetails : {
            get(){
                return this.$store.state.courseData.storeDetails;
            },
            set(value){

            }
        }
    }
}
</script>

<style scoped>
  ul{
    padding:0px 30px 0px 15px;
  }
</style>