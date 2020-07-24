<template>
    <main class="modal__content" id="css-content">
        <div>
            <div @click="selectUserSettings(config, 'admin')" v-bind:id="config.id+'-admin-settings'" class="settings-account">Admin</div>
            <div @click="selectUserSettings(config, 'user')" v-bind:id="config.id+'-user-settings'" style="right: 5px;" class="settings-account settings-account-selected">Users</div>
        </div>
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
            accountStatus: "user",
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

    methods: {
        selectUserSettings(location, account){
                var _self = this;
                switch(account){
                    case 'user':
                            _self.$el.querySelector(`#${location.id}-admin-settings`).classList.remove('settings-account-selected');
                            _self.$el.querySelector(`#${location.id}-${account}-settings`).classList.add('settings-account-selected');

                            _self.accountStatus = account;
                            console.log(_self.config.userSettings);
                            break;
                    case 'admin':
                            _self.$el.querySelector(`#${location.id}-user-settings`).classList.remove('settings-account-selected');
                            _self.$el.querySelector(`#${location.id}-${account}-settings`).classList.add('settings-account-selected');

                            _self.accountStatus = account;
                            console.log(_self.config.adminSettings);
                            break;
                }
        }
    },

    watch: {
        settings: {
            handler(value){
                var config = {};

                value.forEach(function(setting){
                    if(setting.enable==false) config[setting.id] = false;
                });

                this.$emit("update", config, this.accountStatus);
            },
            deep: true
        },
        accountStatus: {
            handler(value){
                var _self = this;
                _self.settings.forEach((setting, index) => {
                    if(value == 'user'){
                        if(typeof _self.config.userSettings!='undefined' && _self.config.userSettings!=null){

                        var keyIndex = Object.keys(_self.config.userSettings).indexOf(setting.id);
                        if(keyIndex!=-1) {
                            _self.settings[index]["enable"] = false;
                        }else _self.settings[index]["enable"] = true;
                        
                        }else _self.settings[index]["enable"] = true;
                    }
                    else if(value == 'admin'){
                        if(typeof _self.config.adminSettings!='undefined' && _self.config.adminSettings!=null){

                        var keyIndex = Object.keys(_self.config.adminSettings).indexOf(setting.id);
                        if(keyIndex!=-1) {
                            _self.settings[index]["enable"] = false;
                        }else _self.settings[index]["enable"] = true;
                        
                        }else _self.settings[index]["enable"] = true;
                    }
                });
            },
            deep: true
        },
        // config: {
        //     handler(value){
        //         var _self = this;
        //         _self.settings.forEach(function(setting, index){
                    
                
        //             if(_self.accountStatus == 'user'){
        //                 if(typeof value.userSettings!='undefined' && value.userSettings!=null){

        //                 var keyIndex = Object.keys(value.userSettings).indexOf(setting.id);
        //                 if(keyIndex!=-1) {
        //                     _self.settings[index]["enable"] = false;
        //                 }else _self.settings[index]["enable"] = true;
                        
        //                 }else _self.settings[index]["enable"] = true;
        //             }
        //             else if(_self.accountStatus == 'admin'){
        //                 if(typeof value.adminSettings!='undefined' && value.adminSettings!=null){

        //                 var keyIndex = Object.keys(value.adminSettings).indexOf(setting.id);
        //                 if(keyIndex!=-1) {
        //                     _self.settings[index]["enable"] = false;
        //                 }else _self.settings[index]["enable"] = true;
                        
        //                 }else _self.settings[index]["enable"] = true;
        //             }
        //         });
        //     },  
        //     deep: true
        // },
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