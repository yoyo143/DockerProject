<template>
  <div class="col-sm-12 col-md-12 col-lg-8 col-xl-8 contentWrapper">
    <h2 class="contentHeader" ref="contentHeader" tabindex="-1">
        {{userInformation.firstName}}, Welcome to {{userSettings.programName}}
    </h2>

    <div class="alertContainer">
      <div class="alert alert-info alert-dismissible" role="alert" v-show="courseEnrollmentStatus.added == true">
        <strong>New Course(s) Added!</strong> We see that new courses were added on {{statusDates.newCourseAddedDate | convertDate}}; Your {{userSettings.programName}} materials have been updated to match.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="alert alert-warning alert-dismissible" role="alert" v-show="courseEnrollmentStatus.dropped == true">
        <strong>Course(s) Dropped!</strong> Some of your courses were dropped on {{statusDates.courseDroppedDate | convertDate}}; Please note the materials we'll need back from you.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <div class="form-group" style="display:inline-block;">
      <p class="fontBig">Your course materials for
      <label id="termsLabel" for="terms" class="displayNone"></label>
      <span class="fontWeightSemiBold" v-if="terms.length == 1">{{terms[0].termTitle}}</span>
      <select v-else class="form-control" id="terms"  v-model="selected" >
          <option v-for="(val,i) in terms" :key="i">{{val.termTitle}}</option>
      </select>
      are now available for in-store pickup or delivery.</p>
    </div>

    <div class="row contentSubHeader">
      <div class="col-12">
          <h3>My Courses & Included Materials</h3>
      </div>
      <!-- <div class="col-6">
          <p><a class="floatRight fontSmall linkDefaultColor" href="javascript:void(0)" @click="expandAndHideAll">{{showAll ? 'Show all Course Materials' : 'Hide all Course Materials'}}</a></p>
      </div> -->
      <div class="col-12">
          <p>You are registered for {{enrollAndCoursesCount.enrollmentsCount}} courses and have {{enrollAndCoursesCount.courseMaterialsCount}} available included materials.</p>
      </div>
    </div>

    <div class="courseListContainer">

      <div class="accordion courseList" id="courseList">
          <div class="row card" v-for="(value,name,index) in coursesData" :key="index">
              <div class="cardHeader col-lg-12">
                  <h3 class="mb-0">
                      <button class="btn text-white"  data-toggle="collapse" :data-target="'#collapse'+index" aria-expanded="false" :aria-controls="'collapse'+index" type="button" :id="'heading'+index">
                          <!-- {{value.enrollment.department}}({{value.enrollment.course}}) --><span>{{name}}</span>
                        <div>
                            <span class="badgeStyle" :class="value.enrollment.enrollmentStatus == 'A' ? 'coursesAdded' : value.enrollment.enrollmentStatus == 'D' ? 'coursesDropped':''">
                                {{value.enrollment.enrollmentStatus == 'A' ? 'NEW' :value.enrollment.enrollmentStatus == 'D' ?  'DROPPED' : ''}}
                            </span>
                            <span class="badgeStyle" :class="value.enrollment.submittedStatus == true ? 'submittedBadgeStyle' : ''">
                                {{value.enrollment.submittedStatus == true ? 'SUBMITTED' : ''}}
                            </span>
                            <span class="chevronContainer">
                            <i class="fas fa-1x fa-chevron-down"></i>
                            <i class="fas fa-1x fa-chevron-up"></i>
                            </span>
                        </div>
                        
                      </button>
                  </h3>
              </div>
              <div :id="'collapse'+index" class="collapse multi-collapse col-lg-12 " :aria-labelledby="'heading'+index" >
                  <div class="cardBody">
                      <div class="courseBody row" v-if="!value.enrollment.noTextInd && (value.hasOwnProperty('includedItems') || value.hasOwnProperty('notIncludedItems'))">
                          <div 
						      :class="[value.includedItems && value.includedItems.length!=0 && (!value.hasOwnProperty('notIncludedItems')) ? 'courseListLeft col-sm-12 col-md-12 col-lg-12 col-xl-12' : value.includedItems && value.includedItems.length > 1 && value.hasOwnProperty('notIncludedItems') ? 'courseListLeft col-sm-12 col-md-12 col-lg-8 col-xl-8' :  'courseListLeft col-sm-12 col-md-12 col-lg-4 col-xl-4',includedOrderStatus ? 'op07':'']" 
							  v-show="(value.includedItems && value.includedItems.length!=0 )" >
                              <div class="courseBodyCategory success">
                                  INCLUDED
                              </div>
                              <div class="courseType row" >
                                  <div 
								    :class="[value.includedItems && value.includedItems.length!=0 && (!value.hasOwnProperty('notIncludedItems')) ? 'col-sm-12 col-md-12 col-lg-4 col-xl-4' : value.includedItems && value.includedItems.length > 1 && value.hasOwnProperty('notIncludedItems') ? 'col-sm-12 col-md-12 col-lg-6 col-xl-6' : 'col-sm-12 col-md-12 col-lg-12 col-xl-12',includedCourseMaterialOrderStatus &&  includedCourseMaterialOrderStatus.id.includes(courseItem.bookNumber) ? 'op07':'']" 
									v-for="(courseItem,i) in value.includedItems" 
									:key="i" 
									v-show="courseItem.unavailable == 0" >
                                    <div class="courseTypeItem">
                                        <h4>
                                            {{courseItem.isPhysicalItem == true ? 'Physical Item' : 'Digital Item'}}
                                        </h4>
                                        <div class="courseImage">
                                            <img :src="courseItem.cover_url!=null ? courseItem.cover_url : require(`../assets/images/ImageNotAvailable.jpg`)" :alt="courseItem.title"/>
                                        </div>
                                        <p class="textRequired">
                                            {{courseItem.isRequired ? 'REQUIRED' : 'RECOMMENDED'}}
                                        </p>
                                        <div class="courseDetailsWrap">
                                            <h3>{{courseItem.title}}</h3>
                                            <p class="authorName">
                                                by {{courseItem.authors}}  
                                            </p>
                                            <p v-if="courseItem.edition!=null && courseItem.edition!='' && courseItem.edition!=undefined" class="authorName">
                                                Edition: {{courseItem.edition}} 
                                            </p>
                                        </div>
                                        
                                        <p class="priceTag" v-if="(userSettings.pricingInclude == 'true') && (courseItem.hasOwnProperty('prices') && courseItem.prices[0]) && courseItem.isOrdered">Price: ${{courseItem.prices[0].new_price}}</p>
                                        <p v-if="courseItem.isPhysicalItem === false && courseItem.fromCpt === true" class="digitalItemInfo">Delivered in {{userSettings.lms}} on the first day of class</p>
                                    </div>
                                  </div>
                              </div>
                          </div>
                          <div 
						    v-if="(value.notIncludedItems && value.notIncludedItems.length!=0 && value.hasOwnProperty('notIncludedItems'))"
							:class="[value.notIncludedItems && value.notIncludedItems.length!=0 && (!value.hasOwnProperty('includedItems')) ? 'courseListRight col-sm-12 col-md-12 col-lg-12 col-xl-12' : value.notIncludedItems && value.notIncludedItems.length > 1 && value.hasOwnProperty('includedItems') && value.includedItems.length == 1 ? 'col-sm-12 col-md-12 col-lg-8 col-xl-8' : value.notIncludedItems && value.notIncludedItems.length > 1 && value.hasOwnProperty('includedItems') && value.includedItems.length > 1 ? 'col-sm-12 col-md-12 col-lg-4 col-xl-4' : 'col-sm-12 col-md-12 col-lg-4 col-xl-4',orderStatus ? 'op07':'']" style="background:#fff;">
                              <div class="courseBodyCategory">
                              NOT INCLUDED <i tabindex="-1" class="fas fa-question-circle" data-toggle="tooltip" data-placement="top"  :title="'This item is not included in '+userSettings.programName+', but is recommended by your professor.'"></i>
                              </div>
                              <div class="courseType row" >
                                  <div 
								    :class="[value.notIncludedItems && (!value.hasOwnProperty('includedItems')) ? 'col-sm-12 col-md-12 col-lg-4 col-xl-4' : value.notIncludedItems && value.notIncludedItems.length > 1 && value.hasOwnProperty('includedItems') && value.includedItems.length == 1 ? 'col-sm-12 col-md-12 col-lg-6 col-xl-6' : 'col-sm-12 col-md-12 col-lg-12 col-xl-12',notIncludedCourseMaterialOrderStatus.id.includes(courseItem.bookNumber) ? 'op07':'']" 
									v-for="(courseItem,i) in value.notIncludedItems" 
									:key="i"
									v-show="courseItem.unavailable == 0">
                                    <div class="courseTypeItem">
                                         <h4>
                                            {{courseItem.isPhysicalItem == true ? 'Physical Item' : 'Digital Item'}}
                                        </h4> 
                                        <div class="courseImage">
                                            <img :src="courseItem.cover_url!=null ? courseItem.cover_url : require(`../assets/images/ImageNotAvailable.jpg`)" :alt="courseItem.title"/>
                                        </div>                                       
                                        
                                        <p class="textRequired">
                                            {{courseItem.isRequired ? 'REQUIRED' : 'RECOMMENDED'}}
                                        </p>
                                        
                                        <div class="courseDetailsWrap">
                                            <h3>{{courseItem.title}}</h3>
                                            <p class="authorName">
                                                by {{courseItem.authors}} 
                                            </p>
                                            <p v-if="courseItem.edition!=null && courseItem.edition!='' && courseItem.edition!=undefined" class="authorName">
                                                Edition: {{courseItem.edition}} 
                                            </p>
                                        </div>
                                        <div class="form-group" style="margin-bottom:10px" v-if="!notIncludedCourseMaterialOrderStatus.id.includes(courseItem.bookNumber)">
                                            <select class="form-control" v-if="courseItem.prices[0]['new_price']!=='0' && courseItem.prices[0]['new_price'] !== null &&  courseItem.prices[0]['new_price'] !== ''" :id="'priceDropDown'+courseItem.bookNumber"  :key="i" @change="assignSelectedPrice($event,courseItem.bookNumber)">
                                                <option selected disabled>{{showmsg}}</option>
                                                <option v-if="courseItem.hasOwnProperty('prices')" v-bind:value="courseItem.prices[0]['new_price'] !== null ? courseItem.prices[0]['new_price'] : '0.00'">$ {{courseItem.prices[0]['new_price'] !== null ? courseItem.prices[0]["new_price"] : '0.00'}}</option>
                                                <!-- <option v-for="(price,index1) in  courseItem.primary" v-if="price.price!=null && price.ebook == true" :key="price.type+'first'" v-bind:value="price.price">${{price.price!= null ? price.price : ''}} {{price.type == 'new_price' && price.price!= null && price.ebook ? 'Buy' : price.type == 'used_price' && price.price!= null ? 'Used Print' : price.type == 'rental_used_price' && price.price!= null? 'Used Print Rental' : price.type == 'rental_new_price' && price.price!= null ? 'New Print Rental' : ''}} {{price.expiry_period == 'UNLIMITED' ? '' : '('+price.expiry_period+')'}}</option>
                                                <option v-for="(price,index1) in  courseItem.primary" v-if="price.price!=null && price.ebook == false" :key="price.type+'second'" v-bind:value="price.price">${{price.price!= null ? price.price : ''}} {{price.type == 'new_price' && price.price!= null ? 'New Print' : price.type == 'used_price' && price.price!= null ? 'Used Print' : price.type == 'rental_used_price' && price.price!= null? 'Used Print Rental' : price.type == 'rental_new_price' && price.price!= null ? 'New Print Rental' : ''}} {{price.expiry_period == 'UNLIMITED' || price.expiry_period == null ? '' : '('+price.expiry_period+')'}}</option>
                                                <option v-for="(price,index1) in  courseItem.buy" v-if="price.price!=null && price.ebook == false" :key="price.type+'third'" v-bind:value="price.price">${{price.price!= null ? price.price : ''}} {{price.type == 'new_price' && price.price!= null ? 'New Print' : price.type == 'used_price' && price.price!= null ? 'Used Print' : price.type == 'rental_used_price' && price.price!= null? 'Used Print Rental' : price.type == 'rental_new_price' && price.price!= null ? 'New Print Rental' : ''}} {{price.expiry_period == 'UNLIMITED' || price.expiry_period == null? '' : '('+price.expiry_period+')'}}</option>
                                                <option v-for="(price,index1) in  courseItem.buy" v-if="price.price!=null && price.ebook == true" :key="price.type+'fourth'" v-bind:value="price.price">${{price.price}} E-Book Buy {{price.expiry_period == 'UNLIMITED' ? '' : '('+price.expiry_period+')'}}</option>
                                                <option v-for="(price,index1) in  courseItem.rent" v-if="price.price!=null && price.ebook == true" :key="price.type+'fifth'" v-bind:value="price.price">${{price.price}} E-Book Rent {{price.expiry_period == 'UNLIMITED' ? '' : '('+price.expiry_period+')'}}</option> -->
                                            </select>
                                            <span v-else> Price not yet available </span>
                                        </div>
                                          <div v-if="!notIncludedCourseMaterialOrderStatus.id.includes(courseItem.bookNumber) && courseItem.prices[0]['new_price']!=='0'">
                                              <button aria-pressed="false" :disabled="selectIds.includes(courseItem.bookNumber) ? false : true" type="button" :id="'button'+courseItem.bookNumber" :data-selected="selectedPricesObj['courseMaterial'+courseItem.bookNumber]" :class="addedItems.includes(courseItem)  ? 'btn btn-added btn-sm col-12' : 'btn btn-success btn-sm col-12'" @click="addedItems.includes(courseItem) ? '':insertSelectedItem($event,value,courseItem,i,courseItem.bookNumber)">{{addedItems.includes(courseItem) ? 'ADDED TO MATERIAL PICKUP' : 'ADD TO MATERIAL PICKUP'}}</button>
                                          </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="courseBody row" v-else>
                        <div class="courseListLeft noCourseMaterialStyle col-sm-12 col-md-12 col-lg-12">
                            <strong>This course does not require any course materials</strong>
                        </div>  
                      </div>      
                  </div>
              </div>
          </div>
      </div>

      <div class="addedItemsWrapper section collapsed" id="droppedCourses" v-if="(!orderStatus || !includedOrderStatus)">
        <h3>Add-on Items</h3>
        <div class="addOnItemsWrap">
          <div class="row addOnItems" v-for="(item,i) in displayItems" :key="i">
            <div class="col-9 p-0 addOnItemsLeft">
              <span>{{item.title}}</span>
            </div>
            <div class="col-3 p-0 text-right addOnItemsRight">
              <!-- <span style="display:inline-block"> ${{item.price}} </span> -->
              <span style="display:inline-block"> $ {{item.new_price}} </span>
              <span><a class="removeIcon" href="javscript:void(0)" @click.prevent="removeCourseMaterial(item)"><i class="far fa-trash-alt" style="position:relative"><span class="hoverSpan">Remove</span></i></a></span>
            </div>
          </div>
        </div>
        <div class="row addOnItemsFooter">
          <hr class="col-12 p-0" />
          <div class="col-lg-8 col-md-8"></div>
          <div class="col-lg-4 col-md-4 col-sm-12 p-0">
            <div class="row">
              <div class="col-7 p-0 text-right"><strong>Add-on Total</strong></div>
              <div class="col-5 p-0 text-right" style="padding-right: 27px !important;"><strong>$ {{subTotalPrice.toFixed(2)}}</strong></div>
            </div>
          </div>
          <hr class="col-12 p-0 hrMain" />
        </div>
      </div>

      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0" v-if="(!orderStatus || !includedOrderStatus)">
          <div class="deliveryStyleWrapper">
              <h3>I'd like to have my course materials...</h3>
              <div class="accordion" id="howCollect">
                  <input type="hidden" value="1" name="collect_type" id="collect_type">
                      <button class="ship-opt collapsed"  data-toggle="collapse" data-target="#collStore" aria-expanded="false" aria-controls="collStore" id="headStore" ref="store" @click="changeRadioState($event,'waiting')">
                          <i class="far fa-check-circle mr-1" aria-hidden="true"></i> ... waiting for me at the bookstore
                      </button>
					  <div id="collStore" class="collapse courseMaterialOptionsWrap" aria-labelledby="headStore" data-parent="#howCollect">
                        <div class="pt-2">
                          <p>Your course material will be available for pickup. You will receive an email when your course materials are ready.</p>
                          <div class="row mx-0 bookStoreDetailsWrap">
                            <div class="col-lg-5 col-sm-12 pl-0 small">
                            <h5 class="normalFont">
                                <i class="fas fa-map-marker-alt"></i><strong>  Pickup Location </strong>
                            </h5>
                            <p class="addressLine">
                                {{bookStoreDetails.addressLine1 ? bookStoreDetails.addressLine1+',':''}} <br> 
                                {{bookStoreDetails.addressLine2!=null ? bookStoreDetails.addressLine2+',' : ''}}
                                <br v-if="bookStoreDetails.addressLine2"> {{bookStoreDetails.city}}, <br>
                                {{bookStoreDetails.state}} {{bookStoreDetails.zipcode}}
                            </p>
                            </div>
                          </div>
                        </div>
                        <!-- <bookStoreDetails :bookStoreDetails="bookStoreDetails"/> -->
                      </div>
                      <button class="ship-opt collapsed"  data-toggle="collapse" data-target="#collShip" aria-expanded="false" aria-controls="collShip" id="headShip" ref="ship" @click="changeRadioState($event,'shipped')">
                          <i class="far fa-check-circle mr-1" aria-hidden="true"></i> ... shipped to me
                      </button>
                      <div id="collShip" class="collapse" style="color:#231F20" aria-labelledby="headShip" data-parent="#howCollect">
                          <div class="shipping-body">

                              <!-- shipform -->
                              <div class="container-fluid">
                                  <div class="row">
                                      <div class="col-lg-7">
                                        <h5>Contact Information</h5>
                                        <div class="row" >
                                          <div class="col-md-6 mb-3">
                                              <label for="firstName" class="hidden">First Name</label>
                                              <input 
                                                type="text" 
                                                class="form-control" 
                                                ref="shippingFirstName" 
                                                aria-describedby="firstNameError"
                                                name="shippingFirstName" 
                                                id="shippingFirstName" 
                                                placeholder="First Name" 
                                                value="" 
                                                required="" 
                                                v-model.trim="$v.orderObj.shippingFirstName.$model">
                                              <div v-if="$v.orderObj.shippingFirstName.$dirty" id="firstNameError" aria-live="assertive">
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingFirstName.required">
                                                    Valid first name is required.
                                                </div>
                                                <div class="error text-danger fnt12" aria-live="assertive" v-if="!$v.orderObj.shippingFirstName.maxLength">
                                                    Please enter a valid 25 character First Name.
                                                </div>
                                              </div>
                                          </div>
                                          <div class="col-md-6 mb-3">
                                              <label for="lastName" class="hidden">Last Name</label>
                                              <input 
                                                type="text" 
                                                class="form-control" 
                                                ref="shippingLastName" 
                                                aria-describedby="lastNameError"
                                                name="lastName" 
                                                id="lastName" 
                                                placeholder="Last Name" 
                                                value="" 
                                                required="" 
                                                v-model.trim="$v.orderObj.shippingLastName.$model">
                                              <div v-if="$v.orderObj.shippingLastName.$dirty" id="lastNameError">
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingLastName.required">
                                                    Valid last name is required.
                                                </div>
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingLastName.maxLength">
                                                    Please enter a valid 29 character Last Name.
                                                </div>
                                              </div>
                                          </div>
                                          <div class="col-md-6 mb-3">
                                              <label for="phoneNumber" class="hidden">Phone Number</label>
                                              <input 
                                                type="text" 
                                                class="form-control" 
                                                ref="shippingPhoneNumber" 
                                                aria-describedby="phoneNumberError"
                                                name="phoneNumber" 
                                                id="phoneNumber" 
                                                placeholder="Phone Number" 
                                                value="" 
                                                required="" 
                                                v-model.number.trim="$v.orderObj.shippingPhoneNumber.$model">
                                              <div v-if="$v.orderObj.shippingPhoneNumber.$dirty" id="phoneNumberError">
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingPhoneNumber.required">
                                                    Valid Phone number is required.
                                                </div>
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingPhoneNumber.numeric">
                                                    Only numeric characters allowed.
                                                </div>
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingPhoneNumber.maxLength">
                                                   <span>{{orderObj.shippingCountry == 'US' ? 'Invalid Telephone Number. Please enter a valid, 10-digit Telephone number':'Invalid Telephone Number. Please enter a valid, 13-digit Telephone number'}}  </span>
                                                </div>
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingPhoneNumber.minLength">
                                                    <span>{{orderObj.shippingCountry == 'US' ? 'Invalid Telephone Number. Please enter a valid, 10-digit Telephone number':'Invalid Telephone Number. Please enter a valid, 13-digit Telephone number'}} </span>
                                                </div>
                                              </div>
                                          </div>
                                        </div>

                                        <h5>Address</h5>

                                        <div class="mb-3">
                                            <label for="address" class="hidden">Address</label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                maxlength="35" 
                                                ref="shippingAddress1" 
                                                aria-describedby="addressError"
                                                name="address" 
                                                id="address" 
                                                @blur="callTaxCalculation()"
                                                placeholder="Address Line 1" 
                                                required="" 
                                                v-model.trim="$v.orderObj.shippingAddress1.$model">
                                            <div v-if="$v.orderObj.shippingAddress1.$dirty" id="addressError">
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingAddress1.required">
                                                    Please enter your shipping address.
                                                </div>
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingAddress1.maxLength">
                                                    Only 35 characters allowed.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label for="address2" class="hidden">Address 2 <span class="text-muted">(Optional)</span></label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                ref="shippingAddress2" 
                                                aria-describedby="address2Error"
                                                name="address2" 
                                                maxlength="35" 
                                                id="address2" 
                                                placeholder="Address Line 2 (Optional)" 
                                                v-model.trim="$v.orderObj.shippingAddress2.$model">
                                            <div v-if="$v.orderObj.shippingAddress2.$dirty" id="address2Error">
                                                <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingAddress2.maxLength">
                                                    Only 35 characters allowed.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12 mb-3">
                                                <label for="country" class="hidden">Country</label>
                                                <select class="custom-select d-block w-100" ref="shippingCountry" name="country" id="country" required="" v-model="orderObj.shippingCountry" ><!-- v-model="orderObj.shippingCountry" -->
                                                    <option :selected="country == 'US' || country == 'Canada'" v-for="(country,i) in countryList" :value="country.code" :key="i">{{country.country}}</option>
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please select a valid country.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12 mb-3" v-if="this.orderObj.shippingCountry == 'US' || this.orderObj.shippingCountry == 'CA'">
                                                  <label for="shipping_state" class="hidden">State</label>
                                                  <select 
                                                    class="custom-select d-block w-100" 
                                                    ref="shippingState" 
                                                    aria-describedby="shipping_stateError"
                                                    name="shipping_state" 
                                                    @blur="callTaxCalculation()"
                                                    id="shipping_state" 
                                                    required="" 
                                                    v-model="$v.orderObj.shippingState.$model">  <!-- v-model="orderObj.shippingState" -->
                                                      <option  selected disabled>State</option>
                                                      <option v-for="(state,i) in shippingStateList" :key="i" :value="state.code">{{state.state}}</option>
                                                  </select>
                                                  <div v-if="$v.orderObj.shippingState.$dirty">
                                                    <div class="error text-danger fnt12" id="shipping_stateError" v-if="!$v.orderObj.shippingState.shippingStateValidator">
                                                        Please select a valid state.
                                                    </div>
                                                  </div>
                                              </div>
                                        </div>

                                          <div class="row">
                                              <div class="col-md-6 mb-3">
                                                  <label for="city" class="hidden">City</label>
                                                  <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    ref="shippingCity" 
                                                    @blur="callTaxCalculation()"
                                                    aria-describedby="cityError"
                                                    name="city" 
                                                    id="city" 
                                                    placeholder="City" 
                                                    v-model.trim="$v.orderObj.shippingCity.$model">
                                                  <div v-if="$v.orderObj.shippingCity.$dirty" id="cityError">
                                                    <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingCity.required">
                                                        Please enter your city.
                                                    </div>
                                                  </div>
                                              </div>
                                              
                                              <div class="col-md-6 mb-3">
                                                  <label for="zip" class="hidden">Zip</label>
                                                  <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    ref="shippingZipCode" 
                                                    aria-describedby="zipError"
                                                    @blur="callTaxCalculation()"
                                                    name="zip" 
                                                    id="zip" 
                                                    placeholder="Enter a zip code" 
                                                    required="" 
                                                    v-model.trim="$v.orderObj.shippingZipCode.$model">
                                                  <div v-if="$v.orderObj.shippingZipCode.$dirty" id="zipError">
                                                    <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingZipCode.required">
                                                        Zip code required.
                                                    </div>
                                                    <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingZipCode.isNumValidator">
                                                        Only numeric characters allowed.
                                                    </div>
                                                    <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingZipCode.maxLength">
                                                        <span>{{orderObj.shippingCountry == 'US' ? 'Invalid zipcode. Please enter a valid, 5-digit zipcode':'Invalid zipcode. Please enter a valid zipcode'}}  </span>
                                                    </div>
                                                    <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingZipCode.minLength">
                                                        <span>{{orderObj.shippingCountry == 'US' ? 'Invalid zipcode. Please enter a valid, 5-digit zipcode':'Invalid zipcode. Please enter a valid zipcode, 10-character limit exceeded'}} </span>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>
                                          

                                      </div>
                                        
                                      <div class="col-lg-5">
                                          <h5>Shipping Method</h5>
                                          <div class="shippingMethodOptions">
                                            <p v-for="(method,i) in  shippingModes" :key="i">
                                                <label class="form-control" :class="selectedShippingMethod == method.shipModeId ? 'bold':''"><input type="radio" name="shippingMethodRadio" v-model="selectedShippingMethodValue" @change="selectedShippingMethod = method.shipModeId,orderObj.shippingMethod = method.shipModeId;orderObj.shippingModeDescription = method.shipModeDescription;showTotalPrice()" :value="method.shipModebasePrice"/>{{method.shipModeDescription}}</label>
                                            </p>      
                                            <!-- <p ><label class="form-control" :class="selectedShippingMethod == 1 ? 'bold':''"><input type="radio" name="shippingMethodRadio" v-model="selectedShippingMethodValue" @change="selectedShippingMethod = 1,orderObj.shippingMethod = 'Free : 2 - 4 Day'; showTotalPrice()" value="FREE"/> Free : 2 - 4 Day</label></p>
                                            <p ><label class="form-control" :class="selectedShippingMethod == 2 ? 'bold':''"><input type="radio" name="shippingMethodRadio" v-model="selectedShippingMethodValue" @change="selectedShippingMethod = 2,orderObj.shippingMethod = '$4.99 - UPS 2nd Day'; showTotalPrice()" value="4.99"/> $4.99 - UPS 2nd Day</label></p>
                                            <p ><label class="form-control" :class="selectedShippingMethod == 3 ? 'bold':''"><input type="radio" name="shippingMethodRadio" v-model="selectedShippingMethodValue" @change="selectedShippingMethod = 3,orderObj.shippingMethod = '$12.99 - UPS Next Day'; showTotalPrice()" value="12.99"/> $12.99 - UPS Next Day</label></p> -->
                                          </div>
                                        <!-- <div v-if="$v.orderObj.shippingMethod.$dirty">
                                            <div class="error text-danger fnt12"  v-if="!$v.orderObj.shippingMethod.required">
                                                Shipping Method required.
                                            </div
                                        </div> -->
                                      </div>
                                  </div>
                              </div>
                              <!-- shipform -->
                          </div>
                      </div>
                      <div v-if="$v.orderObj.shippingType.$dirty" ref="shippingType">
                        <div class="error text-danger fnt12" v-if="!$v.orderObj.shippingType.required">
                            Please select pick-up/delivery option.
                        </div>
                      </div>    

              </div>
          </div>
            <div class="row credttDetailsContainer" style="margin-top:5px" v-if="((userSettings.secureRental == 'true') && (addedItems.length == 0) && (orderObj.shippingType == 2 || orderObj.shippingType == 1)) || ((userSettings.secureRental == 'false') && (addedItems.length == 0) && (orderObj.shippingType == 2 && (orderObj.shippingMethod == 154064 || orderObj.shippingMethod == 154065 || orderObj.shippingMethod == 154066))) || (addedItems.length > 0 && (orderObj.shippingType == 1 || orderObj.shippingType == 2))">
                <div class="col-12">
                    <hr />
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h3>Card Information</h3>
                </div>
                <CardInformation @paymentResponse="assignPaymentResponse" ref="creditDetails" :submitClicked="submitClicked"/>
                <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4" v-if="!(orderObj.shippingType == 1 && userSettings.secureRental == 'true' && addedItems.length == 0)">
                    <div class="row">
                        <div class="col-lg-12">
                            <h5>Current payment details</h5>
                            <div class="paymentDetailsBox">
                                <div class="row">
                                    <div class="col-7" v-if="!(subTotalPrice.toFixed(2) == '0.00')">Add On total</div>
                                    <div class="col-5 text-right" v-if="!(subTotalPrice.toFixed(2) == '0.00')">$ {{subTotalPrice.toFixed(2)}}</div>

                                    <div class="col-7"  v-if="this.selectedShippingMethodValue !== 'FREE' && !(orderObj.shippingType == 1)">Shipping</div>
                                    <div class="col-5 text-right"  v-if="this.selectedShippingMethodValue !== 'FREE' && !(orderObj.shippingType == 1)"><span v-if="this.selectedShippingMethodValue !== 'FREE' && !(orderObj.shippingType == 1) && Object.keys(taxInformation).length > 0 && taxInformation.message.shippingCost!=='0'">$ {{parseFloat(taxInformation.message.shippingCost).toFixed(2)}}</span><span v-else> NA </span> </div>
                                    


                                    <div class="col-7">Taxes</div>
                                    <div class="col-5 text-right" v-if="Object.keys(taxInformation).length > 0 && taxInformation.message.tax!=='0'">$ {{parseFloat(taxInformation.message.tax).toFixed(2)}}</div>                                
                                    <div class="col-5 text-right" v-else>NA</div>                                
                                </div>  
                                <hr />
                                <div class="row totalPriceRow">
                                    <div class="col-6"><strong>TOTAL</strong></div>
                                    <div class="col-6 text-right"><strong> {{totalPrice.toFixed(2) == '0.00' ? 'NA' : '$ '+totalPrice.toFixed(2)}}</strong></div>
                                </div>  
                            </div>    
                        </div>    
                    </div>
                </div>        
            </div>
        </div>
          
        <!-- <hr class="col-lg-12" v-if="((userSettings.secureRental == 'true') && (addedItems.length == 0) && (orderObj.shippingType == 2 || orderObj.shippingType == 1)) || ((userSettings.secureRental == 'false') && (addedItems.length == 0) && (orderObj.shippingType == 2 && (orderObj.shippingMethod == 154064 || orderObj.shippingMethod == 154065 || orderObj.shippingMethod == 154066))) || (addedItems.length > 0 && (orderObj.shippingType == 1 || orderObj.shippingType == 2))"/> -->
                
      </div>

      <div class="reviewRentalAgreement col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0" v-if="(!orderStatus || !includedOrderStatus)">
        <div v-if="((userSettings.secureRental == 'true') && (addedItems.length == 0) && (orderObj.shippingType == 2 || orderObj.shippingType == 1)) || ((userSettings.secureRental == 'false') && (addedItems.length == 0) && (orderObj.shippingType == 2 && (orderObj.shippingMethod == 154064 || orderObj.shippingMethod == 154065 || orderObj.shippingMethod == 154066))) || (addedItems.length > 0 && (orderObj.shippingType == 1 || orderObj.shippingType == 2))">
            <h3>Billing Address</h3>
            <p style="font-weight:unset!important">
                <label for="sameBillingAddress" :class="billingAddress == 'sameAddress' ? 'bold':''">
                    <input type="radio" id="sameBillingAddress" value="sameAddress" name="paymentInformation"  v-model="billingAddress" :disabled="orderObj.shippingType == 1"/> 
                    Same as Shipping Address
                </label>
            </p>
            <p style="font-weight:unset!important">
                <label for="diffBillingAddress" :class="billingAddress == 'newAddress' ? 'bold':''">
                    <input type="radio" id="diffBillingAddress" value="newAddress" name="paymentInformation"  v-model="billingAddress"/> 
                    Add Billing Address
                </label>
            </p>
        </div>

        <div class="" v-if="(((userSettings.secureRental == 'true') && (addedItems.length == 0) && (orderObj.shippingType == 2 || orderObj.shippingType == 1)) || ((userSettings.secureRental == 'false') && (addedItems.length == 0) && (orderObj.shippingType == 2 && (orderObj.shippingMethod == 154064 || orderObj.shippingMethod == 154065 || orderObj.shippingMethod == 154066))) || (addedItems.length > 0 && (orderObj.shippingType == 1 || orderObj.shippingType == 2))) && billingAddress === 'newAddress'">
          <div class="container-fluid">
            <div class="row">
                <div class="col-lg-8">

                    <div class="mb-3">
                        <label for="addressNew" class="hidden">Address</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            ref="billingAddress1" 
                            aria-describedby="addressNewError"
                            name="addressNew" 
                            maxlength="35" 
                            id="addressNew" 
                            placeholder="Address Line 1" 
                            required="" 
                            v-model.trim="$v.orderObj.billingAddress1.$model">
                        <div v-if="$v.orderObj.billingAddress1.$dirty">
                            <div class="error text-danger fnt12" id="addressNewError" v-if="!$v.orderObj.billingAddress1.required">
                                Please enter your billing address.
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="addressNew2" class="hidden">Address 2 <span class="text-muted">(Optional)</span></label>
                        <input 
                            type="text" 
                            class="form-control" 
                            ref="billingAddress2" 
                            aria-describedby="addressNew2Error"
                            name="addressNew2" 
                            maxlength="35" 
                            id="addressNew2" 
                            placeholder="Address Line 2 (Optional)" 
                            v-model="$v.orderObj.billingAddress2.$model">
                        <div v-if="$v.orderObj.billingAddress2.$dirty">
                            <div class="error text-danger fnt12" id="addressNew2Error" v-if="!$v.orderObj.billingAddress2.maxLength">
                                Only 35 characters allowed.
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="countryNew" class="hidden">Country</label>
                            <select class="custom-select d-block w-100" ref="billingCountry" name="countryNew" id="countryNew" required="" v-model="orderObj.billingCountry" >  <!-- v-model="orderObj.shippingCountry" -->
                                <option :selected="country == 'US' || country == 'CA'" v-for="(country,i) in countryList" :value="country.code" :key="i">{{country.country}}</option>
                            </select>
                            <div class="invalid-feedback">
                                Please select a valid country.
                            </div>
                        </div> 
                        <div class="col-md-6 mb-3">
                            <label for="phoneNumber" class="hidden">Phone Number</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                ref="billingPhoneNumber" 
                                aria-describedby="phoneNumberError"
                                name="phoneNumber" 
                                id="phoneNumber" 
                                placeholder="Phone Number" 
                                value="" 
                                required="" 
                                v-model.number.trim="$v.orderObj.billingPhoneNumber.$model">
                            <div v-if="$v.orderObj.billingPhoneNumber.$dirty" id="phoneNumberError">
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingPhoneNumber.required">
                                    Valid Phone number is required.
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingPhoneNumber.numeric">
                                    Only numeric characters allowed.
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingPhoneNumber.maxLength">
                                    <span>{{orderObj.billingCountry == 'US' ? 'Invalid Telephone Number. Please enter a valid, 10-digit Telephone number':'Invalid Telephone Number. Please enter a valid, 13-digit Telephone number'}}  </span>
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingPhoneNumber.minLength">
                                    <span>{{orderObj.billingCountry == 'US' ? 'Invalid Telephone Number. Please enter a valid, 10-digit Telephone number':'Invalid Telephone Number. Please enter a valid, 13-digit Telephone number'}} </span>
                                </div>
                            </div>
                        </div>  
                    </div>

                    <div class="row">
                        <div class="col-md-12 mb-3" v-if="this.orderObj.billingCountry == 'US' || this.orderObj.billingCountry == 'CA'">
                            <label for="stateNew" class="hidden">State</label>
                            <select 
                                class="custom-select d-block w-100" 
                                ref="billingState" 
                                aria-describedby="stateNewError"
                                name="stateNew" 
                                id="stateNew" 
                                required="" 
                                v-model.lazy="$v.orderObj.billingState.$model">  <!-- v-model="orderObj.shippingState" -->
                                <option selected disabled>State</option>
                                <option v-for="(state,i) in billingStateList" :value="state.code" :key="i">{{state.state}}</option>
                            </select>
                            <div v-if="$v.orderObj.billingState.$dirty">
                            <div class="error text-danger fnt12" id="stateNewError" v-if="!$v.orderObj.billingState.billingStateValidator">
                                Please select valid state.
                            </div>
                            </div>
                        </div>
                    </div>

                      <div class="row">
                          <div class="col-md-6 mb-3">
                              <label for="cityNew" class="hidden">City</label>
                              <input 
                                type="text" 
                                class="form-control"
                                ref="billingCity" 
                                aria-describedby="cityNewError" 
                                name="cityNew" 
                                id="cityNew" 
                                placeholder="City" 
                                v-model.trim="$v.orderObj.billingCity.$model">
                              <div v-if="$v.orderObj.billingCity.$dirty">
                                <div class="error text-danger fnt12" id="cityNewError" v-if="!$v.orderObj.billingCity.required">
                                    Please enter your city.
                                </div>
                              </div>    
                          </div>
                          
                          <div class="col-md-6 mb-3">
                              <label for="zipNew" class="hidden">Zip</label>
                              <input 
                                type="text" 
                                class="form-control" 
                                ref="billingZipCode" 
                                aria-describedby="zipNewError" 
                                name="zipNew" 
                                id="zipNew" 
                                placeholder="Enter a zip code" 
                                required="" 
                                v-model.trim="$v.orderObj.billingZipCode.$model">
                              <div v-if="$v.orderObj.billingZipCode.$dirty" id="zipNewError">
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingZipCode.required">
                                    Zip code required.
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingZipCode.billingNumValidator">
                                    Only numeric characters allowed.
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingZipCode.maxLength">
                                    <span>{{orderObj.billingCountry == 'US' ? 'Invalid zipcode. Please enter a valid, 5-digit zipcode':'Invalid zipcode. Please enter a valid  zipcode.'}}  </span>
                                </div>
                                <div class="error text-danger fnt12" v-if="!$v.orderObj.billingZipCode.minLength">
                                    <span>{{orderObj.billingCountry == 'US' ? 'Invalid zipcode. Please enter a valid, 5-digit zipcode':'Invalid zipcode. Please enter a valid zipcode, 10-character limit exceeded .'}} </span>
                                </div>
                              </div>
                          </div>
                      </div>
                </div>

                <div class="col-lg-6">

                </div>
            </div>
        </div>
        </div>
        <hr />

        <p class="policyCheckPara">
          <label for="rentalPolicyGuidelinesCheckbox">
            <input type="checkbox" id="rentalPolicyGuidelinesCheckbox" v-model="rentalPolicyGuidelinesCheckbox" />
            <span>I agree with the BNC <a class="uppercaseText" href="javascript:void(0)" id="rentalPolicyGuidelines" title="RENTAL POLICY AND GUIDELINES" data-toggle="modal" data-target="#rentalPolicyWrap">RENTAL POLICY AND GUIDELINES</a></span>
          </label>
        </p>
        <p class="policyCheckPara">
          <label for="termsConditionsCheckbox">
            <input type="checkbox" id="termsConditionsCheckbox" v-model="termsConditionsCheckbox" />
            <span>By clicking "Submit", you acknowledge you have read and agree to the BNC <a class="uppercaseText" href="javascript:void(0)" id="termsOfUse" title="TERMS OF USE" data-toggle="modal" data-target="#termsOfUseWrap">TERMS OF USE</a> and <a class="uppercaseText" href="javascript:void(0)" id="privacyPolicy" title="PRIVACY POLICY" data-toggle="modal" data-target="#privacyPolicyWrap">PRIVACY POLICY</a>.</span>
          </label>
        </p>
        <hr />
      </div>

      <div class="modal fade" id="rentalPolicyWrap" tabindex="-1" role="dialog" aria-labelledby="rentalPolicyGuidelines" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">BNC TEXTBOOK RENTAL AGREEMENT</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>This rental agreement is a contract between you and Barnes & Noble College Booksellers, LLC (BNC) and applies to your rental of textbooks and/or course related materials from us. This agreement sets forth your rights and obligations and should be read carefully.</p>
              <p>If receiving rental materials at a BNC store or accessing the materials on the BNC website, by providing your signature, or clicking "I Agree" or "I Accept" at the point of sale, you agree to the terms and conditions of this agreement, our privacy policy, our terms of use, and any other documents incorporated into the website from which you accessed the materials. You agree this agreement is legally binding as between you and BNC. A copy of this agreement will be posted in the bookstore, presented online at checkout, or accessible on the BNC bookstore website.</p>
              <p>We may modify this agreement from time to time and may post such changes on the website. It is important that you review the website regularly to ensure you are aware of any changes.</p>
              <p>For questions regarding this agreement, please contact your campus bookstore.</p>

              <h6>TERMS AND CONDITIONS</h6>
                <ul>
                    <li>You must be 18 years of age or older.</li>
                    <li>All information provided by you in connection with this agreement must be accurate and complete.</li>
                    <li>You must have a valid securing tender on file with us at all times. Credit/debit cards provided as a securing tender must be a personal credit/debit card. In the event you provide us a student ID number as the securing tender, you hereby authorize your school or BNC to charge your school account for any fees owed hereunder.</li>
                    <li>Rented materials remain the property of BNC or its authorized supplier. Your acceptance of rented materials and paying rental fees entitles you to use the property of BNC or authorized supplier for a limited amount of time and only for personal, non-commercial, and non-transferable use. At the end of the rental period, this agreement will terminate and you will lose all rights to the rented materials.</li>
                    <li>Rented materials can be refunded and then purchased during the first two weeks of classes only. Rented materials identified as rental only titles are not available for purchase at any time.</li>
                    <li>Rented materials must be returned to the bookstore from which they were originally rented by the rental return date designated by us at the time of rental and in salable condition. Salable condition will be determined by us in our sole discretion, but generally means book spine intact, without excessive damage or any water damage to the cover or contents, all original pages intact, all original components present, and no excessive highlighting, writing or other markings. Normal use highlighting and writing is permitted.</li>
                    <li>You are responsible for loss or theft of all rented materials. Rented materials not returned by the rental return date or returned on or before that date not in salable condition will be subject to non-return processing fees equal to 75% of the new book price (at the time of rental) plus a 7.5% non-return processing fee. Non-return processing fees will be automatically charged to the securing tender on file for this agreement. In the event that the securing tender on file is no longer valid or if the purchasing limit on the securing tender has been exceeded, we will contact you for, and you agree to promptly pay in full, the non-return processing fees with an alternative payment method accepted at the bookstore. Returns shipped via UPS, USPS or other carriers must be postmarked and shipped on or before the rental return date.</li>
                    <li>If you have not returned the rented materials by the rental return date and we are unable to charge your securing tender, it is your responsibility to pay the non-return processing fees immediately. You will be notified via the email address you provided at the time of rental if your securing tender was declined; you then will have 15 days to pay the fees before your account and any information, including personally identifiable information, you have provided to us is turned over to a collection agency ("agency").</li>
                    <li>You agree that BNC and any agency it hires to collect any fees you owe hereunder may contact you or your parent or legal guardian, whether via e-mail, cell phone (including but not limited to text messages) or otherwise. You confirm that you or your parent or legal guardian are the only person(s) who open e-mail at the address you have provided, or that if anyone else opens e-mail at such address, you waive any claims of a violation of your privacy or of potential third party disclosure if persons other than you, your parent, or legal guardian view your e-mail. Additionally, you agree that BNC and any agency it hires may contact you or your parent or legal guardian via U.S. mail, telephone, or cell phone (including but not limited to text messaging) should such contact information be provided by you to BNC or an agency, whether at the time of rental or at any point thereafter, or obtained as provided below regarding your failure to return rented materials or pay applicable fees hereunder.</li>
                    <li>You authorize BNC to share details of your rental transactions with the college, university, or school at which you are enrolled and you acknowledge that your institution may provide BNC with contact information, including but not limited to your e-mail address, student address, home address, home telephone number and cell phone number, any of which may be different than the information you provided to us, for the purpose of contacting you regarding failure to return rented materials or fees you owe BNC hereunder.</li>
                    <li>Standard tax rates apply and vary by state.</li>
                </ul>
                <p><strong>Other conditions may apply. See </strong><a href="http://www.bnctextbookrental.com/" target="_blank"><strong>www.bnctextbookrental.com</strong></a><strong> for details.</strong></p>
            </div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div> -->
          </div>
        </div>
      </div>

      <div class="modal fade" id="termsOfUseWrap" tabindex="-1" role="dialog" aria-labelledby="termsOfUse" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">TERMS OF USE</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <TermsOfUse />
            </div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div> -->
          </div>
        </div>
      </div>

      <div class="modal fade" id="privacyPolicyWrap" tabindex="-1" role="dialog" aria-labelledby="privacyPolicy" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">PRIVACY & SECURITY</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <PrivacyPolicy />
            </div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div> -->
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12" v-if="(!orderStatus || !includedOrderStatus)">
          <center><button :disabled="(!rentalPolicyGuidelinesCheckbox || !termsConditionsCheckbox) || (userSettings.secureRental == 'false' && orderObj.shippingType == 1 && addedItems.length == 0) || (includedOrderStatus && addedItems.length == 0)" class="btn btn-primary btn-md btn-wide btnSubmit" :title="!rentalPolicyGuidelinesCheckbox || !termsConditionsCheckbox ? 'Please Review & Accept Our Rental Agreement to proceed further.' : ''"  @click="OnSubmit()">SUBMIT</button></center>
      </div>

    </div>
