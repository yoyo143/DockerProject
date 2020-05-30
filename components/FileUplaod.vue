<template>
    <div class="col-sm-12 col-md-12 col-lg-8 col-xl-8 contentWrapper container" style="bottom:0px">
        <div class="form-group" style="display:inline-block;">
            <label>File
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
            <button v-on:click="submitFile()">Submit</button>
        </div>
    </div>
</template>
<script>
  export default {
    methods: {
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
      },
      submitFile(){
        let  _this = this;
        let formData = new FormData();
        formData.append('file', this.file);
        this.$axios.post( process.env.API_STUDENT+'/courses/student/createEntries',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        ).then(function(result){
          _this.sendEmail(result);
            alert('SUCCESS!!');
        })
        .catch(function(){
            alert('FAILURE!!');
        });
      },
     
async sendEmail(result){ 
    },async  generateAccessTokenForGeneralSettings() { 
    }
    },
    data(){
        return {
            file: ''
        }
    }
  }
</script>