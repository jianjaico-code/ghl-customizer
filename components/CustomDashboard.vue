<template>
      <div id="sidebar" class="sidebar" :class="[ sidebar ? 'sidebar-open' : 'sidebar-close' ]" >
            
            <a href="javascript:void(0)" class="closebtn" v-on:click="closeSidebar()">&times;</a>

           
           
            <div v-if="displayView" class="contents" @click="editor=false">
                  
                  <div class="title">Add a Shortcut Button        
                              <div @click="toggleEditor()" v-on:click.stop=""  class="add-button"><span class="fas fa-plus"></span></div>

                  </div>
                  
                  
                  <draggable v-if="list.length!=0" class="list-group" tag="ul" v-model="list" v-bind="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                        <transition-group type="transition" :name="'flip-list'">
                              <li class="list-group-item" v-for="element in list" :key="element.order" v-on:click.stop=""   @click="updateButton(element)" :style="{background: element.color}">
                              
                              <span>{{element.name}}</span>
                              </li>
                        </transition-group>
                  </draggable>

                  <div v-if="list.length==0">No Buttons Yet</div>
            </div>

            <div v-show="editor" id="editor" v-on:click.stop>
                  <span @click="editor=false" class='close-editor'></span>
                  <div class="form">
                         <div class="preview-title">Preview: </div> 
                        <div id="preview" :style="previewColor">{{ (buttonConfig.name=="" ? "Your Button Name" : buttonConfig.name )}}</div>

                        
                        <input type="text" placeholder="Your Button Name" v-model="buttonConfig.name">
                        <br><br>
                        <div class="type-container">
                              <span class="types" :class="{active: buttonConfig.type=='target'}" @click="buttonConfig.type='target'">Target</span><span class="types" :class="{active: buttonConfig.type=='link'}" @click="buttonConfig.type='link'">Link</span>
                        </div>

                        <span style="font-size: 9pt; color: red; margin-bottom: 1rem;" v-if="buttonConfig.type=='link' && buttonConfig.isIframe==true">{{ linkErrorMessage }}</span>
                        <input type="text" :placeholder="(buttonConfig.type=='target' ? 'Menu Item to Link To': 'Link')" v-model="buttonConfig.target">
                        <input type="text" class="color-picker" value="000000" style="display: none;">

                        <div  v-if="buttonConfig.type=='link'"><input type="checkbox" @click="buttonConfig.isIframe=!buttonConfig.isIframe" :checked="buttonConfig.isIframe"> <label>Open inside dashboard (iframe)</label></div>
                     
                        <template v-if="buttonConfig.type=='link' && buttonConfig.isIframe">
                               <input  v-model="buttonConfig.iframe.title" type="text" placeholder="Iframe Title">
                        <input v-model="buttonConfig.iframe.description" type="text" placeholder="Iframe Description">
                        <input @click="buttonConfig.iframe.modal=!buttonConfig.iframe.modal" type="checkbox"> <label  >Open in modal</label>
                        </template>
                  
                        <span v-if="buttonConfig.edit==true" class="button-delete" @click="deleteButton(buttonConfig)">Delete</span>
                  </div>

                  <div class='editor-button' @click="addNewButton()">{{ (buttonConfig.edit? "Update" : "Add")}} Shortcut</div>
            </div>
      </div>
</template>

<script>

