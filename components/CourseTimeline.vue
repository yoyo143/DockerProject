<template>
  <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">
    <ul class="timeline">
      <li class="timelineItem success align-middle" :class="1 < parseInt(timeLineTracker.currentStatus) ? 'success': 1 == parseInt(timeLineTracker.currentStatus) ? 'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Registration Opens</h4>
        <div class="timelineDate" aria-hidden="true" >{{timeLineTracker.registrationDate | formatDate}}</div>
      </li>
       <li class="timelineItem  align-middle" :class="2 < parseInt(timeLineTracker.currentStatus) ? 'success':2 > parseInt(timeLineTracker.currentStatus) ? '':2 == parseInt(timeLineTracker.currentStatus) ?'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Course Material Visibility</h4>
        <div class="timelineDate" aria-hidden="true">No Action Required</div>
        <!-- <div class="timelineDate" aria-hidden="true">{{timeLineTracker.cmVisibilityDate | formatDate}}</div> -->
      </li>
      <li class="timelineItem  align-middle" :class="3 < parseInt(timeLineTracker.currentStatus) ? 'success':3 > parseInt(timeLineTracker.currentStatus) ? '':3 == parseInt(timeLineTracker.currentStatus) ?'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Student Pickup/Delivery Selection begins</h4>
        <div class="timelineDate" aria-hidden="true">{{timeLineTracker.spdBeginDate | formatDate}}</div>
      </li>
      <li class="timelineItem  align-middle" :class="4 < parseInt(timeLineTracker.currentStatus) ? 'success':4 > parseInt(timeLineTracker.currentStatus) ? '':4 == parseInt(timeLineTracker.currentStatus) ? 'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Digital Materials Provided in {{userSettings.lms}}</h4>
        <div class="timelineDate" aria-hidden="true">{{timeLineTracker.dmProvidedDate | formatDate}}</div>
      </li>
      
      <li class="timelineItem  align-middle" :class="5 < parseInt(timeLineTracker.currentStatus) ? 'success':5 > parseInt(timeLineTracker.currentStatus) ? '':5 == parseInt(timeLineTracker.currentStatus) ? 'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Add/Drop Deadline</h4>
        <div class="timelineDate" aria-hidden="true">{{timeLineTracker.addDropDeadlineDate | formatDate}}</div>
      </li>
      <li class="timelineItem align-middle" :class="6 < parseInt(timeLineTracker.currentStatus) ? 'success':6 > parseInt(timeLineTracker.currentStatus) ? '':6 == parseInt(timeLineTracker.currentStatus) ? 'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Rental Return Period Begins</h4>
        <div class="timelineDate" aria-hidden="true">{{timeLineTracker.rrPeriodBeginDate | formatDate}}</div>
      </li>
      <li class="timelineItem align-middle" :class="7 < parseInt(timeLineTracker.currentStatus) ? 'success':7 > parseInt(timeLineTracker.currentStatus) ? '':7 == parseInt(timeLineTracker.currentStatus) ? 'active':''">
        <div class="fas timelineBullet" aria-hidden="true"></div>
        <h4>Last Day for Rental Returns</h4>
        <div class="timelineDate" aria-hidden="true">{{timeLineTracker.ldRentalReeturnsDate | formatDate}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import * as moment from 'moment';
export default {
    name:'CourseTimeline',
    props:['timeLineTracker', 'userSettings'],
    data(){
        return{
          
        }
    },
     filters:{
      formatDate:function(value){
          if(value !== null && value !== undefined && value !== ''){
            return moment.utc(value).format('LL')
          }else{
            return "No Date Set"
          }
      }
    },
    created(){

    },
    mounted(){

    },
    methods:{

    }
}
</script>
