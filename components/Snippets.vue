<template>
    <div v-if="mode==config.id" class="content-header left">
        
        <switch-button v-model="isToggle" color="#64bd63"></switch-button>
        {{ config.title }}
         <div @click="close" class="pull-right" data-micromodal-close style="font-size:14pt; cursor:pointer">&otimes;</div>
        <div class="content-description">
            {{ config.description }}
            <br>
            <input class="form-group" style="width: 90%; margin-top: 5px; padding: 4px 9px; border-radius: 2px; border: 1px solid rgb(187, 187, 187);" v-if="config.inputs" @change="inputHandler" v-model="input_text" :placeholder="config.inputPlaceholder"  type="text">
            <br><br><br>
            <span class="preview">Preview</span><br>
            <img :src="config.image" :style="config.imageStyle">
        </div>
    </div>
</template>


<script>
module.exports = {
    props: ["config", "mode"],
    components: {
        'switch-button': httpVueLoader('./../components/SwitchButton.vue')
    }, 
    watch: {
        isToggle(value){
            console.log(value)
            if(typeof this.config.inputs == "undefined") this.$emit("update", value);
            else{
                this.$emit("update", {
                    status: value,
                    link: this.input_text
                })
            }  
        },
        config: {
            handler: function(value){
                console.log(this.config);

                this.isToggle = false;
                if(typeof value.isEnabled!='undefined') 
                   if(typeof this.config.inputs == "undefined") this.isToggle = value.isEnabled;
                   else{
                       this.isToggle = value.isEnabled.status;
                   }       
            },
            deep: true
        }
    },
    methods:{
        inputHandler(){
            if(this.isToggle) {
                this.$emit("update", {
                    status: this.isToggle,
                    link: this.input_text
                })
            }
        }
    },
    data(){
        return {
            isToggle: false,
            input_text: ''
        }
    }
}
</script>


