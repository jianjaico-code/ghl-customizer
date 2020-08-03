



var app = new Vue({
      el: "#app",
      components: {
            'custom-dashboard': httpVueLoader('./components/CustomDashboard.vue'),
            'custom-check-in': httpVueLoader('./components/CustomCheckIn.vue'),
            'switch-button': httpVueLoader('./components/SwitchButton.vue'),
            'snippet-form': httpVueLoader('./components/SnippetForm.vue'),
            'user-settings': httpVueLoader('./components/UserSettings.vue')
      },
      data: {

            /**
             *  REFACTORED CODES
             */
            locationSelected: "all-location",
            locationConfig: null,

            locationLogo: true,
            savedtemplate: false,
            locationId: null,
            locationName: null,
            activeLocation: {id: "", name: "", type: "", child: ""},
            iframeTitle: null,
            iframeDescription: null,
            iframeModal: false,
            iconPath: null,
            menu: {
                  icon: null,
                  name: null,
                  type: "single",
                  link: null,
                  location: "bottom",
                  locationTarget: "conversations",
                  iframe:{
                        title: this.iframeTitle,
                        description: this.iframeDescription,
                        modal: this.iframeModal
                        }         
            },
            generatedCode: '',
            importedCode: '',
            fontawesome: fontawesome,
            isIconPath: false,
            isIframe: false,
            repo: [
                  {
                        "id": "agency-dashboard",
                        "name": "Agency Menu",
                        "menus": [],
                        "customButtons": null,
                        "dashboardCustomizer": null,
                        "checkIn": null,
                        "isTab": false,
                        "locationLogo": true,
                        "userSettings": null,
                        "adminSettings": null
                  },
                  {
                        "id":"all-location",
                        "name":"Account Location Menu",
                        "menus":[],
                        "customButtons": null,
                        "dashboardCustomizer": null,
                        "checkIn": null,
                        "isTab": false,
                        "locationLogo": true,
                        "userSettings": null,
                        "adminSettings": null
                  }
                  
            ],
            cssCode: "",
            cssLocationId: "",
            cssLocationName: "",
            cssResult: "",
            load: "",
            edit: null,
            isEdit: false,
            saveButtonText: "Save",
            linkErrorMessage: "",
            defaultMenu: true,
            buttonTarget: '',
            buttonName: '',
            favicon: '',
            lastSavedExists: null,
            sidebar: false,
            templateName: "",
            hover: false
            
      },
      mounted: function(){
            MicroModal.init();
            this.load = "show";

            let saved=  localStorage.getItem("lastSaved");
            if(saved!=null && saved!='null') this.lastSavedExists = true;
             
            if(this.lastSavedExists){
                  MicroModal.show("lastSaved");
            }

      },
      filters: {
            removePrefixes: function(value){
                  if (!value) return '';
                  value = value.toString()
                  value = value.substr(value.indexOf("fa-")+3, value.length);
                  return value;
            }
      },
      watch: {
            repo: {
                  handler: function(value){
                  }, 
                  deep: true
            },

            favicon:function(value, oldValue){
                  this.snippets.addFavicon.link = value;
            },
            locationLogo(value){
                  var _self = this;
                  _self.repo.forEach(function(location, index){
                        if(location.id==_self.locationSelected){
                              _self.repo[index].locationLogo = value;
                        }
                  });
            }

      },
      computed: {
            dragOptions() {
                  return {
                  animation: 3,
                  group: "description",
                  disabled: false,
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
      methods: {

            loadSavedConfig(){
                  let saved=  localStorage.getItem("lastSaved");
                  console.log(saved);
                  this.importedCode = saved;
                  this.importCode();

                  localStorage.setItem("lastSaved", null);
                  MicroModal.close("lastSaved");

            },



            /**
             * 
             * 
             **/
            toggleOption(id, type){
                  var _self = this;

                  this.locationSelected = id;
                  
                  this.repo.forEach(function(location){
                        if(location.id==id) _self.locationConfig = location;
                  });

                  
                  if(type=="sidebar")                 this.sidebar= !this.sidebar;
                  if(type=="dashboard-customizer")    this.openSnippetSettings();
                  if(type=="check-in")                MicroModal.show("customCheckIn");
                  if(type=="user-settings")           MicroModal.show("userSettings");
            },



             
            /*************************************************************************/
            /*************************************************************************/
            /*************************************************************************/




            /**
             * COMPONENTS GENERATED CONFIGURATION
             * 
             */
            generateUserSettings(value, status){
                  console.log(status);
                  var _self = this;
                  _self.repo.forEach(function(location, index){
                        if(location.id==_self.locationSelected){
                              if(status=='user') _self.repo[index].userSettings = value;
                              else if(status=='admin') _self.repo[index].adminSettings = value;

                              _self.locationConfig = _self.repo[index];
                        }
                  });
            },



            generateShortcut(value){
                  var _self = this;
                  _self.repo.forEach(function(location, index){
                        if(location.id==_self.locationSelected) {
                              _self.repo[index].shortcut = value;
                              _self.locationConfig = _self.repo[index];
                        }
                  });
            },


            updateLocationConfig(){
                  console.log("Dasboard Customizer Closed");
                  this.locationSelected = "all-location";
                  this.locationConfig = this.repo[0];
            },
            
            generateCustomizer(value){
                  var _self = this;
                  // console.log("Old");

                  // _self.repo.forEach(function(location){
                  //       console.log(location);
                  //       if(typeof location.dashboardCustomizer!='undefined' && location.dashboardCustomizer!=null){
                  //             Object.keys(location.dashboardCustomizer).forEach(function(key){
                  //                   console.log(`${location.id}: ${key}: ${location.dashboardCustomizer[key]}`);
                  //             });
                  //       }
                  // });

                  _self.repo.forEach(function(location, index){
                        if(location.id==_self.locationSelected){
                              console.log("Saving");
                              console.log(`Location Target: ${_self.locationSelected}`);
                              _self.repo[index].dashboardCustomizer = value;
                              _self.locationConfig = _self.repo[index];

                              
                        }
                  });


                  // console.log("Updated");
                  // _self.repo.forEach(function(location){
                  //       if(typeof location.dashboardCustomizer!='undefined'  && location.dashboardCustomizer!=null){
                  //             Object.keys(location.dashboardCustomizer).forEach(function(key){
                  //                   console.log(`${location.id}: ${key}: ${location.dashboardCustomizer[key]}`);
                  //             });
                  //       }
                  // });
            },

            generateCheckIn(value){
                  //this.updateLocationConfig();
                  var _self = this;
                  _self.repo.forEach(function(location, index){
                        if(location.id==_self.locationSelected){
                              _self.repo[index].checkIn = value;
                              _self.locationConfig = _self.repo[index];
                        }
                  });
            },
            /*************************************************************************/
            /*************************************************************************/
            /*************************************************************************/


            
            saveTemplate(){
                  var templates = localStorage.getItem("templates");
                  if(templates==null) templates = [];
                  else templates = JSON.parse(templates);

                  var isExist = false;
                  var templateName = this.templateName;
                  templates.forEach(function(item){
                        if(item.name==templateName) isExist = true;
                  });

                  if(!isExist){
                        templates.push({
                              date: new Date(),
                              name: templateName,
                              code: this.generatedCode
                        });
                        localStorage.setItem("templates", JSON.stringify(templates));
                        alert("Saved!");
                  }else alert(`${templateName} already exists!`);

                  
            },
            loadTemplate(value){
                  if(value!=null){
                        this.importedCode = value;
                        this.importCode(true);
                  }
            },
            openSavedTemplates(){
                  console.log("Open Saved Template Modal");
                  MicroModal.show("savedTemplates");
                  this.savedtemplate = true;
            },
            
            lastGenerated(){
                  var savedCode = localStorage.getItem("lastSaved");
                  console.log(savedCode);
                  if(savedCode!=null){
                        this.importedCode = savedCode;
                        this.importCode(true);
                  }
            },
            addToCustomButtons() {
                  var index = this.list.length;
                  
                  if(this.buttonName!=null && this.buttonTarget!=null){
                        var target = this.buttonTarget;
                        target= target.toLowerCase();
                        if(target.indexOf(" ")!=-1) target = target.replace(" ", "-");
                        this.list.push({ title: this.buttonName, order: index, fixed: false, target: target });
                        this.buttonName = '';
                        this.buttonTarget = '';
                  }
            },
            orderList() {
                  this.list = this.list.sort((one, two) => {
                        return one.order - two.order;
                  });
            },
            onMove({ relatedContext, draggedContext }) {
                  const relatedElement = relatedContext.element;
                  const draggedElement = draggedContext.element;

                  return draggedElement.location === relatedElement.location && draggedElement.locationid === relatedElement.locationid;
            },
      

            addLocation: function(event){
                  let id = this.locationId;
                  let name = this.locationName;

                  if((id!="" && id!=null) && (name!="" && name!=null)){
                        if(!this.checkDuplicationLocation(id)){

                              this.repo.push({
                                    id: id, 
                                    name: name, 
                                    isTab: false,
                                    customButtons: {},
                                    dashboardCustomizer: {},
                                    accountSelected: "admin",
                                    shortcut: [],
                                    userSettings: null,
                                    menus: [],
                              });
                              this.locationId = null;
                              this.locationName = null;
                              MicroModal.close("locationId");
                              
                              
                        }else alert("Location ID is already exist!");
                  }else alert("Please enter a valid Location ID and Name");
            },

           

            // setCookie: function(name,value,days) {
            //       var expires = "";
            //       if (days) {
            //           var date = new Date();
            //           date.setTime(date.getTime() + (days*24*60*60*1000));
            //           expires = "; expires=" + date.toUTCString();
            //       }
            //       document.cookie = name + "=" + (value || "")  + expires + "; path=/";
            //   },

            //   getCookie: function(name) {
            //       var nameEQ = name + "=";
            //       var ca = document.cookie.split(';');
            //       for(var i=0;i < ca.length;i++) {
            //           var c = ca[i];
            //           while (c.charAt(0)==' ') c = c.substring(1,c.length);
            //           if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            //       }
            //       return null;
            //   },

            //   eraseCookie: function(name) {   
            //       document.cookie = name+'=; Max-Age=-99999999;';  
            //   },
            

            generateCode: function(){
                  MicroModal.show("generateCode");
                  
                //   this.repo.map(val => {
                //         delete val.isTab;
                //   });
                  
                  let script = JSON.stringify(this.repo);
                  this.sidebar = false;
                  var _self = this;


                  this.generatedCode = `<script>var config = ${JSON.stringify(_self.repo)}; </script>
<script src="https://msg.everypages.com/customizer-test/cdn.js?agency_id=1442438e4adb157a8e55c693201bce926c651000"></script>`;


                  localStorage.setItem("lastSaved", this.generatedCode);
            },

            importCode: function(isLastSaved){
                  let code = this.importedCode;
                  let trimCode  = '';
                  if(code.indexOf("[")!=-1){
                        trimCode = code.substr(code.indexOf("["), code.length);
                        if(code.indexOf("snippets")!=-1) trimCode = trimCode.substr(0, trimCode.indexOf(";"));
                        else trimCode = trimCode.substr(0, trimCode.indexOf("</script"));

                        console.log(trimCode);
                  }

                  let snippetCode = code;
                  if(code.indexOf("snippets")!=-1){
                        snippetCode = code.substr(code.indexOf("snippets"), code.length);
                        snippetCode = snippetCode.substr(snippetCode.indexOf("{"), snippetCode.length);
                        snippetCode = snippetCode.substr(0, snippetCode.indexOf(";"));
                  }

      
                  try{
                        let config = eval(trimCode);
                        config.forEach(val => {
                              val.menus.forEach(val => {
                                    if(!val.type && !val.child){
                                          return val.type = 'single';
                                    }
                              });
                        });

                        var agencyId = config.findIndex(val => val.id == 'agency-dashboard');
                        if(agencyId != 0){
                              config.unshift({
                                    "id": "agency-dashboard",
                                    "name": "Agency Menu",
                                    "menus": [],
                                    "customButtons": null,
                                    "dashboardCustomizer": null,
                                    "checkIn": null,
                                    "isTab": false,
                                    "locationLogo": true,
                                    "userSettings": null,
                                    "adminSettings": null
                              })
                        }

                        if(code.indexOf("snippets")!=-1){

                              
                              
                                    let snippetConf = JSON.parse(snippetCode);
                                    let _self = this;

                                    Object.keys(snippetConf).forEach(function(item){
                                          if(item=="customButtonsOnDashboard"){
                                                _self.list = snippetConf[item]['menus'];
                                          }
      
                                          if(item=="checkIn"){
                                                _self.$refs.checkInElem.import(snippetConf[item]);
                                          }
      
                                          if(item=="shortcut"){
                                                _self.$refs.shortcut.import(snippetConf[item]);
                                          }
                                    });
                                    _self.$refs.dashCustomizer.import(snippetConf);
                                    config[0].dashboardCustomizer = snippetConf;
                        }
                        

                        this.repo = config;
                        this.importedCode = '';
                        
                        
                        if(!isLastSaved) MicroModal.close("importCode");
                        
                  }catch(err){ alert("Error in code!"); console.log(err);}
            },

            openImportModal: function(){
                  MicroModal.show("importCode");
            },

            openSnippetSettings: function(){
                  MicroModal.show("snippetSettings");
            },

            openLocationModal: function(){ MicroModal.show("locationId") },
            openCssModal: function(){MicroModal.show("cssModal");},
            addMenu: function(event){
                  let activeLocation = this.activeLocation;
                  let _self = this;
                  let menu = {
                        icon: this.menu.icon || "fas fa-cog",
                        name: this.menu.name || "My Settings",
                        link: this.menu.link,
                        isIframe: false,
                        isIconPath: false,
                        locationid: activeLocation.id,
                        location: this.menu.location || "bottom",
                        type: this.menu.type
                  };

                  if(this.menu.location=="after"){
                        
                        menu.locationTarget =  this.menu.locationTarget || "conversations";
                  }

                  if(this.isIframe==true){
                        menu.isIframe = true;
                  }
                  // needs to be connected otherwise throws an error
                  menu.iframe = {
                        title: this.iframeTitle,
                        description: this.iframeDescription,
                        modal: this.iframeModal
                  };

                  if(this.isIconPath==true){
                        menu.isIconPath = true;
                        menu.iconPath = this.iconPath;
                  }

                  
                  this.repo.forEach(function(location, index){
                        if(location.id==activeLocation.id){
                              
                              var isPassed = true;    
                              if(typeof menu.isIframe!='undefined' && _self.menu.type=="single"){
                                    if(menu.isIframe==true && menu.link!=undefined){
                                          if(menu.link.indexOf("https://")!=-1) _self.linkErrorMessage = "";
                                          else{
                                                _self.linkErrorMessage = "https is required or it won't appear";
                                                isPassed = false;
                                          }
                                    }

                                    if(menu.link==undefined || menu.link==""){
                                          isPassed = false;
                                          _self.linkErrorMessage = "Required link";
                                    }
                              }
                              
                              
                              
                              
                              if(isPassed){
                                    
                                    console.log(activeLocation);
                                    if(activeLocation.type=="child"){
                                          _self.repo[index].menus.forEach(function(option, count){
                                                if(option.name==activeLocation.child){
                                                      
                                                  
                                                      if(!!_self.repo[index].menus[count].child==false) _self.repo[index].menus[count].child = [];

                                                      var opts = {};
                                                      Object.keys(menu).forEach(function(t, i){
                                                            if(t!="icon"  && t!="location") opts[t] = menu[t];
                                                      });
                                                      _self.repo[index].menus[count].child.push(opts);
                                                }
                                          });
                                    }else {
                                          menu.id = _self.repo[index].menus.length;
                                          _self.repo[index].menus.push(menu);
                                          _self.repo[index].menus.sort(_self.compare);

                                          console.log(_self.repo[index].menus.sort(_self.compare))
                                    }
                                    

                                    _self.menu = Object.assign({}, _self.menu, {
                                          icon: null,
                                          name: null,
                                          link: null,
                                          type: "single",
                                          location: "bottom",
                                          locationTarget: "conversations"
                                    });
                                    _self.iconPath = "";
                                    _self.isIconPath = false;
                                    _self.isIframe = false;
                                    _self.iframeDescription = "";
                                    _self.iframeTitle = "";
                                    MicroModal.close("menuId");
                                    MicroModal.close("menuChildId");
                                    console.log(_self.repo[index].menus);
                              }
                        }
                        
                  });
            },

            compare: function(a, b) {
                  // Use toUpperCase() to ignore character casing
                  const propA = a.location.toUpperCase();
                  const propB = b.location.toUpperCase();
                
                  let comparison = 0;
                  if (propA > propB) {
                    comparison = 1;
                  } else if (propA < propB) {
                    comparison = -1;
                  }
                  return comparison * -1;
            },

            generateCSS: function(){
                  MicroModal.close("cssModal");
                  MicroModal.show("cssResult");
                  this.cssResult = `/* ${this.cssLocationId} - ${this.cssLocationName} */
._${this.cssLocationId} .hl_navbar--logo img {
      display:none;
}

._${this.cssLocationId} .hl_navbar--logo  {
      height:100px;
      background:url('${this.cssCode}');
      background-size:contain;
      background-repeat:no-repeat;
      background-position: center;
}`;
            },

            deleteMenu: function(menu, location){
                  let _self = this;
                  if (confirm('Are you sure?'))
                  {
                  this.repo.forEach(function(loc, index){
                        if(loc.id==location){
                              var menuIndex = loc.menus.findIndex(val => val.id == menu);
                              loc.menus.splice(menuIndex, 1);
                              // let temp = [];

                              // loc.menus.forEach(function(item){
                              //       if(item.id!=menu) temp.push(item);
                              // });

                              // _self.repo[index].menus = temp;
                        }
                  })
                  }
            },

            deleteMenuChild: function(menu, child, location){
                  this.repo.forEach((loc) => {
                        if(loc.id == location){
                              var menuIndex = loc.menus.findIndex(val => val.id == menu);
                              var childIndex = loc.menus[menuIndex].child.findIndex(val => val.name == child);
                              loc.menus[menuIndex].child.splice(childIndex, 1);

                              this.activeLocation = {id: loc.menus[menuIndex].id, name: loc.menus[menuIndex].name, type: loc.menus[menuIndex].type};
                        }
                  });
            },

            showIconList: function(){
                  var _self = this;
                  $(".icp-glyps").iconpicker({hideOnSelect: true});
                  $('.icp-glyps').on('iconpickerSelected', function(e) {
                        _self.menu.icon = e.iconpickerInstance.options.iconBaseClass + ' ' +
                        e.iconpickerInstance.getValue(e.iconpickerValue);
                  });
            },

            closeSidebar(){
                  if(this.sidebar==true){
                        this.sidebar = false;
                        this.updateLocationConfig();
                  }
            },
            showEditIconList: function(){
                  var _self = this;
                  $(".icp-glyps").iconpicker({hideOnSelect: true});
                  $('.icp-glyps').on('iconpickerSelected', function(e) {
                        _self.edit.menu.icon = e.iconpickerInstance.options.iconBaseClass + ' ' +
                        e.iconpickerInstance.getValue(e.iconpickerValue);
                  });
            },

            updateMenu: function(location, menu){          
                  console.log("Update");     
                  this.isEdit = true;
                  this.edit = {location: location, menu: menu};
                  console.log(this.edit)
                  MicroModal.show("editMenuId", {
                        onClose: this.destroyIconpicker
                  });
            },

            updateChild: function(location, menu, child){
                  this.isEdit = true;
                  this.edit = { location: location, menu: child, isChild: true, parent: menu };
                  MicroModal.show("editChildMenu", {
                        onClose: this.destroyIconpicker
                  });
            },

            destroyIconpicker: function(){
                  console.log("Iconpicker has been destroyed");
                  $(".icp-glyps").iconpicker({selected: false});
            },    

            updateRepo: function(){
                  var _self = this;

                  this.repo.forEach(function(location, index){
                        if(location.id==_self.edit.location.id){
                              _self.repo[index].menus.forEach(function(menu, o){

                                    if(!!_self.isChild && menu.id==_self.edit.parent.id){
                                          _self.repo[index].menus[o].child.forEach(function(child, i){
                                                if(child.name==_self.edit.menu.name){
                                                      _self.repo[index].menus[o].child[i] = _self.edit.menu;
                                                }
                                          });
                                    }else if(menu.id==_self.edit.menu.id){
                                          _self.repo[index].menus[o] = _self.edit.menu;
                                          
                                    }
                                    
                              });
                              _self.repo[index].menus.sort(_self.compare);
                        }
                  });

                  MicroModal.close("editMenuId");
                  MicroModal.close("editChildMenu");
                  
            },

            deleteLocation: function(id){
                  let temp = [];
                  this.repo.forEach(function(location){
                        if(location.id!=id) temp.push(location);
                  });

                  if(id=="all-location") this.defaultMenu = false;

                  this.repo = temp;
            },

            updateActiveLocation: function(id, name, type, childId, account){
                  this.showIconList();
                  this.activeLocation = {id: id, name: name, type: type, child: childId, accountType: account};
                  MicroModal.show("menuId");
            },

            updateChildActiveLocation: function(id, name, type, childId){
                  this.activeLocation = {id: id, name: name, type: type, child: childId};
                  MicroModal.show('menuChildId');
            },

            checkDuplicationLocation: function(id){
                  let isExist = false;
                  if(this.repo.length>0){
                        this.repo.forEach(function(location){
                              if(location.id==id) isExist = true;
                        });
                  }
                  return isExist;
            },
      }
});