</template>

<script>
import BookStoreDetails from './BookStoreDetails';
import CardInformation from './CardInformation';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';
import { getCookie } from "~/cookies.js";
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate);
import { required, maxLength, minLength, between, requiredIf, numeric, maxValue, alphaNum } from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex';
import * as moment from 'moment';

const contains = (addrType,type,addr) =>  (value) => {
        if(type == 2){
            return value!=='State' 
        }
        else{
            return true;
        }
    
} 

const containsNum = (type,addr) => (value) =>{
    if(type == 'US' && addr== 'sameAddress'){
        return (/^[0-9]*$/).test(value);
    }
    else{
        return true;
    }
}

const containsNumber = (type,addr) => (value) =>{
    if(type == 'US' && addr == 'newAddress'){
        return (/^[0-9]*$/).test(value);
    }
    else{
        return true;
    }
}

const billingStateValidator = (value) => value!=='State';
 
const containsState = (addrType,type,addr,shipAddr1,shipFirst,shipLast,shipPhone,shipCity,shipZip) =>  (value) => {
    if(addr == 'newAddress'){
        return value!=='State';
    }
    else if(type == 2 && addr == 'newAddress'){
        return value!=='State';
    }
    else{
        return true;
    }
} 
export default {
  name:'CourseMaterial',
  data(){
      return{
          taxInfo:{},
          paymentResponse:{},
          selected: this.terms[0].termTitle,
          counter:1,
          showAll:true,
          addedItems:[],
          hover:false,
          displayItems:[],
          selectedPrice : '',
          selectedPricesList : {},
          subTotalPrice: 0,
          totalPrice:0,
          termsConditionsCheckbox:false,
          rentalPolicyGuidelinesCheckbox: false,
          globalBookIdentifier:'',
          showmsg:'Select Price',
          selectIds:[],
          selectedPriceObj:{},
          valueChanged:false,
          selectedShippingMethod:null,
          selectedShippingMethodValue: null,
          shippingMethod:'',
          priceObj:{},
          billingAddress: '',
          storeClassList:'',
          shippingClassList:'',
          orders : {},
          wcsCourseOrders:[],
          gmItemsCourseOrders:[],
          wcsEnrollmentArray:[],
          submitClicked : false,
          shippingValidationGroup:{}
      }
  },
  components:{
      BookStoreDetails,
      CardInformation,
      TermsOfUse,
      PrivacyPolicy
  },
  validations(){
      return{
          orderObj:{
        shippingFirstName : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            }),
            maxLength: maxLength(25)
        },
        shippingLastName : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            }),
            maxLength: maxLength(29)
        },
        shippingAddress1 : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            }),
            maxLength: maxLength(35)
        },
        shippingType:{
            required
        },
        // shippingMethod:{
        //     required:requiredIf(function(){
        //         if(this.orderObj.shippingType == 2){
        //             return true;
        //         }
        //     }),
        // },
        shippingAddress2 : {
            maxLength: maxLength(35)
        },
        shippingPhoneNumber : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            }),
            numeric,
            maxLength: this.orderObj.shippingCountry == 'US' ? maxLength(10) : maxLength(13),
            minLength: this.orderObj.shippingCountry == 'US' ? minLength(10) : minLength(13)
        },
        shippingCity : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            })
        },
        shippingZipCode : {
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2){
                    return true;
                }
            }),
            maxLength: this.orderObj.shippingCountry == 'US' ? maxLength(5) : maxLength(10),
            minLength: this.orderObj.shippingCountry == 'US' ? minLength(5) : '',
            isNumValidator: containsNum(this.orderObj.shippingCountry, this.billingAddress)
        },
        shippingState:{
            required:requiredIf(function(){
                if(this.orderObj.shippingType == 2 && (this.orderObj.shippingCountry == 'US' || this.orderObj.shippingCountry == 'Canada')){
                    return true;
                }
            }),
            shippingStateValidator: contains('shipping',this.orderObj.shippingType, this.billingAddress)
        },
        billingAddress1: {
            required:requiredIf(function(){
                 if(this.billingAddress == 'newAddress'){
                     return true;
                 }

                 if((this.orderObj.shippingType == 2 && this.billingAddress == 'newAddress')){
                        return true;
                 }
            }),
            maxLength: maxLength(35)
        },
        billingAddress2: {
            maxLength: maxLength(35)
        },
        billingCity: {
            required:requiredIf(function(){
                 if(this.billingAddress == 'newAddress'){
                     return true;
                 }

                 if(this.orderObj.shippingType == 2 && this.billingAddress == 'newAddress'){
                     
                         return true;
                     
                 }
            })
        },
        billingPhoneNumber:{
            required:requiredIf(function(){
                if(this.billingAddress == 'newAddress'){
                    return true;
                }
                if(this.orderObj.shippingType == 2 && this.billingAddress == 'newAddress'){                    
                    return true;                     
                }
            }),
            numeric,
            maxLength: this.orderObj.billingCountry == 'US' ? maxLength(10) : maxLength(13),
            minLength: this.orderObj.billingCountry == 'US' ? minLength(10) : minLength(13),
        },
        billingZipCode: {
            required:requiredIf(function(){
                 if( this.billingAddress == 'newAddress'){
                     return true;
                 }

                 if(this.orderObj.shippingType == 2 && this.billingAddress == 'newAddress'){
                    
                         return true;
                     
                 }
            }),
            maxLength: this.orderObj.billingCountry == 'US' ? maxLength(5) : maxLength(10),
            minLength: this.orderObj.billingCountry == 'US' ? minLength(5) : '',
            billingNumValidator: containsNumber(this.orderObj.billingCountry, this.billingAddress)
        },
        billingState: {
            billingStateValidator: containsState('billing',this.orderObj.shippingType, this.billingAddress,this.orderObj.shippingAddress1,this.orderObj.shippingFirstName,this.orderObj.shippingLastName,this.orderObj.shippingPhoneNumber,this.orderObj.shippingCity,this.orderObj.shippingZipCode)
        }
        
    } ,
    shippingValidationGroup:['orderObj.shippingAddress1','orderObj.shippingCity','orderObj.shippingState','orderObj.shippingZipCode']
      }
    
  },
  props:[
      'userInformation',
      'courseData',
      'userSettings',
      'courseEnrollmentStatus',
      'bookStoreDetails',
      'terms',
      'statusDates',
      'enrollAndCoursesCount',
      'shippingMode',
      'orderStatus',
      'enrollmentOrderStatus',
      'includedOrderStatus',
      'includedEnrollmentOrderStatus',
      'notIncludedCourseMaterialOrderStatus',
      'includedCourseMaterialOrderStatus',
      'alreadyOrderedItems'],
  watch:{
     
      taxInfo:{
          handler(){
            if(Object.keys(this.taxInfo).length > 0){
                if(this.orderObj.shippingType == 2){
                    if((this.selectedShippingMethodValue !== "" || this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null)) {
                        this.totalPrice = this.subTotalPrice + parseFloat(this.taxInfo.message.shippingCost)+parseFloat(this.taxInfo.message.tax);
                    }
                    else {
                        this.totalPrice = this.subTotalPrice+parseFloat(this.taxInfo.message.tax);
                    }
                }
                else{
                    if((this.selectedShippingMethodValue !== "" || this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null)) {
                        this.totalPrice = this.subTotalPrice+parseFloat(this.taxInfo.message.tax);
                    }
        
                }
                
            }  
            
              console.log(this.taxInfo);
          },
          deep:true
      },
      orderObj:{
          handler(newVal,oldVal){
            let equality = this.isEquivalent(newVal,oldVal);  
            if(newVal && equality){
                this.assignObject(newVal);
            }
            this.$store.dispatch('courseData/assignTaxCalculationFields',this.orderObj);
          },
          deep:true
      },
      selectedShippingMethod(){
        if(this.orderObj.shippingType==2 && (this.$v.shippingValidationGroup["orderObj.shippingAddress1"].required && this.$v.shippingValidationGroup["orderObj.shippingCity"].required && this.$v.shippingValidationGroup["orderObj.shippingState"].required && this.$v.shippingValidationGroup["orderObj.shippingZipCode"].required) && (!this.$v.shippingValidationGroup.$anyError) && (this.$v.shippingValidationGroup.$anyDirty)){
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
        }
        
      },
      'orderObj.shippingCountry'(){
          if(this.orderObj.shippingCountry!=='US' || this.orderObj.shippingCountry!=='US'){
              this.orderObj.shippingState = '';
          }
          
          this.$store.dispatch('courseData/fetchShippingMethods',{bncStoreId:this.orderObj.storeNumber,country:this.orderObj.shippingCountry,type:"shipping"})
        //   this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
          this.$store.dispatch("courseData/fetchStateData",{country:this.orderObj.shippingCountry,type:"shipping"});
      },
      'orderObj.billingCountry'(){
          if(this.orderObj.billingCountry!=='US' || this.orderObj.billingCountry!=='US'){
              this.orderObj.billingState = '';
          }
          
          this.$store.dispatch('courseData/fetchShippingMethods',{bncStoreId:this.orderObj.storeNumber,country:this.orderObj.billingCountry,type:"billing"})
        //   this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
          this.$store.dispatch("courseData/fetchStateData",{country:this.orderObj.billingCountry,type:"billing"});
      },
      paymentResponse:{
        handler(){
            if(Object.keys(this.paymentResponse).length > 0){
                
                this.paymentResponse["storeNumber"] = '';
                this.paymentResponse["unitNumber"] = '';
                this.paymentResponse["company"] = '';
                this.paymentResponse["termCode"] = '';
                this.paymentResponse["termYear"] = '';
                this.paymentResponse["storeNumber"] = this.orderObj.bncStoreId;
                this.paymentResponse["unitNumber"] = this.orderObj.unitNumber;
                this.paymentResponse["company"] = this.orderObj.company;
                this.paymentResponse["termCode"] = this.orderObj.termCode
                
                
                // this.paymentResponse["sisUserId"] = this.$route.query.sisUserId ? this.$route.query.sisUserId : 'b1833266';
                this.$store.dispatch("courseData/createOrder",{"orders":this.orderObj,"paymentDetails":this.paymentResponse});
            }
            
        },
        deep:true
    },
    selected(){
        var selectedTerm = {};
        this.terms.forEach((val,index)=>{
            if(val.termTitle == this.selected){
                selectedTerm = val.id;
                this.orderObj.termCode = val.termCode;
                this.orderObj.termYear = parseInt(val.termYear);
            }
        })
        this.$store.dispatch("courseData/fetchStudentDataOnTermChange",selectedTerm);
    },   
    selectedPriceObj:{
        handler:function(newVal,oldVal){
          if((newVal.hasOwnProperty(this.globalBookIdentifier) && oldVal.hasOwnProperty(this.globalBookIdentifier)) && (newVal[this.globalBookIdentifier]!=oldVal[this.globalBookIdentifier])){
              this.valueChanged = true;
          }
        },
        deep:true
  },
  storeClassList(){

      if(this.storeClassList == 'present' && this.shippingClassList == 'present'){
        this.billingAddress = '';
        this.$store.dispatch('courseData/setShippingType',null);
        if($('#diffBillingAddress')[0]!=undefined && $('#sameBillingAddress')[0]!=undefined){
            $('#sameBillingAddress')[0].checked = false;
            $('#sameBillingAddress')[0].disabled = true;
            $('#diffBillingAddress')[0].checked = false;
            $('#diffBillingAddress')[0].disabled = true;
        }
      }
      if(this.storeClassList == 'absent' && this.userSettings.secureRental == 'true'){
          this.selectedShippingMethodValue = 0.0;
          this.$store.dispatch('courseData/setShippingType',1);
          
          
          if($('#diffBillingAddress')[0]!=undefined && $('#sameBillingAddress')[0]!=undefined){
              $('#diffBillingAddress')[0].disabled = false;
                $('#sameBillingAddress')[0].disabled = true;
                $('#diffBillingAddress')[0].checked = true;
                $('#sameBillingAddress')[0].checked = false;
          }

          if(this.addedItems.length > 0){
                this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);  
          }
      }
    
      if(this.storeClassList == 'absent'  && this.userSettings.secureRental == 'false'){
          this.$store.dispatch('courseData/setShippingType',1);
          this.selectedShippingMethodValue = 0.0;
          if(this.addedItems.length > 0){
              
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
            // if(this.selectedShippingMethodValue !== "" || this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null) {
            //         this.totalPrice = this.subTotalPrice + parseFloat(this.taxInfo.message.tax);
            // }
            // else {
            //     this.totalPrice = this.subTotalPrice;
            // }
          }
      }
     
      
  },
  shippingClassList(){

      if(this.storeClassList == 'present' && this.shippingClassList == 'present'){
        this.billingAddress = '';
        this.$store.dispatch('courseData/setShippingType',null);
        if($('#diffBillingAddress')[0]!=undefined && $('#sameBillingAddress')[0]!=undefined){
            $('#sameBillingAddress')[0].checked = false;
            $('#sameBillingAddress')[0].disabled = true;
            $('#diffBillingAddress')[0].checked = false;
            $('#diffBillingAddress')[0].disabled = true;
        }
      }

      if(this.shippingClassList == 'absent'){
          this.selectedShippingMethodValue = this.shippingMode[0].shipModebasePrice;
          this.selectedShippingMethod = this.shippingMode[0].shipModeId;    
            Object.keys(this.taxInformation).forEach((val,index)=>{
                delete this.taxInformation[val];
            });
            this.totalPrice = 0;
            // this.taxInformation = {};
            // this.taxInfo = {};
            if(Object.keys(this.taxInformation) > 0){
                if(this.selectedShippingMethodValue !== "" || this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null) {
                    this.totalPrice = this.subTotalPrice + parseFloat(this.taxInfo.message.shippingCost)+parseFloat(this.taxInfo.message.tax);
                    console.log(this.totalPrice);
                }
                else {
                    this.totalPrice = this.subTotalPrice+parseFloat(this.taxInformation.message.tax);
                }
            }
          this.$store.dispatch('courseData/setShippingType',2);  
      }
  },
  billingAddress(){
      if(this.billingAddress == 'sameAddress'){
          this.orderObj["isBillingSameAsShipping"] = true;
          this.orderObj.billingAddress1 = '';
                this.orderObj.billingAddress2 = '';
                this.orderObj.billingCity = '';
                
                this.orderObj.billingZipCode = '';
      }
      else{
          this.orderObj["isBillingSameAsShipping"] = false;
      }
  }
  },
  filters:{
      convertDate:function(value){
          
          return moment.utc(value).format('L')
      },
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString().toLowerCase()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
  },
 
  created(){
      Object.keys(this.bookStoreDetails).forEach((val)=>{
        if(this.bookStoreDetails[val] == null || this.bookStoreDetails[val] == ''){
          delete this.bookStoreDetails[val];
        }
      })
    if(this.shippingModes.length > 0){
        this.orderObj.shippingMethod = this.shippingModes[0].shipModeId;
        this.selectedShippingMethodValue = this.shippingModes[0].shipModebasePrice;
        this.selectedShippingMethod = this.shippingModes[0].shipModeId;
    }  
    
    this.totalPrice = parseFloat('0.00');
    // if(this.selectedShippingMethodValue !== "" || this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null) {
    //     this.totalPrice = this.subTotalPrice + parseFloat(this.selectedShippingMethodValue);
    // }
    // else {
    //     this.totalPrice = this.subTotalPrice;
    // }

    let emailId = "";
    var cookie = getCookie("user");
    if(cookie){
      var user = JSON.parse(cookie);
      let emailId = user.userEmail;
        this.orderObj.termYear = parseInt(this.terms[0].termYear);
        this.orderObj.termCode = this.terms[0].termCode;
        let _this = this;
        Object.keys(this.coursesData).forEach((val,index)=>{
                if((_this.coursesData[val]).hasOwnProperty('includedItems')){
                    if(_this.alreadyOrderedItems.length > 0){
                        _this.coursesData[val]['includedItems'].forEach((item,index1)=>{
                            if(!_this.alreadyOrderedItems.includes(item.bookNumber)){
                                this.insertingIncludedMaterials(val, _this.coursesData);
                            }
                        })
                    }
                    else{
                            this.insertingIncludedMaterials(val, _this.coursesData);    
                        }
                    }
                })
                this.$store.dispatch("courseData/assignOrderEnrollments",this.wcsCourseOrders);   
                this.$store.dispatch("courseData/assignTaxCalOrderEnrollments",this.wcsCourseOrders);
    } else {
        
      this.$router.push("/unauthorized");
    }
  },
  mounted(){      
      $('.courseDetailsWrap h3').text().charAt(0).toUpperCase();
        
        if($('#diffBillingAddress')[0]!=undefined && $('#sameBillingAddress')[0]!=undefined){
            $('#sameBillingAddress')[0].checked = false;
            $('#diffBillingAddress')[0].checked = false;
        }
    this.focusHeader();
  },
  methods:{
    assignObject(newVal){

        this.orderObj = {...newVal};
        
        //  
    },
    isEquivalent(a, b) {
    // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    },  
    callTaxCalculation(){
        if((this.$v.shippingValidationGroup["orderObj.shippingAddress1"].required && this.$v.shippingValidationGroup["orderObj.shippingCity"].required && this.$v.shippingValidationGroup["orderObj.shippingState"].required && this.$v.shippingValidationGroup["orderObj.shippingZipCode"].required) && (!this.$v.shippingValidationGroup.$anyError) && (this.$v.shippingValidationGroup.$anyDirty) && (this.orderObj.shippingType == 2)){
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
        }
    },
    insertingNotIncludedMaterials(item, wcsOrderData, enrollment, bookIdentifier){
        if(item.fdcTag !== 3){
            wcsOrderData["enrollmentId"] = enrollment.enrollment.enrollmentId;
            wcsOrderData["course"] = enrollment.enrollment.course;
            wcsOrderData["termCode"] =this.terms[0].termCode;
            wcsOrderData["unit"] = parseInt(enrollment.enrollment.unit);
            wcsOrderData["termYear"] = parseInt(this.terms[0].termYear);
            wcsOrderData["department"] = enrollment.enrollment.department;
            wcsOrderData["company"] = enrollment.enrollment.company;
            wcsOrderData["section"] = enrollment.enrollment.section;
            if(!item.fromCpt){
                wcsOrderData["courseMaterialList"].push({
                'isbn':item.isbn,
                'mbsBookNumber':parseInt(item.bookNumber),
                'fdcOrderItemId':111,
                'tbPreference':'BN',
                'quantity':1,
                'price':this.selectedPricesObj['courseMaterial'+bookIdentifier] == '' && this.selectedPricesObj['courseMaterial'+bookIdentifier] == null ? 0 : parseFloat(this.selectedPricesObj['courseMaterial'+bookIdentifier])
                });
            }
            
            this.wcsCourseOrders.push(wcsOrderData)
        }
    },  
    insertingGMMaterials(item, bookIdentifier){
        if(item.fdcTag == 3 && !item.fromCpt){
            this.gmItemsCourseOrders.push({
                'sku':item.bookNumber,
                'fdcOrderItemId':"",
                'quantity':1,
                'price':this.selectedPricesObj['courseMaterial'+bookIdentifier] == '' && this.selectedPricesObj['courseMaterial'+bookIdentifier] == null ? 0 : parseFloat(this.selectedPricesObj['courseMaterial'+bookIdentifier])
            })
        }
    },  
    insertingNotIncludedMaterialsInAlreadyPresentEnrollment(item,bookIdentifier,enrollment){
         if(item.fdc_tag!=3 && !item.fromCpt){
            this.$store.dispatch('courseData/pushCourseMaterial',{"courseMaterial":{
            'isbn':item.isbn,
            'mbsBookNumber':parseInt(item.bookNumber),
            'fdcOrderItemId':'111',
            'tbPreference':'BN',
            'quantity':1,
            'price':this.selectedPricesObj['courseMaterial'+bookIdentifier] == '' && this.selectedPricesObj['courseMaterial'+bookIdentifier] == null ? 0 : parseFloat(this.selectedPricesObj['courseMaterial'+bookIdentifier])
            },"enrollmentId":enrollment.enrollment.enrollmentId})
        }
    },
    insertingIncludedMaterials(val,coursesData){
        let wcsOrderData = {
            enrollmentId:'',
            unit:"",
            type:'included',
            termCode:"",
            company:"",
            termYear:"",
            department:"",
            course:"",
            section:"",
            courseMaterialList:[]
        }
    
        this.wcsEnrollmentArray.push({
            id:coursesData[val]['enrollment']['enrollmentId'],
            unit:coursesData[val]['enrollment']['unit'],
            type:'included',
            termCode:this.terms[0].termCode,
            termYear:this.terms[0].termYear,
            company:coursesData[val]['enrollment']['company'],
            department:coursesData[val]['enrollment']['department'],
            course:coursesData[val]['enrollment']['course'],
            section:coursesData[val]['enrollment']['section']
        })

        wcsOrderData['enrollmentId'] = coursesData[val]['enrollment']['enrollmentId'];
        wcsOrderData['unit']=parseInt(coursesData[val]['enrollment']['unit']),
        wcsOrderData['type']='included',
        wcsOrderData['termCode']=this.terms[0].termCode,
        wcsOrderData['termYear']=parseInt(this.terms[0].termYear),
        wcsOrderData['department']=coursesData[val]['enrollment']['department'],
        wcsOrderData['company']=coursesData[val]['enrollment']['company'],
        wcsOrderData['course']=coursesData[val]['enrollment']['course'],
        wcsOrderData['section']=coursesData[val]['enrollment']['section']
        coursesData[val]['includedItems'].forEach((item,index1)=>{
            if(!item.digital && !item.fromCpt){
                wcsOrderData['courseMaterialList'].push({
                    'isbn':item.isbn,
                    'mbsBookNumber':parseInt(item.bookNumber),
                    'fdcOrderItemId':'111',
                    'tbPreference':'FDC',
                    'quantity':1,
                    'price':item.hasOwnProperty('prices') && (item.prices[0]['new_price']!==null && item.prices[0]['new_price']!=='') ? parseFloat(item.prices[0]['new_price']) : 0
                })
            }
            
        })
        this.wcsCourseOrders.push(wcsOrderData);
    },
    assignPaymentResponse(resp){
        this.paymentResponse = {...resp};
    },
    showTotalPrice() {
      if((this.$v.shippingValidationGroup["orderObj.shippingAddress1"].required && this.$v.shippingValidationGroup["orderObj.shippingCity"].required && this.$v.shippingValidationGroup["orderObj.shippingState"].required && this.$v.shippingValidationGroup["orderObj.shippingZipCode"].required) && (!this.$v.shippingValidationGroup.$anyError) && (this.$v.shippingValidationGroup.$anyDirty)){
            if(this.selectedShippingMethodValue !== "FREE" || this.selectedShippingMethodValue !== null || this.selectedShippingMethodValue !== '') {
                this.totalPrice = this.subTotalPrice + parseFloat(this.taxInfo.message.shippingCost)+parseFloat(this.taxInfo.message.tax);
            } else {
                this.totalPrice = this.subTotalPrice+parseFloat(this.taxInformation.message.tax);
            }
      } 
      
      if(Object.keys(this.taxInformation) == 0){
          this.totalPrice = this.subTotalPrice;
      }
      
      return this.totalPrice;
    },
    getDataAttr(bookIdentifier){
        let rendered = false;
        if(Object.keys($('#priceDropDown'+bookIdentifier)).length > 0){
            rendered = true;
        }
        if(rendered){
            return $('#priceDropDown'+bookIdentifier)[0].value;
        }
    },
    focusHeader() {
      if(this.$refs!=undefined && this.$refs.contentheader!=undefined){
          this.$refs.contentHeader.focus();
      }  
      
    },
    expandAndHideAll(){

      this.counter++;
      if(this.counter % 2 == 0){

        Object.keys(this.coursesData).forEach((val,index)=>{
            if($('#collapse'+index).hasClass('show')){
                $('#collapse'+index).removeClass('show')
            }

            $('#collapse'+index).collapse('show');
        })
          this.showAll = false;
      }
      else{
        Object.keys(this.coursesData).forEach((val,index)=>{
            $('#collapse'+index).collapse('hide');
        })
          this.showAll = true;
      }
    },
    assignSelectedPrice(event,bookIdentifier){
        let indexPos = '';
        let copiedobj = {...this.selectedPriceObj};
        this.$set(copiedobj,bookIdentifier,event.target.value);
        this.selectedPriceObj = copiedobj;
        if(!this.selectIds.includes(bookIdentifier)){
            this.selectIds.push(bookIdentifier);
        }

            let _this = this;
            if(this.displayItems.length > 0 && this.addedItems.length > 0){
                this.addedItems.forEach((item,index)=>{
                    if(item.primary.length!=0){
                        item.primary.forEach((val,index)=>{
                            if(val.price == event.target.value){
                                indexPos = _this.addedItems.indexOf(item);
                                _this.addedItems.splice(indexPos,1);
                            }
                        })
                    }
                    if(item.buy.length!=0){
                        item.buy.forEach((val,index)=>{
                            if(val.price == event.target.value){
                                indexPos = _this.addedItems.indexOf(item);
                                _this.addedItems.splice(indexPos,1);
                            }
                        })
                    }
                    if(item.rent.length!=0){
                        item.rent.forEach((val,index)=>{
                            if(val.price == event.target.value){
                                indexPos = _this.addedItems.indexOf(item);
                                _this.addedItems.splice(indexPos,1);
                            }
                        })
                    }

                })


            }
            this.selectedPrice = event.target.value;
            this.globalBookIdentifier = bookIdentifier;
            
    },
    navigateToSuccess(){
      this.$router.push('success')
    },
    insertSelectedItem(event,enrollment,item,i,bookIdentifier){
        let _this = this;
        let obj = {
            id:enrollment.enrollment.enrollmentId,
            type:'notIncluded'
        }

        let wcsOrderData = {};
        
    
        wcsOrderData = {
            enrollmentId:'',
            unit:"",
            company:'',
            type:'notIncluded',
            termCode:"",
            termYear:"",
            department:"",
            course:"",
            section:"",
            courseMaterialList:[]
        }


        if(this.wcsEnrollmentArray.some(key => (key.id == enrollment.enrollment.enrollmentId && key.type == 'notIncluded'))){
            this.wcsCourseOrders.forEach((val,index)=>{
                if((val.enrollmentId == enrollment.enrollment.enrollmentId) && (val.type == 'notIncluded')){
                    if(_this.alreadyOrderedItems.length > 0){
                        if(!_this.alreadyOrderedItems.includes(item.bookNumber)){
                            this.insertingNotIncludedMaterialsInAlreadyPresentEnrollment(item, bookIdentifier, enrollment);
                        }
                    }
                    else{
                        this.insertingNotIncludedMaterialsInAlreadyPresentEnrollment(item, bookIdentifier, enrollment);     
                    }        
                }
            })
            if(_this.alreadyOrderedItems.length > 0){
                if(!_this.alreadyOrderedItems.includes(item.bookNumber)){
                    this.insertingGMMaterials(item, bookIdentifier);
                }    
            }
            else{
               this.insertingGMMaterials(item, bookIdentifier);
            }
        }
        else{
            let obj = {
                        id:enrollment.enrollment.enrollmentId,
                        type:'notIncluded'
                    }
            this.wcsEnrollmentArray.push(obj);
            
            
            if(_this.alreadyOrderedItems.length > 0){
                if(!_this.alreadyOrderedItems.includes(item.bookNumber)){
                    this.insertingNotIncludedMaterials(item, wcsOrderData, enrollment, bookIdentifier);         
                }
            }
            else{
                this.insertingNotIncludedMaterials(item, wcsOrderData, enrollment, bookIdentifier);         
            }        
            
            if(_this.alreadyOrderedItems.length > 0){
                if(!_this.alreadyOrderedItems.includes(item.bookNumber)){
                    this.insertingGMMaterials(item, bookIdentifier);
                }
            }
            else{
                this.insertingGMMaterials(item, bookIdentifier);
            }        
        }

        if(item.fdcTag == 3){
            this.$store.dispatch("courseData/assigngmItemsOrderEnrollments",this.gmItemsCourseOrders); 
            this.$store.dispatch("courseData/assignTaxCalGmItemsOrderEnrollments",this.gmItemsCourseOrders); 
        }
        else{
            this.$store.dispatch("courseData/assignOrderEnrollments",this.wcsCourseOrders); 
            this.$store.dispatch("courseData/assignTaxCalOrderEnrollments",this.wcsCourseOrders);
        } 
        
        if(this.orderObj.shippingType == 1){
            
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
        }

        if((this.$v.shippingValidationGroup["orderObj.shippingAddress1"].required && this.$v.shippingValidationGroup["orderObj.shippingCity"].required && this.$v.shippingValidationGroup["orderObj.shippingState"].required && this.$v.shippingValidationGroup["orderObj.shippingZipCode"].required) && (!this.$v.shippingValidationGroup.$anyError) && (this.$v.shippingValidationGroup.$anyDirty) && (this.orderObj.shippingType == 2)){
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
        }

                
        let copiedobj = {...this.selectedPriceObj};
        let tempObj = {};
        this.$set(copiedobj,bookIdentifier,$("#button"+bookIdentifier).attr("data-selected"));
        this.selectedPriceObj = copiedobj;
        var indexPos = '';

        if(this.displayItems.length > 0 && this.valueChanged){
            this.displayItems.forEach((item,index)=>{
                if(item.bookNumber == bookIdentifier){
                    indexPos = _this.displayItems.indexOf(item);
                    _this.displayItems.splice(indexPos,1);
                    _this.subTotalPrice -= parseFloat(item.price);
                    _this.subTotalPrice = _this.subTotalPrice.toFixed(2);
                    _this.subTotalPrice = parseFloat(_this.subTotalPrice);
                }
            })
            this.valueChanged = false;
        }
        const index = this.addedItems.indexOf(item);
        var selectedMaterialPrice = $("#button"+bookIdentifier).attr("data-selected");
        let pressed = ($('#button'+i).attr("aria-pressed") === "true");

        if(index < 0){
          $('#droppedCourses').removeClass('collapsed');
          this.addedItems.push(item);
          this.calculateTotal(this.addedItems,'add',selectedMaterialPrice)
        }
        $('#button'+i).attr("aria-pressed", !pressed);
        
        return false;
    },
    removeCourseMaterial(item){
        var selectedMaterialPrice = '';
        let _this = this;
        let index = '';
        let wcsIndex = '';
        this.addedItems.forEach((val,index)=>{
            if(val.bookNumber == item.bookNumber){
                 index = _this.addedItems.indexOf(val);
                selectedMaterialPrice = $("#button"+val.bookNumber).attr("data-selected");
                _this.calculateTotal(_this.addedItems,'sub',selectedMaterialPrice)
                _this.addedItems.splice(index,1);
            }
        })
       

        this.wcsCourseOrders.forEach((val,enrollIndex)=>{
            if(val.courseMaterialList.length > 0){
                val["courseMaterialList"].forEach((course,index1)=>{
                    if(course.mbsBookNumber == item.bookNumber){
                        wcsIndex = val.courseMaterialList.indexOf(course);
                        this.$store.dispatch("courseData/removeOrderEnrollmentsCourseMaterials",{"enrollment":this.wcsCourseOrders,"courseMaterialIndex":wcsIndex,"enrollmentIndex":enrollIndex});     
                        this.$store.dispatch("courseData/removeTaxOrderEnrollmentsCourseMaterials",{"enrollment":this.wcsCourseOrders,"courseMaterialIndex":wcsIndex,"enrollmentIndex":enrollIndex});     
                    }
                })
            
            }
        
            if(val.courseMaterialList.length == 0){
                let enrollmentIndex = _this.wcsCourseOrders.indexOf(val);
                _this.wcsEnrollmentArray.splice(enrollmentIndex,1)
                index =  _this.wcsCourseOrders.indexOf(val);
                _this.wcsCourseOrders.splice(index,1);
                _this.$store.dispatch("courseData/assignOrderEnrollments",_this.wcsCourseOrders); 
                _this.$store.dispatch("courseData/assignTaxCalOrderEnrollments",_this.wcsCourseOrders);
            }

        })

        this.gmItemsCourseOrders.forEach((val,index)=>{
            if(val.sku == item.bookNumber){
                index = this.gmItemsCourseOrders.indexOf(val);
                this.gmItemsCourseOrders.splice(index,1);
            }
        })

        this.$store.dispatch("courseData/assigngmItemsOrderEnrollments",this.gmItemsCourseOrders); 
        this.$store.dispatch("courseData/assignTaxCalGmItemsOrderEnrollments",this.gmItemsCourseOrders);

        this.showmsg = 'Select Price';
        this.selectIds.forEach((val)=>{
            if(val == item.bookNumber){
                let index = _this.selectIds.indexOf(val);
                _this.selectIds.splice(index,1);
                $('#priceDropDown'+val).val(this.showmsg)
            }

        })
        if(this.addedItems.length == 0){
            $('#droppedCourses').addClass('collapsed');
        }

        if(this.orderObj.shippingType == 1){
            
            this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
        }

        if(this.orderObj.shippingType == 2){
            if(this.orderObj.shippingType==2 && (this.$v.shippingValidationGroup["orderObj.shippingAddress1"].required && this.$v.shippingValidationGroup["orderObj.shippingCity"].required && this.$v.shippingValidationGroup["orderObj.shippingState"].required && this.$v.shippingValidationGroup["orderObj.shippingZipCode"].required) && (!this.$v.shippingValidationGroup.$anyError) && (this.$v.shippingValidationGroup.$anyDirty)){
                this.$store.dispatch('courseData/getTaxCalculations', this.taxCalculationObject);
            }
        }
    },
    calculateTotal(addedItems,opr,selectedMaterialPrice){
        let _this = this;
      if(opr == 'add'){

        this.addedItems.forEach((item,index)=>{

            if(item.prices.length!=0){ //Temporarily written code.
                item.prices.forEach((val,index)=>{
                    if(val.new_price == selectedMaterialPrice){

                        val['title'] = '';
                        val['bookNumber'] = '';
                        val['title'] = item.title;
                        val['bookNumber'] = item.bookNumber;
                        val['isbn'] = item.isbn;
                        _this.priceObj = val;
                        _this.displayItems.push(val);
                        _this.subTotalPrice += parseFloat(val.new_price);

                    }
                })
            }
            // if(item.primary.length!=0){
            //     item.primary.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){

            //             val['title'] = '';
            //             val['bookNumber'] = '';
            //             val['title'] = item.title;
            //             val['bookNumber'] = item.bookNumber;
            //             val['isbn'] = item.isbn;
            //             _this.priceObj = val;
            //             _this.displayItems.push(val);
            //             _this.subTotalPrice += parseFloat(val.price);

            //         }
            //     })
            // }
            // if(item.buy.length!=0){
            //     item.buy.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){

            //             val['title'] = '';
            //             val['bookNumber'] = '';
            //             val['title'] = item.title;
            //             val['bookNumber'] = item.bookNumber;
            //             val['isbn'] = item.isbn;
            //             _this.priceObj = val;
            //             _this.displayItems.push(val);
            //             _this.subTotalPrice += parseFloat(val.price);
            //         }
            //     })
            // }
            // if(item.rent.length!=0){
            //     item.rent.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){

            //             val['title'] = '';
            //             val['bookNumber'] = '';
            //             val['title'] = item.title;
            //             val['bookNumber'] = item.bookNumber;
            //             val['isbn'] = item.isbn;
            //             _this.priceObj = val;
            //             _this.displayItems.push(val);
            //             _this.subTotalPrice += parseFloat(val.price);
            //         }
            //     })
            // }
            this.showTotalPrice();
        })
      }
      else{
        let indexPos = ''
        this.addedItems.forEach((item,index)=>{ //Temporarily written code
            if(item.prices.length!=0){
                item.prices.forEach((val,index)=>{
                    if(val.new_price == selectedMaterialPrice){
                        indexPos = _this.displayItems.indexOf(val);
                        _this.displayItems.splice(indexPos,1);
                        _this.subTotalPrice -= parseFloat(val.new_price);
                        _this.subTotalPrice = _this.subTotalPrice.toFixed(2);
                        _this.subTotalPrice = parseFloat(_this.subTotalPrice);

                    }
                })
            }
            // if(item.primary.length!=0){
            //     item.primary.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){
            //             indexPos = _this.displayItems.indexOf(val);
            //             _this.displayItems.splice(indexPos,1);
            //             _this.subTotalPrice -= parseFloat(val.price);
            //             _this.subTotalPrice = _this.subTotalPrice.toFixed(2);
            //             _this.subTotalPrice = parseFloat(_this.subTotalPrice);

            //         }
            //     })
            // }
            // if(item.buy.length!=0){
            //     item.buy.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){
            //             indexPos = _this.displayItems.indexOf(val);
            //             _this.displayItems.splice(indexPos,1);
            //             _this.subTotalPrice -= parseFloat(val.price);
            //             _this.subTotalPrice = _this.subTotalPrice.toFixed(2);
            //             _this.subTotalPrice = parseFloat(_this.subTotalPrice);

            //         }
            //     })
            // }
            // if(item.rent.length!=0){
            //     item.rent.forEach((val,index)=>{
            //         if(val.price == selectedMaterialPrice){
            //             indexPos = _this.displayItems.indexOf(val);
            //             _this.displayItems.splice(indexPos,1);
            //             _this.subTotalPrice -= parseFloat(val.price);
            //             _this.subTotalPrice = _this.subTotalPrice.toFixed(2);
            //             _this.subTotalPrice = parseFloat(_this.subTotalPrice);

            //         }
            //     })
            // }

        })
        if(Object.keys(this.taxInfo) > 0){
            this.totalPrice = this.subTotalPrice + parseFloat(this.taxInformation.message.shippingCost)+parseFloat(this.taxInformation.message.tax);
        }
        else{
            this.totalPrice = this.subTotalPrice;
        }
        
      }
    },
    changeRadioState(event,type){

         setTimeout(()=>{
             this.storeClassList = $('#headStore').hasClass('collapsed') ? 'present' : 'absent';
             this.shippingClassList = $('#headShip').hasClass('collapsed') ? 'present' : 'absent'
         });

         if(type == 'waiting'){
            if(this.userSettings.secureRental == 'true'){
                this.billingAddress = 'newAddress';
            }
            else{
                if(this.addedItems.length > 0){
                    this.billingAddress = 'newAddress';
                }
            }
            
            this.orderObj.shippingAddress1 = '';
            this.orderObj.shippingAddress2 = '';
            this.orderObj.shippingFirstName = '';
            this.orderObj.shippingLastName = '';
            this.orderObj.shippingCity = '';
            this.orderObj.shippingZipCode = '';
            this.orderObj.shippingPhoneNumber = '';                
        }
            else{
                this.billingAddress = 'sameAddress';
                this.orderObj.billingAddress1 = '';
                this.orderObj.billingAddress2 = '';
                this.orderObj.billingCity = '';
                this.orderObj.billingZipCode = '';
            }
    },
    OnSubmit(){
        
        this.$v.$touch();

        if(this.$v.$invalid || (this.orderObj.shippingType == '' || this.orderObj.shippingType == null || this.orderObj.shippingType == undefined)){
           for (let key in Object.keys(this.$v)) {
          // 2. Extract the input
          const input = Object.keys(this.$v)[key];
          // 3. Remove special properties
          if (input.includes("$")) return false;
          // 4. Check for errors
          console.log(this.$refs);
          
          if (this.$v[input].$error) {
            // 5. Focus the input with the error
            for(var objKey in this.$v[input]){
                let _this = this;
                console.log(this.$v[input][objKey].$error)
                if(_this.$refs[objKey]!=undefined  &&  this.$v[input][objKey].$error){
                    _this.$refs[objKey].focus();
                    break;
                }
                
            }
            
          }
          
          
        }
        }
        else{
            if(this.$refs.creditDetails!==undefined){
                if(this.$refs.creditDetails.submitClicked!==undefined){
                    this.$refs.creditDetails.submitClicked();
                }
            }
            else{
                this.$router.push('/success')
            }   
        }
    }

  },
  computed:{
    shippingModes:{
        get(){
            if(this.$store.state.courseData.shippingModes.length > 0){
                this.selectedShippingMethodValue = this.$store.state.courseData.shippingModes[0].shipModebasePrice;
            this.selectedShippingMethod = this.$store.state.courseData.shippingModes[0].shipModeId;   
            
            }
            return this.$store.state.courseData.shippingModes;
        },
        set(){

        }
    },
    taxInformation:{
        get(){
            this.taxInfo  = this.$store.state.courseData.taxInformation;
            
            
            return this.taxInfo;
        },
        set(){

        }
    },
    coursesData(){
        return this.courseData;
    },  
    selectedPricesObj:{
        get(){
          this.selectedPricesList['courseMaterial'+this.globalBookIdentifier] = '';
          this.selectedPricesList['courseMaterial'+this.globalBookIdentifier] = this.selectedPrice;

          return this.selectedPricesList;
        },
        set(){

        }
    },
    taxCalculationObject:{
        get(){
            return this.$store.state.courseData.taxCalculation;
        },
        set(value){
             
        }
    },
    orderObj:{
        get(){
            this.orders = {...this.$store.state.courseData.order};
            return this.orders;
        },
        set(value){
            
            this.$store.dispatch('courseData/assignOrder',value);
        }
    },
    countryList:{
        get(){
            return this.$store.state.courseData.countryList;
        },
        set(value){

        }
    },
    shippingStateList:{
        get(){
            return this.$store.state.courseData.shippingStateList;
        },
        set(value){

        }
    },
    billingStateList:{
        get(){
            return this.$store.state.courseData.billingStateList;
        },
        set(value){

        }
    }    

  }
}
</script>

<style>
    [aria-expanded="true"] .fa-chevron-down,
    [aria-expanded="false"] .fa-chevron-up {
        display:none;
    }
    
    .section {
        transition: height 0.70s ease-out;
        height:auto;
    }
    .section.collapsed {
        height:0px;
        overflow: hidden;
    }

    .hide{
        max-height:0;
        transition:max-height 0.70s ease-out;
        overflow:hidden;
    }

</style>