module.exports = {
      props: ['sidebar', 'config'],
      data: function(){
            return {
                  editor: false,
                  colorpicker: null,
                  previewColor: { background: '#37ca37'},
                  list: [],
                  list2: [],
                  editable: true,
                  isDragging: false,
                  delayedDragging: false,
                  buttonConfig: {},
                  linkErrorMessage: "https is required or it won't appear",
                  displayView: true,
            }
      },
      mounted: function(){
            this.initiateColor();
            this.resetButton();

      },

      methods: {
            
            updateButton(config){
                  //this.buttonConfig = config;
                  this.buttonConfig = Object.assign({}, this.buttonConfig, config);
                  this.buttonConfig.edit = true;
                  this.colorpicker.setColor(config.color);
                  this.editor = true;
                  
            },
            deleteButton(config){
                  var tempList = [];

                  this.list.forEach(function(item){
                        if(item.order!=config.order) tempList.push(item);
                  });

                  this.list = tempList;
                  this.editor = false;
            },
            closeSidebar(){
                  this.editor = false;
                  this.$emit('toggle-sidebar');
            },
            addNewButton(){
                  var _self = this;
                  
                  var isPassed = true;
                  
                  if(this.buttonConfig.type=="link" && this.buttonConfig.isIframe==true && this.buttonConfig.target!=""){
                        if(this.buttonConfig.target.indexOf("https://")!=-1){
                              this.linkErrorMessage = ""; 
                              isPassed = true;
                        }else {
                              this.linkErrorMessage = "https is required or it will not appear"; 
                              isPassed = false;
                        }
                  }

                  
                  if(isPassed){
                        if(this.buttonConfig.name.trim()!=""){
                              if(this.buttonConfig.edit!=true){
                                    var index = this.list.length;
                  
                                    if(this.buttonConfig.name!=null && this.buttonConfig.target!=null){
                                          var target = this.buttonConfig.target;
                                          target= target.toLowerCase();
                                          if(target.indexOf(" ")!=-1) target = target.replace(" ", "-");

                                          this.list.push({
                                                color: this.buttonConfig.color,
                                                name: this.buttonConfig.name,
                                                target: target,
                                                type: this.buttonConfig.type,
                                                isIframe: this.buttonConfig.isIframe,
                                                iframe: this.buttonConfig.iframe,
                                                order: index,
                                                fixed: false
                                          });
                                    }
                              }else{
                                    this.list.forEach(function(item,i){
                                          if(item.order==_self.buttonConfig.order){
                                                _self.list[i] = _self.buttonConfig;
                                          }
                                    });
                              }
                              

                              
                              this.resetButton();    
                              this.editor = false; 
                              console.log(this.list);
                        }
                  }

                  
                  
            },
            resetButton(){
                  this.buttonConfig = {
                        color: '#37ca37',
                        name: "",
                        type: "target",
                        target: "",
                        isIframe: false,
                        edit: false,
                        iframe: {
                              title: "",
                              description: "",
                              modal: false
                        }
                  }
            },
            toggleEditor(){
                  
                  this.resetButton();
                  this.editor = true;
            },
            initiateColor(){
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
                        _self.buttonConfig.color = tempColor;
                        _self.colorpicker.setColor(tempColor);
                  });
            },
            orderList() {
                  this.list = this.list.sort((one, two) => {
                  return one.order - two.order;
                  });
            },
            onMove({ relatedContext, draggedContext }) {
                  const relatedElement = relatedContext.element;
                  const draggedElement = draggedContext.element;
                  return (
                  (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                  );
            },
            import(list){
                  console.log(list);
                  this.list = list;
            }
      },
      
      computed: {
            dragOptions() {
                  return {
                  animation: 0,
                  group: "description",
                  disabled: !this.editable,
                  ghostClass: "ghost"
                  };
            },
            listString() {
                  return JSON.stringify(this.list, null, 2);
            },
            list2String() {
                  return JSON.stringify(this.list2, null, 2);
            }
      },

      watch: {
            sidebar(newValue){
                  this.displayView = newValue;
            },
            isDragging(newValue) {
                  if (newValue) {
                        this.delayedDragging = true;
                        return;
                  }
                  this.$nextTick(() => {
                        this.delayedDragging = false;
                  });
            },
            list(value){
                  this.$emit("dashboard-shortcut", value);
            },
            config(value){
                  if(typeof value.shortcut!='undefined'){
                        this.list = value.shortcut;
                  }else this.list = [];
            }
      }
}
</script>

