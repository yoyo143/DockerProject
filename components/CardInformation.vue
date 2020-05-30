<template>
    <div class="col-sm-8 col-md-8 col-lg-8 col-xl-8">
        <div class="row">
            <div class="col-lg-12">
                <h5>Credit Card Details</h5>
                <p class="creditNote">                                                                
                    You are required to provide a credit card to secure your rental books.<br />
                    <strong>NOTE:</strong> Your card will not be charged for rental items unless you fail to return them by specified date.
                </p>
            </div>
            
            <div class="col-lg-12">
                <div class="mb-3 defaultFont">
                    <label for="NameonCard" class="hidden">Name on Card</label> 
                    <input type="text" maxlength="35" name="NameonCard" id="NameonCard" placeholder="Name on Card" required="required" class="form-control" v-model.trim="$v.cardName.$model"> 
                    <div v-if="$v.cardName.$dirty">
                        <div class="error text-danger fnt12" v-if="!$v.cardName.required">
                            Valid card name is required.
                        </div>
                    </div>
                </div>
                <div id="payframe" v-if="errorMsg==''">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div v-else>
                </div>    
            </div>
        </div>    
    </div>   
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue'
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);
import { required, maxLength, minLength, between, requiredIf, numeric, maxValue, alphaNum } from 'vuelidate/lib/validators';
export default {
    name:'CardInformation',
    data(){
        return{
            cardName:'',
            paypageId: "bdE5cs8MjLyHeqzp",
            timeout: "15000",
            errorMsg:'',
            reportGroup: "*merchant1500",
            payframeClient:undefined,
            configure: {
                "paypageId": "bdE5cs8MjLyHeqzp",
                "style": document.documentElement.clientWidth < 481 ? "fdcStudentMobileV1" : "fdcStudentDesktopV1",
                "reportGroup": "*merchant1500",
                "height": document.documentElement.clientWidth < 481 ? "170" : "120",
                "timeout":"5000",
                "div": "payframe",
                "callback": this.payframeClientCallback,
                "showCvv": true,
                "months": {
                    "1":"January",
                    "2":"February",
                    "3":"March",
                    "4":"April",
                    "5":"May",
                    "6":"June",
                    "7":"July",
                    "8":"August",
                    "9":"September",
                    "10":"October",
                    "11":"November",
                    "12":"December"
                },
                "numYears": 8,
                "tooltipText": "A CVV is the 3 digit code on the back of your Visa, MasterCard and Discover or a 4 digit code on the front of your American Express",
                "tabIndex": {
                    "accountNumber":1,
                    "cvv":4,
                    "expMonth":2,
                    "expYear":3
                },
                "placeholderText": {
                    "cvv":"CVV",
                    "accountNumber":"Card Number",
                    "expMonth": "Month",
                    "expYear": "Year"
                },
                "htmlTimeout": "15000",
                "inputsEmptyCallback": this.inputsEmptyCallback,
                "clearCvvMaskOnReturn": true,
                "enhancedUxFeatures" : {
                    "inlineFieldValidations": true,
                    "numericInputsOnly": true
                }
            }
        }
    },
    validations(){
      return{
          cardName:{
              required
          }
      }
    },  
    props:[],
    created(){
        
    },
    mounted(){
        if (typeof this.payframeClient === 'undefined') {
                //This means we couldn't download the eprotect-iframe-client javascript library
                // alert("Couldn't download eprotect-iframe-client3.min javascript");
        } 
        this.payframeClient = new LitlePayframeClient(this.configure);      
    },
    methods:{     
        submitClicked(){      
            var startTime;
            var message = {
                "id": "987012",
                "orderId": "order_123"
            };
            startTime = new Date().getTime();
            this.$v.$touch();

            if(this.$v.$invalid){
                return;
            }
            else{
                this.payframeClient.getPaypageRegistrationId(message);         
            }
            
            return false;
        },
        payframeClientCallback(response){
            if (response.timeout) {
                alert("We are experiencing technical difficulties. Please try again or call us to complete your order");
                this.errorMsg = 'We are experiencing technical difficulties. Please try again or call us to complete your order'
                //You may also want to submit information you have about the consumer to your servers to facilitate debugging like customer ip address, user agent, and time
            }
            else {
               
                this.payPageId = response.paypageRegistrationId;
                this.reportGroup = response.reportGroup;
                this.timeout = response.timeout;
                if(response.hasOwnProperty('message') && response.message == 'Success'){
                    response.expMonth = parseInt(response.expMonth);
                    response.expYear = parseInt(response.expYear);
                    console.log(response);
                    this.$emit('paymentResponse',response);
                }
                
                // document.getElementById('response$code').value = response.response;
                // document.getElementById('response$message').value = response.message;
                // document.getElementById('response$responseTime').value = response.responseTime;
                // document.getElementById('response$reportGroup').value = response.reportGroup;
                // document.getElementById('response$merchantTxnId').value = response.id;
                // document.getElementById('response$orderId').value = response.orderId;
                // document.getElementById('response$vantivTxnId').value = response.vantivTxnId;
                // document.getElementById('response$checkoutId').value = response.checkoutId;
                // document.getElementById('response$type').value = response.type;
                // document.getElementById('response$accountRangeId').value = response.accountRangeId;
                // document.getElementById('response$lastFour').value = response.lastFour;
                // document.getElementById('response$firstSix').value = response.firstSix;
                // document.getElementById('paypageRegistrationId').value = response.paypageRegistrationId;
                // document.getElementById('bin').value = response.bin;
                // document.getElementById('response$expMonth').value = response.expMonth;
                // document.getElementById('response$expYear').value = response.expYear;
                if(response.response === '870') {
                    //Submit the form
                }
                else if(response.response === '871' || response.response === '872' || response.response === '873' || response.response === '874' || response.response === '876') {
                    //Recoverable error caused by user mis-typing their credit card
                    // alert("Please check and re-enter your credit card number and try again.");
                }
                else if(response.response === '881' || response.response === '882' || response.response === 883) {
                    //Recoverable error caused by user mis-typing their credit card
                    // alert("Please check and re-enter your card validation number and try again.");
                }
                else if(response.response === '884') {
                    //Frame failed to load, so payment can't proceed.
                    //You may want to consider a larger timeout value for the htmlTimeout property
                    //You may also want to log the customer ip, user agent, time, paypageId and style that failed to load for debugging.
                    //Here, we hide the frame to remove the unsightly browser error message from the middle of our payment page that may eventually display
                    $('#eProtectiframe').hide();
                    // and disable the checkout button
                    $('#submitButton').attr('disabled','disabled');
                }
                else if(response.response === '885') {
                    //CSS Failed to load, so the page will look unsightly but will function.
                    //We are going to continue with the order
                    $('#submitButton').removeAttr('disabled');
                    //You may also want to log the customer ip, user agent, time, and style that failed to load for debugging
                }
                else {
                    //Non-recoverable or unknown error code
                    alert("We are experiencing technical difficulties. Please try again or call us to complete your order");
                    //You may also want to submit the vantivTxnId and response received, plus information you have about the consumer to your servers to facilitate debugging, i.e., customer ip address, user agent and time
                }
            }
        },
        inputsEmptyCallback(res){
            var isEmpty = res.allInputsEmpty;
            if(isEmpty) {
                return true;
            } else {
                return false;
            }
        }
    },
    computed:{
       
    }
}
</script>

<style>

</style>


