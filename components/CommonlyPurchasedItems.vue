<template>
  <div class="suggestionContainer">
    <h3>Add-on Items</h3>
    <p>Think you may need something soon? Here are some commonly purchased items we can have ready by the time you come to get your FirstDay Complete course materials.</p>
    <div class="row suggestionList">
      <div v-for="(items,i) in upsellItems" :key="i" class="col-sm-4 col-md-4 col-lg-4 col-xl-4 suggestionListItem">
        <div class="suggestionListItemIn">
          <img :src="items.bartlebyLink==1 ? require(`../assets/images/bartleby_v2.jpg`) : items.imageUrl" :alt="items.item" />
          <div class="suggestionListItemInInfo">
            <h4 :class="items.bartlebyLink==1 ? 'ml-0 mr-0 freeText' : ''">{{items.item}}</h4>
            <p v-if="items.bartlebyLink==1" class="ml-0 mr-0">1st mo free then {{items.retail}} / mo*</p>
            <p v-else>Price: {{items.retail}}</p>
            <p :class="items.bartlebyLink==1 ? 'ml-0 mr-0' : ''"><a :href="items.bartlebyLink==1 ? items.bartleBy : items.productUrl" target="_blank">View Details</a></p>
          </div>
        </div>
      </div>
      <!-- <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
        <button class="btn btn-primary btn-sm btn-wide btnSubmit" @click="navigateToShop()">PURCHASE SELECTED ITEMS</button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
    name:'CommonlyPurchaedItems',
    components:{

    },
    data(){
        return{
            
        }
    },
    methods:{
        navigateToShop(){

        }
    },
    computed: {
      upsellItems: {
        get(){
          return this.$store.state.courseData.upsellItems;
        },
        set(){

        }
      }
    }
}
</script>

<style scoped>
    .SuggestionContainer{
        padding-top:10px;
    }

    .commonItemsStyle{
        padding:20px;
        height:100%;
        border-radius:5px;
        border:1px solid rgba(0,0,0,0.22);
        text-align:center;
    }

    .titleStyle{
        font-size: 14px;
        margin-top: 5px;
    }
</style>
