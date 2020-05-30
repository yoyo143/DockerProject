<template>
     <div class="container-fluid" style="padding:0 !important">
        <CourseContainer :studentData="studentData" componentName="SuccessPage"/> 
    </div>   
</template>

<script>

import CourseContainer from './CourseContainer';
import {mapGetters} from 'vuex';
export default {
    name:'SuccessPage',
    components:{
        CourseContainer
    },
    data(){
        return{
        }
    },
    created(){
        this.$store.dispatch("courseData/emptyObj");
    },
    mounted(){

    },
    methods:{

    },
    computed:{
        ...mapGetters({
            studentData: 'courseData/getStudentData'
        })
    }
    
}
</script>

<style>

</style>