<style scoped>
#sidebar {
      
      padding: 0px;
      background:  rgb(26, 28, 39);
}
#editor {
      transform: translate3d(63px, 10px, 0px);
      position: fixed;
      background: #fff;
      width: 13rem;
      min-height: 19rem;
      border: 1px solid rgb(207, 213, 230);
      background: rgb(28, 28, 28);
      border-color: rgb(41, 40, 40);
      border-radius: 5px;
      background: rgb(215, 217, 228);
      border-color: rgb(40, 42, 55);
      box-shadow: #000000 0px 0px 5px 1px;
}

.button-delete{
      position: relative;
      font-size: 9pt;
      top: 14px;
      color: rgb(255, 0, 0);
      text-decoration: underline;
      cursor: pointer;
      float: right;
    right: 17px;
}

.button-delete:hover{
      text-decoration: none;
}

.title {
      font-size: 16px;
      color: rgb(212, 212, 212);
      margin-bottom: 2rem;
}

.add-button {
          display: inline;
    margin-left: 6px;
      padding: 5px;
      width: 12px;
      border: 2px solid rgb(61, 177, 66);
      border-radius: 4px;
      color: rgb(61, 177, 66);
      font-size: 10pt;
      cursor: pointer;
      opacity: .7
}

.add-button:hover{
      opacity: 1
}

.contents {
      padding: 17px 10px;
}

.close-editor {
      width: 7px;
      height: 7px;
      background: rgb(172, 172, 172);
      border: 2px solid rgba(156, 148, 148, 0.73);
      border-radius: 100%;
      float: right;
      position: relative;
      top: 5px;
      right: 4px;
      opacity: .7;
      cursor: pointer;
      background: rgb(17, 17, 17);
      border-color: rgb(61, 61, 61);
}

.close-editor:hover {
      opacity: 1;
}

.form {
      margin-top: 2rem;
      text-align: left;
      padding: 0 0 0 14px;
}

input {
      width: 82%;
      padding: 7px 10px;
      border-radius: 3px;
      border: 1px solid rgb(191, 191, 191);
      background: rgb(198, 201, 218);
      border-color: rgb(125, 127, 144);
      margin: 4px 0;
      padding: 9px 10px;
      color: rgb(115, 115, 115);
      font-size: 9pt;
}

.pickr {
      position: relative;
      top: 2px;
      margin-bottom: 5px;
}

input[type='checkbox'] {
      width: unset;
      position: relative;
      top: 2px;
}

label {
      color: rgb(125, 129, 152);
      font-size: 8pt;
}

.editor-button {
      background: rgb(244, 67, 54);
      width: 100%;
      text-align: center;
      padding: 1rem 0;
      margin-top: 2rem;
      color: rgb(242, 242, 242);
      font-weight: bold;
      font-size: 10pt;
      border-bottom-left-radius: 4px;
      cursor: pointer;
}

.editor-button:hover{
      background: #cb2f24;
}

.preview-title {
      font-size: 8pt;
      margin-bottom: 5px;
      color: rgb(110, 107, 113);
      font-weight: bold;
}

.preview-target {
      color: rgb(76, 148, 255);
}

.button,
#preview {
      width: 93%;
      margin-bottom: 1rem;
      border-radius: 4px;
      text-align: center;
      padding: 11px 0;
      height: 16px;
      color: #fff;
      font-size: 10pt;
      cursor: pointer;
      background: #37ca37;
}

.button{
      width: 5rem;
}

.list-group-item {
      border: unset;
      padding: 10px 6px;
      width: 7rem;
      margin-bottom: 4px;
      border-radius: 2px;
      text-align: center;
      background: rgb(238, 255, 185);
      display: inline-grid;
      margin-right: 5px;
      font-size: 9pt;
      color: #fff;
}

.types {
      font-size: 9pt !important;
      padding: 2px 5px;
      border: 1px solid rgb(3, 169, 244) !important;
      cursor: pointer;
}

.type-container {
      margin-bottom: .3rem;
}

.types:hover,
.type-container .active {
      background: rgb(3, 169, 244);
      color: rgb(255, 255, 255);
}
</style>