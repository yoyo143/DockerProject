<template>
    <div class="container-fluid" style="padding:0 !important">
      <div id="mainContent">
        <CourseContainer  componentName="WelcomePage" ref="courseContainer"/>
      </div>
    </div>
</template>

<script>
import fontawesome from "@fortawesome/fontawesome-free";

import CourseContainer from './CourseContainer'


export default {
    name:'Welcome',
    props:['studentData'],
    components:{
        CourseContainer
    },
    data(){
        return{
        courseMaterial : this.studData || '',
        courseData: []
    }
  },
  watch:{

  },
  created(){

  },
  methods:{
   
  },
  mounted() {
  },
  computed:{
    courseMaterialData(){
        this.courseMaterial = this.studData;
        this.courseData = this.courseMaterial.fdcItems;
        return this.courseMaterial;
    }
  }
}
</script>

<style scoped>

</style>
