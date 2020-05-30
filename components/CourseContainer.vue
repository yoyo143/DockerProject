<template>
    <div class="row mainContainer">
        <CourseMaterial ref="courseMaterial" :key="backFromSubmit" v-if="componentName == 'WelcomePage'" :userInformation="studentMaterialData.user" :courseData="courseData" :userSettings="studentMaterialData.settings" :courseEnrollmentStatus="courseEnrollmentStatus" :bookStoreDetails="studentMaterialData.shippingModeAndStorePickUp.storePickup" :terms="studentMaterialData.terms" :statusDates="studentMaterialData.enrollmentStatusChangedDates" :enrollAndCoursesCount="studentMaterialData.enrollmentsAndCoursesCount" :shippingMode="studentMaterialData.shippingModeAndStorePickUp.shippingMode" :orderStatus="orderStatus" :enrollmentOrderStatus="enrollmentOrderStatus" :includedOrderStatus="includedOrderStatus" :includedEnrollmentOrderStatus="includedEnrollmentOrderStatus" :notIncludedCourseMaterialOrderStatus="notIncludedCourseMaterialOrderStatus" :includedCourseMaterialOrderStatus="includedCourseMaterialOrderStatus" :alreadyOrderedItems="alreadyOrderedItems"/>
        <CourseMaterialCollection v-else :userInformation="studentMaterialData.user" :courseData="courseData" :bookStoreDetails="studentMaterialData.shippingModeAndStorePickUp.storePickup"/>
        <!-- <CourseMaterialCollection v-else :userInformation="studentMaterialData.user" :courseData="courseData"/> -->
        <CourseTimeline :timeLineTracker="timeLineTracker" :userSettings="studentMaterialData.settings"/>
    </div>
</template>

<script>
import CourseMaterial from './CourseMaterial';
import CourseTimeline from './CourseTimeline';
import CourseMaterialCollection from './CourseMaterialCollection';
export default {
    name:'CourseContainer',
    components:{
        CourseMaterial,
        CourseTimeline,
        CourseMaterialCollection
    },
    props:['componentName'],
    data(){
        return{
            tempObj : {},
            courseEnrollmentStatus:{
                "added":false,
                "dropped":false
            },
            orderStatus:true,
            includedOrderStatus:true,
            enrollmentOrderStatus:{
                id:[]
            },
            includedEnrollmentOrderStatus:{
                id:[]
            },
            includedCourseMaterialOrderStatus:{
                id:[]
            },
            notIncludedCourseMaterialOrderStatus:{
                id:[]
            },
            orderedItems:[],
            
            backFromSubmit:'no'
        }
    },
    created(){
       
    },
    mounted(){

    },
    methods:{

    },
    computed:{
        timeLineTracker:{
            get(){
                return this.$store.state.courseData.timeLineTracker;
            },
            set(){

            }
        },
        alreadyOrderedItems:{
            
            get(){
                
                this.orderedItems = this.$store.state.courseData.alreadyOrderedItems;
                console.log(this.orderedItems.length);
                if(this.orderedItems.length > 0){
                    this.backFromSubmit = 'yes';
                }
                return this.orderedItems;
            },
            set(){

            }
        } ,
        studentMaterialData:{
            get(){
                return this.$store.state.courseData.studentData;
            },
            set(){

            }
        },
        courseData(){
            this.tempObj = {};
            var allNull = [];
            var listOfOrderedNotIncludedMaterials=[];
            var listOfOrderedIncludedMaterials=[];
            var _this = this;

            this.studentMaterialData.fdcItems.forEach((value,index) => {
            value.enrollment["submittedStatus"] = '';    
            let currentDepartment = value.enrollment.department;
            let currentDepartmentCourse = value.enrollment.title + " (" + value.enrollment.department +" "+ value.enrollment.course + ")";
            _this.tempObj[currentDepartmentCourse] = {}
            _this.tempObj[currentDepartmentCourse]["enrollment"] = {};
            _this.tempObj[currentDepartmentCourse]["enrollment"] = value.enrollment;

            if(value.enrollment.enrollmentStatus == 'A'){
                this.courseEnrollmentStatus.added = true;
                allNull.push('null Absent');
            }
            if(value.enrollment.enrollmentStatus == 'D'){
                allNull.push('null Absent');
                this.courseEnrollmentStatus.dropped = true;
            }
            if(allNull.length == 0){
                this.courseEnrollmentStatus.added = false;
                this.courseEnrollmentStatus.dropped = false;
            }

            let includedItems = [];
            let notIncludedItems = [];
            // let availableIncludedItems = [];
            // let availableNotIncludedItems = [];

            value.courseMaterialList.forEach((val, index1) => {
            if(this.alreadyOrderedItems.includes(val.bookNumber)){
                value.enrollment["submittedStatus"] = true;
            }
            else{
                value.enrollment["submittedStatus"] = false;
            }
              
                // if(val.unavailable == 0 && val.isIncluded == true) {
                //     // availableIncludedItems.push(val);
                //     _this.tempObj[currentDepartmentCourse]["availableIncludedItems"] = [];
                //     _this.tempObj[currentDepartmentCourse]["availableIncludedItems"] = availableIncludedItems;
                // }
                // if(val.unavailable == 0 && val.isIncluded == false) {
                //     availableNotIncludedItems.push(val);
                //     _this.tempObj[currentDepartmentCourse]["availableNotIncludedItems"] = [];
                //     _this.tempObj[currentDepartmentCourse]["availableNotIncludedItems"] = availableNotIncludedItems;
                // }


            if(val.isIncluded == true){
                    if(val.unavailable == 0){
                        includedItems.push(val);
                    }
                    if(includedItems.length > 0){
                        _this.tempObj[currentDepartmentCourse]["includedItems"] = [];
                        _this.tempObj[currentDepartmentCourse]["includedItems"] = includedItems;
                    }
                    
                    if(this.alreadyOrderedItems.includes(val.bookNumber)){
                        listOfOrderedIncludedMaterials.push('ordered');
                        this.includedCourseMaterialOrderStatus.id.push(val.bookNumber);
                    }
                    else{
                        listOfOrderedIncludedMaterials.push('not ordered');
                    }

                    const isOrderedMaterial = (status) => status ==  'ordered';
                   
                    this.includedOrderStatus = listOfOrderedIncludedMaterials.every(isOrderedMaterial);                
                     if(this.includedOrderStatus){
                        
                        this.includedEnrollmentOrderStatus.id.push(value.enrollment.enrollmentId);
                    }
              } 
            else {
                    if(this.alreadyOrderedItems.includes(val.bookNumber)){
                        listOfOrderedNotIncludedMaterials.push('ordered');
                        this.notIncludedCourseMaterialOrderStatus.id.push(val.bookNumber);
                    }
                    else{
                        listOfOrderedNotIncludedMaterials.push('not ordered');
                    }
                    
                    const isOrderedMaterial = (status) => status ==  'ordered';
                    this.orderStatus = listOfOrderedNotIncludedMaterials.every(isOrderedMaterial);
                    if(this.orderStatus){
                        value.enrollment["submittedStatus"] = true;
                    }
                    
                    val["primary"] = [];
                    val["buy"] = [];
                    val["rent"] = [];
                    if(val.unavailable == 0){
                        notIncludedItems.push(val);
                    }
                    if(notIncludedItems.length > 0){
                        _this.tempObj[currentDepartmentCourse]["notIncludedItems"] = [];
                        _this.tempObj[currentDepartmentCourse]["notIncludedItems"] = notIncludedItems;
                    }
                    
              }
            });
          });
            return _this.tempObj;
        }
    }
}
</script>

<style>

</style>
