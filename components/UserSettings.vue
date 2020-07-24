<template>
    <main class="modal__content" id="css-content">
        <div v-for="setting in settings" :key="setting.id" style="width: 49%; display: inline-grid;">
            <switch-button v-model="setting.enable" color="#64bd63"></switch-button>
            <label>{{ setting.title }}</label>
        </div>
    </main>
</template>

<script>
module.exports = {
    components: {
        "switch-button": httpVueLoader('./../components/SwitchButton.vue')
    },
    props: ["config"],
    data(){
        return {
            settings: [
                {
                    id: "company",
                    title: "Company",
                    enable: true
                },
                {
                    id: "email",
                    title: "Email",
                    enable: true
                },
                {
                    id: "sms",
                    title: "SMS",
                    enable: true
                },
                {
                    id: "communications",
                    title: "Customize Communication",
                    enable: true
                },
                {
                    id: "phone_number",
                    title: "Phone Numbers",
                    enable: true
                },
                {
                    id: "calendar_settings",
                    title: "Calendars",
                    enable: true
                },
                {
                    id: "facebook",
                    title: "Facebook Form Fields Mapping",
                    enable: true
                },
                {
                    id: "custom_values",
                    title: "Custom Values",
                    enable: true
                },
                {
                    id: "domain",
                    title: "Domains",
                    enable: true
                },
                {
                    id: "review_widgets",
                    title: "Review",
                    enable: true
                },
                {
                    id: "appointment_widget",
                    title: "Appointment Widget",
                    enable: true
                },
                {
                    id: "pipeline",
                    title: "Pipeline",
                    enable: true
                },
                {
                    id: "integrations",
                    title: "Integrations",
                    enable: true
                },
                {
                    id: "templates",
                    title: "Templates",
                    enable: true
                },
                {
                    id: "custom_fields",
                    title: "Custom Fields",
                    enable: true
                },
                {
                    id: "tags",
                    title: "Tags",
                    enable: true
                },
                {
                    id: "smtp_service",
                    title: "SMTP and MailGun Service",
                    enable: true
                }
            ]
        }
    },

    watch: {
        settings: {
            handler(value){
                var config = {};

                value.forEach(function(setting){
                    if(setting.enable==false) config[setting.id] = false;
                });

                this.$emit("update", config);
            },
            deep: true
        },
        config: {
            handler(value){
                var _self = this;
                _self.settings.forEach(function(setting, index){
                    
                
                    if(typeof value.userSettings!='undefined' && value.userSettings!=null){

                        var keyIndex = Object.keys(value.userSettings).indexOf(setting.id);
                        if(keyIndex!=-1) {
                            _self.settings[index]["enable"] = false;
                        }else _self.settings[index]["enable"] = true;
                        
                    }else _self.settings[index]["enable"] = true;
                });
            },  
            deep: true
        }
    }
}
</script>



<style scoped>
label {
    position: relative;
    left: 39px;
    top: -3px;
}

</style>