<template>
    <div class="col-sm-12 col-md-12 col-lg-8 col-xl-8 contentWrapper">
        <div v-if="successOrderObj!==undefined  && Object.keys(successOrderObj).length > 0 && successOrderObj.fdcOrder.shippingType == 1">
            <h2 class="contentHeader" ref="contentHeader" tabindex="-1">
                Thank you, {{userInformation.firstName}}!
            </h2>
            <p class="bigFont">Collect your course materials at the bookstore.</p>
            <div class="borderedBox successShippingBox">
                <BookStoreDetails :bookStoreDetails="bookStoreDetails" :mapkey="successOrderObj.key"/>
            </div>
            <div class="row CourseMaterialCollectionInfo">  
                <div class="col-lg-12">
                    <hr class="mt-20" />  
                </div>            
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CommonlyPurchasedItems/>
                </div>
            </div>
        </div>
        <div v-if="successOrderObj!==undefined  && Object.keys(successOrderObj).length == 0">
            <h2 class="contentHeader" ref="contentHeader" tabindex="-1">
            Thank you, {{userInformation.firstName}}!
            </h2>
            <p class="bigFont">Your course material will be available for pickup. You will receive an email when your course materials are ready. </p>
            <div class="borderedBox successShippingBox">
                <BookStoreDetails :bookStoreDetails="bookStoreDetails" :mapkey="successOrderObj.key"/>
            </div>
            
            <div class="row CourseMaterialCollectionInfo">        
                <div class="col-lg-12">
                    <hr class="mt-20" />  
                </div>       
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CommonlyPurchasedItems/>
                </div>
            </div>
        </div> 
        <!-- <div v-if="successOrderObj.type=='empty'">
            <h2 class="contentHeader" ref="contentHeader" tabindex="-1">
            Thank you, {{userInformation.firstName}}!
            </h2>
            <p class="bigFont">Your course material will be available for pickup. You will receive an email when your course materials are ready. </p>
            <div class="borderedBox successShippingBox">
                <BookStoreDetails :bookStoreDetails="bookStoreDetails"/>
            </div>
            
            <div class="row CourseMaterialCollectionInfo">        
                <div class="col-lg-12">
                    <hr class="mt-20" />  
                </div> 
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CommonlyPurchasedItems/>
                </div>
            </div>
        </div>    -->
        <div v-if="successOrderObj!==undefined && Object.keys(successOrderObj).length > 0 && successOrderObj.fdcOrder.shippingType == 2">
            <h2 class="contentHeader" ref="contentHeader" tabindex="-1">
            Thank you, {{userInformation.firstName}}!
            </h2>
            <p class="bigFont">Your course materials will be shipped to:</p>
            <div class="borderedBox successShippingBox">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h5 class="normalFont">
                        <i class="fas fa-map-marker-alt"></i><strong>  Shipping Address </strong>
                    </h5>
                    <p class="addressLine">
                        {{successOrderObj.fdcOrder.shippingFirstName}} {{successOrderObj.fdcOrder.shippingLastName}}<br> 
                        {{successOrderObj.fdcOrder.shippingAddress1}}, <br> 
                        {{successOrderObj.fdcOrder.shippingAddress2!=null ? successOrderObj.fdcOrder.shippingAddress2+',' : ''}} 
                        <br v-if="successOrderObj.fdcOrder.shippingAddress2">
                        {{successOrderObj.fdcOrder.shippingCity}}, {{successOrderObj.fdcOrder.shippingState}} {{successOrderObj.fdcOrder.shippingZipCode}} 
                    </p>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h5 class="normalFont shippingMethodHeader">
                        <strong>Shipping Method</strong>
                    </h5>                    
                    <p class="addressLine">{{shipMethod}}</p>
                </div>
            </div>
            
            <div class="row CourseMaterialCollectionInfo">
                <div class="col-lg-12">
                    <hr class="mt-20" />  
                </div> 
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CommonlyPurchasedItems/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BookStoreDetails from './BookStoreDetails';
import CommonlyPurchasedItems from './CommonlyPurchasedItems';
export default {
    name:'CourseMaterialCollection',
    components:{
        BookStoreDetails,
        CommonlyPurchasedItems
    },
    props:['userInformation','courseData', 'bookStoreDetails'],
    data(){
        return{
            shipMethod:''
        }
    },
    created(){
        // if(this.successOrderObj!==undefined && this.successOrderObj!==null && this.successOrderObj.type!=='empty'){
        Object.keys(this.successOrderObj.fdcOrder).forEach((val)=>{
            if(this.successOrderObj.fdcOrder[val] == null){
                delete this.successOrderObj.fdcOrder[val];
            }
        })

        this.studentMaterialData.shippingModeAndStorePickUp.shippingMode.forEach((val,index)=>{
            if(val.shipModeId == this.successOrderObj.fdcOrder.shippingMethod){
                this.shipMethod = val.shipModeDescription;
            }
        })
    },
    mounted(){

    },
    computed:{
        successOrderObj:{
            get(){
                return this.$store.state.courseData.successOrderObj;   
            },
            set(){

            }
        },
        studentMaterialData:{
            get(){
                return this.$store.state.courseData.studentData;
            },
            set(){

            }
        }
    }
}
</script>

<style>
    .CourseMaterialCollectionInfo>div:first-child{
        /* border-bottom:1px solid rgba(0,0,0,0.22); */
    }
</style>
