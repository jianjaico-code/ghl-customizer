<template>
      <div class="modal micromodal-slide" id="customCheckIn" aria-hidden="true">
            <div class="modal__overlay" tabindex="-1" style="z-index: 1" data-micromodal-close>
                  <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="locationId-title">
                  <header class="modal__header">
                        <div class="preview">
                              <label>Preview</label>
                              <div class="button" :style="previewColor">{{ (options.text ? options.text : 'Check In') }}</div>
                        </div>
                        <button class="modal__close" aria-label="Close modal" @click="close" data-micromodal-close></button>
                        
                        <div class="color-container">
                              <span class="label">Color</span>
                              <input type="color" class="color-picker">
                        </div>
                  </header>
                  <main class="modal__content">
                        
                        <div>
                              <span class="label">Hide Button</span> <switch-button v-model="options.hideButton" color="#64bd63"></switch-button>

                        </div>

                        <div class="change-text">
                              <span class="label">Change Text</span> <input type="text" v-model="options.text" placeholder="Check In">
                        </div>

                        
                        <span class="label">Button Opens</span><br>
                        <div class="linkType">
                              <div>
                                    
                                    <span class="option label" :class="{type: options.type=='default'}" @click="options.type='default'">Default Check In</span> 
                                    <span class="option label" :class="{type: options.type=='target'}" @click="options.type='target'">Internal Menu Item</span> 
                                    <span class="option label" :class="{type: options.type=='link'}" @click="options.type='link'">Link</span> 
                              </div>
                              <input v-if="options.type!='default'" type="text" v-model="options.target" :placeholder="(options.type=='target' ? 'Title of the Menu Item Exactly' : 'https://')">
                              <input v-if="options.type=='default'" type="text" v-model="options.target" placeholder="Title for the Check In Pop Up">
                              
                              <span style="font-size: 10pt; color: red; margin-bottom: 1rem;" v-if="options.type=='link'">{{ linkErrorMessage}}</span>
                              <div style="margin-bottom: 5px;" v-if="options.type=='link'"> 
                                    <input type="checkbox" class="checkbox-iframe" @click="options.isIframe=!options.isIframe" :checked="options.isIframe"><span class="label"  style="float: unset;">Open in Iframe</span>
                              </div>


                              <div v-if="options.isIframe==true && options.type=='link'">
                                    <span class="label">Iframe Title</span> <input type="text" v-model="options.iframe.title">
                                    <span class="label">Iframe Description</span> <input type="text" v-model="options.iframe.description"> 
                                    <input type="checkbox" class="checkbox-iframe" @click="options.iframe.isModal=!options.iframe.isModal" :checked="options.iframe.isModal"><span class="label"  style="float: unset;">Open in Modal</span>
                              </div>
                        </div>
                  </main>
                  <footer class="modal__footer">
                        <button class="modal__btn modal__btn-primary" @click="submit">Save</button>
                        <button class="modal__btn" @click="close" data-micromodal-close aria-label="Close this dialog window">Cancel</button>
                  </footer>
                  </div>
            </div>
      </div>
</template>

