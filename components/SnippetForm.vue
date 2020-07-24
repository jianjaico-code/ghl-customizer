<template>
    <main class="modal__content" id="snippet-content">
            <div class='inline-grid snippets'>
                <ul style="position: relative;">
                    <li 
                        v-for="snippet in snippets" 
                        :key="snippet.id" 
                        :class="{active: mode==snippet.id}"
                        @click="mode=snippet.id" >
                        {{ snippet.title }}
                    </li>
                    <li id="saveButton" ><button @click="saveButton()">{{ saveButtonText }}</button></li>
                </ul>
            </div>

            <div class='inline-grid content'>
                <snippet 
                    v-for="snippet in snippets"
                    :key="snippet.id"
                    :config="snippet"
                    :mode="mode"
                    @update="updateStatus"
                ></snippet>
            </div>
        </main>
</template>

<script>
module.exports = {
    components: {
        "snippet": httpVueLoader('./../components/Snippets.vue')
    },
    props: ["config"],
    watch: {
          config(value){
                var _self = this;
                

                _self.snippets.forEach(function(snippet){
                        snippet.isEnabled = false;
                  });


                if(typeof value.dashboardCustomizer!='undefined' && value.dashboardCustomizer!=null){
                        _self.snippets.forEach(function(snippet, index){
                        
                              var holder = Object.keys(value.dashboardCustomizer).indexOf(snippet.id);
                              if(holder!=-1) _self.snippets[index].isEnabled = value.dashboardCustomizer[snippet.id];
                              else _self.snippets[index].isEnabled = false;
                        });
                }
          }
    },
    data(){
        return {
            config: {},
            mode: "contactDetailsShortcut",
            snippets: [
                  {
                        id: "contactDetailsShortcut",
                        title: "Conversation Link in Opportunity Details",
                        description: "When an Opportunity Details is open, this makes the title of the opportunity pop up window, a link to the conversation view.",
                        image: "./images/opportunity-conversations.jpg",
                        imageStyle: "width: 57%; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "menuFix",
                        title: "Dropdown Menu - Only One Allowed Open",
                        description: "The menus currently allow for all to be toggled open at the same time. This closes all other menus when opening a new menu.",
                        image: "./images/snippet2.gif",
                        imageStyle: "width: unset;",
                        isEnabled: false
                  },
                  {
                        id: "disabledMenuShrink",
                        title: "Expand Menu on Hover",
                        description: "In certain screens, the left menu is very made small to save space. This solution expands the left menu when the mouse is over it.",
                        image: "./images/snippet3.gif",
                        imageStyle: "",
                        isEnabled: false
                  },
                  {
                        id: "saveButtonFix",
                        title: "Contact Details Save Button",
                        description: "When editing contact details, the button appears at the bottom of the page and it's not obvious that the user needs to hit save. When enabled, this will move the save button to the top of the contact details so it is obvious.",
                        image: "./images/snippet4.gif",
                        imageStyle: "width: unset; height :unset;",
                        isEnabled: false
                  },
                  {
                        id: "addFavicon",
                        title: "Custom Favicon",
                        description: "This overrides the default favicon",
                        image: "./images/snippet5.png",
                        imageStyle: "width: 100%; height: auto;",
                        inputs: true,
                        inputPlaceholder: "Favicon Link",
                        isEnabled: false
                  },
                  {
                        id: "updateTitleTag",
                        title: "Update Title Tag",
                        description: "This updates the title tag according to the page that you are currently visiting rather than having all pages being the same.",
                        image: "./images/snippet6.png",
                        imageStyle: "width: unset; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "opportunityTags",
                        title: "Opportunity Tags",
                        description: `For each tag assigned to an opportunity, this will add a class to the opportunity card. Example - if the contact has a tag of "Hot", it will have a class added: 'tag-hot'. You can then use the following CSS to the hot opportunities.`,
                        image: "./images/opportunity-tags.jpeg",
                        imageStyle: "width: unset; height: 200px",
                        isEnabled: false
                  },
                  {
                        id: "messageActions",
                        title: "Email Statistics in Conversation View",
                        description: "Show if the email was delivered, opened or clicked in the Conversation View.",
                        image: "./images/message-actions.jpg",
                        imageStyle: "width: unset; height: 200px",
                        isEnabled: false
                  },
                  {
                        id: "logoClick",
                        title: "Logo Click goes to Dashboard ",
                        description: "",
                        image: "./images/logo-click.gif",
                        imageStyle: "width: 550px; height: unset",
                        isEnabled: false
                  },
                  {
                        id: "triggerToggle",
                        title: "Turn Trigger Folders On/Off",
                        description: "This adds On/Off buttons to each folder in the triggers that allows you to turn all triggers inside each folder on or off.",
                        image: "./images/toggle-triggers.gif",
                        imageStyle: "width: 550px; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "campaignToggle",
                        title: "Turn Campaign Folders On/Off",
                        description: "This adds On/Off buttons to each folder in the campaigns that allows you to turn all campaigns inside each folder on or off.",
                        image: "./images/campaign-folders.jpg",
                        imageStyle: "width: 550px; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "conversationFilter",
                        title: "Filter Conversations by Assigned User",
                        description: "Show only conversations that are assigned to a particular user.",
                        image: "./images/filter-conversations.png",
                        imageStyle: "width: 290px; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "opportunityDate",
                        title: "Show Date in Opportunity Cards",
                        description: "Displays the date the opportunity was created in the pipeline.",
                        image: "./images/opportunity-date-cards.jpg",
                        imageStyle: "width: 550px; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "twillioWarning",
                        title: "Disable Twillio Warning",
                        description: "Hide or Show Twillio Warning",
                        image: "./images/twillio-warning.png",
                        imageStyle: "width: 550px; height: unset;",
                        isEnabled: false
                  },
                  {
                        id: "customDatatables",
                        title: "Add Search & Sort to Custom Values & Custom Fields",
                        description: "Add Search & Sort to Custom Values & Custom Fields Tables",
                        image: "./images/custom-datatables.png",
                        imageStyle: "width: 550px; height: unset;",
                        isEnabled: false 
                  },
                  {
                        id: "driveLink",
                        title: "Enable Drive Links & Open in New Window",
                        description: `This adds a Open in New Window button on the top right of contact fields that have a URL in them that says "Open in New Window". If the link is a Google Drive link, it says "Open in Google Drive". This integrates well with UploadToDrive.com. `,
                        image: "./images/drive.png",
                        imageStyle: "width: unset; height: unset;",
                        isEnabled: false
                  }
            ],
            saveButtonText: "Save"
        }
    },
    methods: {
            saveButton(){
                  this.saveButtonText = "Saving...";
                  var _self = this;
                  setTimeout(function(){
                        _self.saveButtonText = "Save";
                        MicroModal.close("snippetSettings");                  
                        _self.$emit("close");
                  }, 500);
            },

            updateStatus(status){
                  console.log(status);
                        var  _self = this;
                        this.snippets.forEach(function(snippet, index){
                              if(snippet.id==_self.mode) _self.snippets[index].isEnabled = status;
                        });
                        

                        var config = {};
                        this.snippets.forEach(function(snippet){
                              if(snippet.id=='addFavicon'){
                                    if(snippet.isEnabled.status == true) config[snippet.id] = { status: true, link: snippet.isEnabled.link};     
                              }
                              if(snippet.isEnabled==true) config[snippet.id] = true;
                              
                              
                        });
                        
                        this.$emit("update", config);
            },

            import(config){
                  var _self = this;
                  var finalConfig = {};
                  Object.keys(config).forEach(value => {
                        _self.snippets.forEach(snippet => {
                              if(snippet.id == value){
                                    finalConfig[value] = true;
                              }
                        });
                  });
                  this.$emit("update", finalConfig);
            }
      }
}
</script>