<script>
module.exports = {
      props: ["status", "config"],
      data(){
            return {
                  test: false,
                  colorpicker: null,
                  options: {
                        color: "#37ca37",
                        isIframe: false,
                        text: null,
                        hideButton: false,
                        type: "default",
                        target: null,
                        iframe: {
                              title: '',
                              description: '',
                              isModal: false
                        },
                  },
                  
                  linkErrorMessage: '',
                  previewColor: { background: '#37ca37'},
            }
      },
      components: {
            'switch-button': httpVueLoader("./SwitchButton.vue")
      },
      mounted(){
            this.initiatePicker();
      },
      watch: {
            config(value){
                  if(!!value.checkIn){
                        this.options = Object.assign({}, this.options, value.checkIn);
                        var tempColor = this.options.color;
                        this.previewColor = { background: tempColor };
                  }
                  else{
                         this.options = {
                              color: "#37ca37",
                              isIframe: false,
                              text: null,
                              hideButton: false,
                              type: "default",
                              target: null,
                              iframe: {
                                    title: '',
                                    description: '',
                                    isModal: false
                              },
                        }
                  }

                  console.log(value);
            }
      },
      methods: {
            import(options){
                  var _self = this;
                  Object.keys(options).forEach(function(item){
                        _self.options[item] = options[item]

                        if(item=="color"){
                              var hex = options[item];

                              if(hex.indexOf("#")==-1) hex = `#${hex}`;
                              _self.colorpicker.setColor(hex);
                        }
                  });
            },
            initiatePicker(){
                  var _self = this;
                  this.colorpicker = Pickr.create({
                        el: '.color-picker',
                        theme: 'classic', // or 'monolith', or 'nano'
                        default: '#37ca37',
                        components: {

                              // Main components
                              preview: true,
                              opacity: true,
                              hue: true,

                              // Input / output Options
                              interaction: {
                                    input: true,
                              }
                        }
                  }).on("change", function(color, instance){
                        let tempColor = color.toHEXA().toString();
                        _self.previewColor = { background: tempColor };
                        _self.options.color = tempColor;
                        _self.colorpicker.setColor(tempColor);
                  });
            },
            submit(){
                  var finaloptions = {
                        color: this.options.color
                  }

                  if(this.options.text!="" && this.options.text!=null){
                        finaloptions.text = this.options.text;
                  }
                  
                  if(this.options.target!="" && this.options.target!=null){
                        finaloptions.type = this.options.type;
                        finaloptions.target = this.options.target;
                  }

                  if(this.options.isIframe){
                        finaloptions.isIframe = this.options.isIframe;
                        finaloptions.iframe = this.options.iframe;
                  }

                  finaloptions.hideButton = this.options.hideButton;


                  var isPassed = true;
                  if(this.options.type=="link" && this.options.isIframe==true && this.options.target!=""){
                        if(this.options.target.indexOf("https://")!=-1){
                              this.linkErrorMessage = ""; 
                              isPassed = true;
                        }else {
                              this.linkErrorMessage = "https is required or it will not appear"; 
                              isPassed = false;
                        }
                  }

                  if(isPassed){
                        this.$emit("custom-checkin", finaloptions);
                        MicroModal.close("customCheckIn");
                  }
                  
                  
                  
            },

            close(){
                  if(!!this.config.checkIn){
                        this.options = Object.assign({}, this.options, this.config.checkIn);
                  }
                  else{
                        this.options = {
                              color: "#37ca37",
                              isIframe: false,
                              text: null,
                              hideButton: false,
                              type: "default",
                              target: null,
                              iframe: {
                                    title: '',
                                    description: '',
                                    isModal: false
                              },
                        }
                  }
            }
      }
}
</script>


<style scoped>
.switch-button-control{
      float: unset;
}
.modal__container {
      width: 18rem;
      top: 2rem;
}

.modal__content {
      margin-top: 1rem;
}

.modal__close {
      position: fixed;
      top: 1rem;
      right: 1rem;
}

.preview label {
      background: rgb(217, 217, 217);
      font-size: 8pt;
      padding: 2px 5px;
      border-radius: 3px;
      color: rgb(139, 139, 139);
}

.preview .button {
      background: #00e03a;
      width: 8rem;
      text-align: center;
      border-radius: 4px;
      padding: 9px;
      font-size: 10pt;
      font-weight: bold;
      color: rgb(255, 255, 255);
      cursor: pointer;
      margin-top: 5px;
}

.preview .button:hover {
      opacity: .8;
}

.option {
      background: unset;
      padding: 2px 9px;
      font-size: 9pt;
      cursor: pointer;
      background: rgb(160, 193, 182) !important;
      border: unset !important;
      font-weight: bold;
      color: rgb(0, 0, 0) !important;
      margin: 2px 4px;
}



.label {
      margin-right: 10px;
      float: left;
      font-size: 10pt;
      color: rgb(127, 121, 121);

      position: relative;
      top: 1px;
}
.option:hover{
      opacity: .8;
      cursor: pointer;
      background: rgb(0, 68, 158) !important;
      color: #fff !important;
}

.linkType .label {
      margin-right: 0px;
}
      
.blue {
      color: rgb(0, 68, 158) !important; 
}

.type {
      opacity: .8;
      cursor: pointer;
      background: rgb(0, 68, 158) !important;
      color: #fff !important;
}

.type:hover{
      opacity: .8;
      cursor: pointer;
      background: rgb(0, 68, 158) !important;
      color: #fff !important;
}


input[type="text"] {
      width: 98%;
      padding: 6px 0 6px 8px;
      border-radius: 3px;
      border: 1px solid rgb(148, 148, 148);
      margin-top: 6px;
      margin-bottom: 10px;
}

.color-container {
      margin-top: 5px;
      float: right;
    width: 5rem;
    position: relative;
    top: 10px;
    left: 18px;
}

.color-container .label {
      top: 3px;
}

.actions {
      border: 1px solid black;
}

.checkbox-iframe {
      position: relative;
      top: 2px;
}
</style>