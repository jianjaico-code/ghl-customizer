var styles = [
     'https://msg.everypages.com/custom-settings/v4/css/jquery.modal.css', 
     'https://kit-free.fontawesome.com/releases/latest/css/free-v4-shims.min.css'
 ];
 
 var scripts = [
     {name: 'jquery', src:'https://code.jquery.com/jquery-3.5.0.slim.js'},
     {name: 'modal', src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js'}
 ];
 

 ready(function() {
      
     
     addStyles(styles, function(){
         addScript(scripts).then(function(){
               userSettings();
               carouselToggle();
               contactDetailsShortcut();
               saveButtonFix();
               updateTitleTag();
               addFavicon();
               customButtonsOnDashboard();
               locationMenu();
               checkInButton();
               shortcut();
               opportunityTags();
               messageActions();
               logoClick();
               triggerToggle();
               campaignToggle();
               driveLink();
               conversationFilter();
               opportunityDate();
         });
     });
});



/* Conversation Filter */
function conversationFilter() {
  if (snippets && snippets.conversationFilter && snippets.conversationFilter==true){
      function userDropdown(){
          if ($('.select-user').length<=0 && document.querySelectorAll('.messages-list-search').length>0){ 
               var select_users = document.createElement("SELECT");
               console.log(window.users.length);
               window.users.forEach(function(user){
                    var opt = document.createElement('option');
                    // window.users.push([doc.id,data.first_name,data.last_name]);

                    opt.value = user[0];
                    opt.innerHTML = user[1] + ' ' + user[2];
                    select_users.appendChild(opt);
               });
               var div_select = document.createElement("DIV");
               div_select.innerHTML="Assigned To:";
               div_select.appendChild(select_users);
               div_select.className='select-user';
               div_select.addEventListener('change',function(event) {filterConversations(event.target.value);});

               mlsearch = document.querySelectorAll('.messages-list-search')[0];
               mlsearch.after(div_select);
          }
    }


    function filterConversations(userid) {
          style='.messages-list--item { display:block; }';
          if (userid!='all') style='.messages-list--item { display:none; } .messages-list--item[user_id='+userid+'] { display:block;}';

          if ($('#messagefilterstyles').length<=0) $('head').append('<style id="messagefilterstyles">'+styles+'</style>');
          else $('#messagefilterstyles').html(style);
    }


     jQuery("body").on('DOMSubtreeModified', ".messages-list", async function(){
          document.querySelectorAll('.messages-list--item:not([user_id]),.messages-list--item:not([user_id=undefined])').forEach(function(t) {
          // console.log('.messages-list--item:not([user_id])');
          if (t.__vue__.$parent.$options && t.__vue__.$parent.$options.propsData){
               props = t.__vue__.$parent.$options.propsData;
               assigned_to=props.conversation.assigned_to
               t.setAttribute('user_id',assigned_to);
          }
          });
     });


     jQuery("body").on('DOMSubtreeModified', ".message-body--conversation", async function(){
          if (!window.users){
               window.loading_users=true;
               // console.log('loading users');
               css = '.messages-list-search{margin-top:-20px;z-index:6;position:relative}.select-user{margin-top:-10px;z-index:7;position:relative;margin-bottom:20px;font-size:12px;text-align:center;font-weight:700}.select-user select{display:block;margin:auto;padding:3px;border:1px #ccc solid;border-radius:5px}';
               jQuery("head").append(`<style>${css}</style>`);

               window.users = Array();
               window.users.push(['all','All','']);
               window.users.push(['undefined','Unassigned','']);

               pn = window.location.pathname;
               lid=pn.match(/location\/(\w*)\/.*/)[1];

               v.$db.collection("users").where("company_id", "==", v.company.id)
                    .where("locations."+lid,'==','').where("deleted","==",false).get().then(record=>
                    {

                    record.docs.forEach(function(doc){
                         data = doc.data();
                         window.users.push([doc.id,data.first_name,data.last_name]); 
                    });
                    // console.log(window.users.length);
                    // console.log('about to call userDropdown');
                    userDropdown();
                    window.loading_users=false;
                    });
          } else {
               // console.log('calling userDropdown without loading users');
               if (!window.loading_users) userDropdown();
          
          } 
     });
  } // if snippet
}




function opportunityDate() {
     if (snippets && snippets.opportunityDate && snippets.opportunityDate==true) {

          jQuery("body").on('DOMSubtreeModified', ".hl_opportunities", async function(){

               function toDateTime(secs) {
                    var t = new Date(1970, 0, 1); // Epoch
                    t.setSeconds(secs);
                    return t;
               }

               if ($('#opdatecss').length<=0){
                    style = `i.fa-calendar-plus-o{float:right;text-align:right}i.fa-calendar-plus-o span.opdate{display:block}`;
                    $('head').append('<style id=opdatecss>'+style+'</style'); 
               }
               
               document.querySelectorAll('.hl_opportunities-item:not(.hasdate)').forEach(function(op) {
                    op.classList.add('hasdate');
                    opdate = toDateTime(op.__vue__.opportunity._data.date_added.seconds);
                    opdate = opdate.toDateString();
                    opdate = opdate.substring(4,opdate.length);

                    if ($(op).find('span.opdate').length==0){
                         $(op).find('i.fa-calendar-plus-o').append('<span class="opdate">'+opdate+'</span>');
                    }
               });
          });
     }
}




function driveLink(){
	var input, stop;
     stop=false;
     $("body").on('DOMSubtreeModified', "#additional-info", function () {

          if($(".externalLinks").length==0){
               $('input[type=text].form-control:not(.gdrive),textarea.form-control:not(.gdrive)').each(function () {
                         if (stop) {
                              return;
                         } 
                         var str = $(this).val();
                         input = this;

                    
                         // $(this).addClass('gdrive');
                         if (str.startsWith('https://drive.google') || str.startsWith('http://') || str.startsWith('https://'))
                         {
                              if(str.indexOf("drive.google.com")!=-1)display(str.split(/\s*,\s*/));
                              else {
                                   $(input).parent().prepend('<a href="'+str.split(/\s*,\s*/)+'" class="externalLinks" target="_blank" style="float:right;">Open in New Tab</a>');
                              }
                              $(this).addClass('gdrive');
                         }
                    });
               
          }
          
     });


     function display(links){
          stop=true;
          if ($(input).hasClass('gdrive')) return;
          if (!$('#gdrivestyles').length) $("head").append(css());
          

          if(links.length>1){
               var html = `<div id="gdrive"> 
                         <div class='gdrive-open dropdown-toggle'>Open in Google Drive</div>`;
                         
                         
               html += `<div id="gdriveFiles" style="display: none;">`;
               links.forEach(function(link, i){
                    var filename = 'File '+(i+1);
                    
                    if(link.indexOf("fn=")!=-1){
                         link.split("&").forEach(function(param){
                              if(param.indexOf("fn=")!=-1) filename = param.replace("fn=", "");	
                         });
                    }
                    
                    html += `<a href="${link}" target="_blank">${filename}</a>`	
               });
               html += "</div>";
               html += `</div>`;
               
               
               $(input).parent().prepend(html);
          }else if(links.length==1){
               $(input).parent().prepend('<a href="'+links+'" class="externalLinks" target="_blank" style="float:right;">Open in Google Drive</a>');
          }
          stop=false;
     }

     function css()
          {
          return `<style id="gdrivestyles">
          #gdrive .gdrive-open:hover + #gdriveFiles,
          #gdriveFiles:hover {
               display: block !important;
          }

          .gdrive-open {
          cursor: pointer;
          }

          #gdrive {
          float: right;

          }

          #gdriveFiles a {
          display: block;
          cursor: pointer;
          padding: 2px 8px;
          border-bottom: 1px solid rgb(224, 224, 224);
          }

          #gdriveFiles a:hover{
          text-decoration: underline;
          }

          #gdriveFiles {
          position: absolute;
          background: rgb(255, 255, 255);
          box-shadow: 0px 0px 7px 1px #e8e8e8;
          z-index: 1000;
          right: 4px;
          width: 10rem;
          text-align: left;
          border: 1px solid rgb(234, 230, 230);
          border-radius: 2px;
          }

          </style>`;
     }
}

function userSettings(){
     if(typeof snippets.userSettings!='undefined'){
          var style = '.user .hl_settings--header li.settings-team {display: none; }';
          Object.keys(snippets.userSettings).forEach(function(key){

               if(!snippets.userSettings[key]){
                    style += `.user .hl_settings--header li.settings-${key}{
                         display: none;
                    }`
               }
          });

          jQuery("head").append(`<style>${style}</style>`);

          $("body").on('DOMSubtreeModified', ".hl_wrapper", function () {
               $('.hl_settings--nav').find("li").each(function(){
                    var paths = $(this).find("a").attr("href").split("/");
                    var setting = paths[paths.length-1];
                    $(this).addClass(`settings-${setting}`);
               });
          });
     }    
     
}



function addStyles(styles, callback){
     styles.forEach(function(link){
         var styleElem = document.createElement("link");
         styleElem.rel = "stylesheet";
         styleElem.href = link;
         document.querySelector("head").appendChild(styleElem);
     });
     
     callback();
 }
 
 
 function addScript(scripts){
      return new Promise(async (resolve, reject)=>{
         
         var index =0;
         while(index<scripts.length){
             var isContinue = true;
             if(scripts[index].name=="jquery" && window.hasOwnProperty('jQuery')){
                 isContinue = false;
             }
             
           var src = document.createElement("script");
           src.src = scripts[index].src;
           document.getElementsByTagName("head")[0].appendChild(src);
           
           await waitUntilLoaded(scripts[index].name);
           index++;
         }
           
          resolve();
           
      });
 }
 
 
 function waitUntilLoaded(type){
     return new Promise((resolve, reject)=>{
         var checker = setInterval(()=>{
                     var isExist = false;
                     if(type=="jquery" && typeof window.hasOwnProperty('jQuery')) isExist = true;
                     if(type=="modal") isExist = true;
                     if(isExist){
                          clearInterval(checker);
                          resolve();
                     }
           }, 500);
     })
 }
 
 

 
 function ready(fn) {
      if (document.readyState != 'loading'){
           fn();
      } else {
           document.addEventListener('DOMContentLoaded', fn);
      }
 }
 


function opportunityTags(){
     if(typeof snippets.opportunityTags!='undefined'){
          if(snippets.opportunityTags==true){
               $("body").on('DOMSubtreeModified', ".hl_opportunities", function () {

                    // add classes
                    $('.tag').each(
                         function() {
                              p = $(this).closest('.card-body');
                              if (!p.hasClass('tag-'+$(this).text())) 
                              {
                                   p.addClass('tag-'+$(this).text());
                              } 
                         });
                    // remove classes
                    $('.card-body').each(
                         function() {
                              p = this;
                              classList = $(p).attr('class');
                              
                              classTags = $(p).attr('class').split(/\s+/);
                              realTags = Array();
                              $(p).find('.tag').each(function() {
                                   realTags.push('tag-'+$(this).text());
                              });
          
                              classTags.forEach(function(tag){
                                   if (!realTags.includes('tag-'+tag)) {
                                        $(p).removeClass('tag-'+tag);
                                   }
                              });
                    });
                });
          }
     }
}
function messageActions(){
     if(typeof snippets.messageActions!='undefined'){
          if(snippets.messageActions==true)
          {
			  // console.log('loading message actions');
              jQuery("body").on('DOMSubtreeModified', ".messages-group-inner", async function(){

                document.querySelectorAll('.messages-group-inner div:not(.messages-group-heading)').forEach(
                  function(me) 
                  { 
                    if (me.__vue__ && me.__vue__.messages)
                    {
                      me.__vue__.messages.forEach ( function(message) {
                        for(var evt in message.events)
                        {
                          if (message.events[evt]==1)
                          { 
                            if ($(me).find('.message-'+evt).length==0)
                            {
                              tag = document.createElement('div');
                            tag.classList='tag tabletag message-'+evt;
                            tag.setAttribute('style','float:left;margin-right:10px;');
                            evt = evt[0].toUpperCase()+evt.substring(1,evt.length);
                            tag.innerText=evt;
                            $(me).find('.email-item--header-right').append(tag);
                            }
                          }
                        }
                        
                      });
                    } 
                  });
              });
          }
      }
}
locationcss=false;
async function locationLogoInit(){
 
     if(typeof snippets.locationLogo!='undefined'){
          $("body").on('DOMSubtreeModified', ".hl_wrapper", function () {
	    
            if (document.querySelectorAll('.hl_navbar--logo').length>0 && document.querySelectorAll('.hl_wrapper').length>0) {
				hl = document.querySelector('.hl_wrapper').__vue__;					
            	if (hl && hl.location && hl.location._data)
            	{
                logo_url='';
            		if (hl.location._data.logo_url) {
            			logo_url = hl.location._data.logo_url;
            		} else {
                  if (v.company && v.company.logoURL)
            			   logo_url = v.company.logoURL;
            		}
            		if (logo_url.length>0 && document.querySelector('.hl_navbar--logo img').src!=logo_url)
            		{
            			document.querySelector('.hl_navbar--logo img').src=logo_url;
            		}
            	}
            }
            });
     }
}

function getCompanyId(){
     return new Promise((resolve, reject)=>{
          var checker = setInterval(()=>{
               v = document.getElementById("app").__vue__;
               if(typeof v.company!='undefined'){
                    clearInterval(checker);
                    resolve(v.company._id);
               }x
          }, 100);
     });
}


function triggerToggle(){
     if(typeof snippets.triggerToggle!='undefined'){
          if(snippets.triggerToggle==true){
               
               v = document.getElementById('app').__vue__;

               jQuery("body").on('DOMSubtreeModified', ".hl_triggers--wrap", async function(){

               document.querySelectorAll('.hl_triggers--wrap .icon-trash:not(.mktadded)').forEach(
                    function(t) { 
                    t.classList.add('mktadded');
                    var turn_on = document.createElement("button");
                    turn_on.classList = 'btn btn-light4';
                    turn_on.innerHTML='Active';
                    turn_on.style="margin-right:10px;padding:5px;font-size:.8125rem;";

                    turn_on.addEventListener("click", function(e) {
							var pn = window.location.pathname;
							location_id = pn.match(/location\/(\w*)\/.*/)[1];
							folder_id = e.target.parentNode.parentNode.parentNode.__vue__.folder.id;
							v.$db.collection("triggers").where("location_id", "==", location_id).where("folder_id", "==", folder_id).get().then(record=>{
							record.docs.forEach(function(doc){
								v.$db.collection("triggers").doc(doc.id).update({active:true});
							});
							});
                    });
                    t.parentNode.prepend(turn_on); 

                    var turn_off = document.createElement("button");
                    turn_off.classList = 'btn btn-light4';
                    turn_off.innerHTML='Draft';
                    turn_off.style="margin-right:10px;padding:5px;font-size:.8125rem;";

                    turn_off.addEventListener("click", function(e) {
							var pn = window.location.pathname;
							location_id = pn.match(/location\/(\w*)\/.*/)[1];
							folder_id = e.target.parentNode.parentNode.parentNode.__vue__.folder.id;
							v.$db.collection("triggers").where("location_id", "==", location_id).where("folder_id", "==", folder_id).get().then(record=>{
							record.docs.forEach(function(doc){
								v.$db.collection("triggers").doc(doc.id).update({active:false});
							});
							});
                    });
                    t.parentNode.prepend(turn_off); 
                    }
                    );

               });



          }
     }
}

function campaignToggle(){
  // console.log('campaignToggle');
     if(typeof snippets.campaignToggle!='undefined')
     {
            // console.log('snippets.campaignToggle not undefined');

          if(snippets.campaignToggle==true){
            // console.log('snippets.campaignToggle');
            style = `.py-2:not(.folder-open) button {
            opacity:50%;
            pointer-events: none;
            }`;
            jQuery('head').append('<style>'+style+'</style>');
            jQuery("body").on('DOMSubtreeModified', ".hl_customer-acquisition--table", async function()
            {

              document.querySelectorAll('.hl_customer-acquisition--table div:not(.folder-toggle)>.cursor-pointer').forEach(function(me) {
                  me.addEventListener("click", function(e) {

                    if (e.target.parentNode.previousSibling.classList.contains('show-active'))
                    {
                      e.target.parentNode.parentNode.parentNode.classList.add('folder-open');
                    } else {
                      e.target.parentNode.parentNode.parentNode.classList.remove('folder-open');
                    }
                  });
              });

              document.querySelectorAll('.hl_customer-acquisition--table div:not(.folder-toggle)>.pointer').forEach(function(me) {
                if (me.classList.contains('show-active')) // set the folder-open state on load.
                {
                  me.parentNode.parentNode.classList.add('folder-open');
                } else {
                  me.parentNode.parentNode.classList.remove('folder-open');
                }

                me.addEventListener("click", function(e) {
                  if (e.target.classList.contains('show-active'))
                  {
                    e.target.parentNode.parentNode.classList.add('folder-open');
                  } else {
                    e.target.parentNode.parentNode.classList.remove('folder-open');
                  }
                });
              });

              document.querySelectorAll('.hl_customer-acquisition--table div:not(.folder-toggle)>.pointer').forEach(function(me) 
              {

                me.parentNode.classList.add('folder-toggle');
                publish = document.createElement('button');
                publish.innerText='Publish';
                publish.classList = 'btn btn-light4';  
                publish.style="margin-right:10px;padding:5px;font-size:.8125rem;";

                publish.addEventListener("click", function(e) 
                  {
                    //e.target.parentNode.parentNode.firstElementChild.firstElementChild.classList.contains('show-active');
                    campaigns = e.target.parentNode.parentNode.nextSibling.childNodes;
                    campaigns.forEach(function(campaign) {
                        campaign.__vue__.campaign.status='published';
                    });
                  });

                draft = document.createElement('button');
                draft.innerText='Draft';
                draft.classList = 'btn btn-light4';    
                draft.style="margin-right:10px;padding:5px;font-size:.8125rem;";

                draft.addEventListener("click", function(e) 
                  {
                    campaigns = e.target.parentNode.parentNode.nextSibling.childNodes;
                    campaigns.forEach(function(campaign) {
                        campaign.__vue__.campaign.status='draft';
                    });
                  });

                  me.parentNode.nextSibling.append(draft);
                  me.parentNode.nextSibling.append(publish);

              });
            });


       }
  }
}
function logoClick(){
     if(typeof snippets.logoClick!='undefined'){
          if(snippets.logoClick==true){
               jQuery("body").on('DOMSubtreeModified', "#app .hl_header", async function(){
                    if(jQuery(".logo-click").length==0){
                         jQuery('head').append('<style class="logo-click">.hl_navbar--logo { cursor:pointer; }</style>');
                         
                    }
					jQuery('.hl_navbar--logo').click(function() { 
                              jQuery('#nav-links #nav-dashboard a')[0].click();
					});
               });
          }
     }

     
}

 function shortcut(){
     if(typeof snippets.shortcut!='undefined'){
          jQuery("body").on('DOMSubtreeModified', "#app .hl_dashboard", async function(){
               if ($('.mkt-button').length<=0) {
                    
                    jQuery("#nav-links").find("a").each(function(){
                         var title = $(this).text();
                         title = title.replace(" ", "-");
                         $(this).addClass(title.toLowerCase());
                    });

                    var temp = [];
                    snippets.shortcut.forEach(function(buttons){

                         var bgcolor = buttons.color;
                         if(bgcolor.indexOf("#")==-1) bgcolor = `#${bgcolor}`;

                         var elem = jQuery(`<button class="btn btn-success mkt-button" style="background: ${bgcolor}">${buttons.name}</button>`);
                         
                         if(buttons.type=="target"){
                              elem.click(function(){
                                   jQuery("#nav-links").find(`.${buttons.target}`)[0].click();
                              });
                         }else{
                              
                              if(buttons.isIframe!=true){
                                   elem.click(function(){
                                        window.open(buttons.target, "_blank");
                                   });
                              }else {
                                   if(buttons.iframe.modal==true){

                                        jQuery(elem).attr({
                                             "data-toggle": "modal",
                                             "data-target": "#mktModal",
                                             "title": buttons.iframe.title,
                                             "description": buttons.iframe.description,
                                             "target": buttons.target
                                        });
     
     
                                        jQuery(elem).click(function(){
                                             $("#mktModal").find(".mkt-iframe").empty();
     
                                             if(typeof $(this).attr("title")!='undefined'){
                                                  var description = $(this).attr('description');
                                                  if(typeof description!=undefined) description = '';
                                                  $("#mktModal").find(".modal-title").html(`${$(this).attr("title")} <span>${description}`);
     
                                             }
                                             $("#mktModal").find(".mkt-iframe").html(`<div class='content' style='height: 100%'><iframe id='iframe' src='${$(this).attr("target")}' frameborder='0' width='100%' height='100%'></iframe></div>`);
                                        });
                                        displayModal();
                                        
                                   }else{
                                        elem.click(function(){
                                             displayIframe("shortcut", buttons.iframe.title, buttons.iframe.description, buttons.target);
                                        });
                                   }
                              }
                         }

                         temp.push(elem);
                    });


                    for(var i=temp.length; i>=0; i--){
                         $('.hl_wrapper--inner.hl_dashboard').prepend(temp[i]);
                    }
                    
                    
                    
                    $('.mkt-button').css('margin-left','20px');
                    $('.mkt-button').css('margin-bottom','10px');
               };
          });
     }
     
     
 }



function checkInButton(){

     var elemCss = document.createElement("style");

     var hideButton = '';

     if(typeof snippets.checkIn=='undefined') return;

     // HIDE BUTTON
      if(typeof snippets.checkIn.hideButton!='undefined'){
          if(snippets.checkIn.hideButton==true){
               hideButton = `
               #navbar-collapse .hl_navbar--button {
                    display:none; 
               }`;
          }
     }

     var color = '';
     // COLOR
     if(typeof snippets.checkIn.color!='undefined'){
          var bgcolor = snippets.checkIn.color;
          if(bgcolor.indexOf("#")==-1) bgcolor = `#${bgcolor}`;
          
          color = `
               #navbar-collapse .hl_navbar--button {
                    background:${bgcolor};
                    line-height:24px;
                    position: relative;
               }
          `
     }

     var text = '';
     // TEXT
     if(typeof snippets.checkIn.text!='undefined'){
          text  = `
               #navbar-collapse .hl_navbar--button{
                    color: #ffffff00 !important;
                    -webkit-touch-callout: none; /* iOS Safari */
                         -webkit-user-select: none; /* Safari */
                         -khtml-user-select: none; /* Konqueror HTML */
                         -moz-user-select: none; /* Old versions of Firefox */
                              -ms-user-select: none; /* Internet Explorer/Edge */
                              user-select: none; /* Non-prefixed version, currently
                                                       supported by Chrome, Edge, Opera and Firefox */
               }
               #navbar:not(.shrink) #navbar-collapse .hl_navbar--button:after {
                    content: "${snippets.checkIn.text}";
                    position:absolute;
                    display:block;
                    padding:10px;
                    font-size:14px !important;
                    color:#fff !important;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
               }
               `
     }


     var types = '';
     if(typeof snippets.checkIn.type!='undefined'){
          if(snippets.checkIn.type=='default' && snippets.checkIn.target!='undefined'){
               types = `
               /* Change the Text on the Pop Up Check In Box */ 
               #client-checkin--modalLabel {
                    color: #ffffff00 !important;
                    -webkit-touch-callout: none; /* iOS Safari */
                    -webkit-user-select: none; /* Safari */
                    -khtml-user-select: none; /* Konqueror HTML */
                    -moz-user-select: none; /* Old versions of Firefox */
                    -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Non-prefixed version, currently
                                   supported by Chrome, Edge, Opera and Firefox */ 
               }
               
               
               #client-checkin--modalLabel:after {
                    content: "${snippets.checkIn.target}";
                    position:absolute;
                    display:block;
                    padding:10px;
                    font-size:16px !important;
                    color:#000 !important;
                    position: absolute;
                    top: 15px;
                    left: 55px;
                    right: 0;
                    bottom: 0;   
               }

               


               #client-checkin--modalLabel i{
                    font-size:16px !important;   
               }
              `
          }
     }





     elemCss.innerHTML = `
          ${hideButton}
          ${color}
          ${text}
          ${types}
     `;

     document.getElementsByTagName("head")[0].appendChild(elemCss);
     if(typeof snippets.checkIn!='undefined'){


          jQuery("body").on('DOMSubtreeModified', ".hl_header", async function(){
              
              
              
               // // COLOR
               // if(typeof snippets.checkIn.color!='undefined'){
               //      var bgcolor = snippets.checkIn.color;
               //      if(bgcolor.indexOf("#")==-1) bgcolor = `#${bgcolor}`;
               //      jQuery(".hl_navbar--button").css({background: bgcolor});
               // }

               // // TEXT
               // if(typeof snippets.checkIn.text!='undefined'){
               //      jQuery(".hl_navbar--button").html(snippets.checkIn.text);
               // }

               // // HIDE BUTTON
               // if(typeof snippets.checkIn.hideButton!='undefined'){
               //      if(snippets.checkIn.hideButton==true) jQuery(".hl_navbar--button").hide();
               // }

               // ACTION
               if(typeof snippets.checkIn.type!='undefined'){
                        
                    if(snippets.checkIn.type!='default'){
                         var elem = jQuery(".hl_navbar--button").html();
                         if(jQuery(".target-source").length==0){
                              var elem = jQuery(".hl_navbar--button").html();
                              elem = jQuery(`<div class="hl_navbar--button btn btn-success btn-block target-source">${elem}</div>`);
                              jQuery(".hl_navbar--button").remove();
                              
                              var pn = window.location.pathname;
                              if(pn.match(/location\/(\w*)\/.*/)!=null) jQuery("#navbar-collapse").prepend(elem);
                         }
                    }
                    
                    


                    // TARGET
                    if(snippets.checkIn.type=='target' && snippets.checkIn.target!='undefined'){
                         jQuery("#nav-links").find("a").each(function(){
                              var title = $(this).text();
                              title = title.replace(" ", "-");
                              $(this).addClass(title.toLowerCase());
                         });
                    
                    
                         if(jQuery(".target-source").length!=0){
                              var target = snippets.checkIn.target;
                              if(target.indexOf(" ")!=-1) target = target.replace(" ", "-");
                              target = target.toLowerCase();
                              
                              jQuery(".target-source").attr("data-link", target);
                              jQuery(".target-source").click(function(e){
                                   e.preventDefault();
                                   e.stopPropagation();
                                   var targett = $(this).attr("data-link");
                                   jQuery("#nav-links").find(`.${target}`)[0].click();
                              });
                         }
                    }


                    // LINK
                    if(snippets.checkIn.type=='link' && snippets.checkIn.target!='undefined'){
                         
                         // IFRAME
                         if(typeof snippets.checkIn.isIframe!='undefined' && snippets.checkIn.isIframe==true){
                              
                              if(snippets.checkIn.iframe.isModal){
                                   
                                   jQuery(".target-source").attr({
                                        "data-toggle": "modal",
                                        "data-target": "#mktModal",
                                        "title": snippets.checkIn.iframe.title,
                                        "description": snippets.checkIn.iframe.description,
                                        "target": snippets.checkIn.target
                                   });


                                   jQuery(".target-source").click(function(){
                                        $("#mktModal").find(".mkt-iframe").empty();

                                        if(typeof $(this).attr("title")!='undefined'){
                                             var description = $(this).attr('description');
                                             if(typeof description!=undefined) description = '';
                                             $("#mktModal").find(".modal-title").html(`${$(this).attr("title")} <span>${description}`);

                                        }
                                        $("#mktModal").find(".mkt-iframe").html(`<div class='content' style='height: 100%'><iframe id='iframe' src='${$(this).attr("target")}' frameborder='0' width='100%' height='100%'></iframe></div>`);
                                   });
                                   displayModal();
                              }else{
                                   jQuery(".target-source").click(function(){
                                        displayIframe("checkIn", snippets.checkIn.iframe.title, snippets.checkIn.iframe.description, snippets.checkIn.target);
                                   });
                              }
                         }else{

                              // NEW TAB
                              window.open(snippets.checkIn.target, "_blank");
                         
                         }

                    }
               }
          });
                    
                    
               
          
     }
}



 function carouselToggle(){
     markLocation(); // menufix is in marklocation already.
     // locationLogos();
     // menuFix();
     disableMenuShrink();
       locationLogoInit();
     
      // jQuery("body").on('DOMSubtreeModified', "#nav-links", function(){

      v = document.getElementById('app').__vue__;
      v.$router.afterEach((to, from) => {
        // after every page change, mark the location. We're losing the html location class randomly.
         markLocation();
      });

      jQuery("body").on('DOMSubtreeModified', "#app .hl_header", function(){
         markLocation();
         // locationLogoInit();
         // locationLogos();

         // menuFix();
         disableMenuShrink();
      });
      // jQuery("body").on('DOMSubtreeModified', "html", function(){
      //   pn = window.location.pathname;
      //   var root = document.documentElement;
      //   lid=pn.match(/location\/(\w*)\/.*/)[1];
      //   if (!root.classList.contains('_'+lid)){
      //    markLocation();
      //   }
      // });
      
 }
 
 
 function markLocation(pn='') {
	 if (pn=='') 
     {
      pn = window.location.pathname;
     }
     
     var root = document.documentElement;
     html = root.classList.toString();
     if (html.match(/(_[\d\w]*) (.*) (_[\d\w]*)/))
     {
      // two location id classes in the root. 
     root.classList='';
     }
     v = document.getElementById('app').__vue__;
     if (v && v.user) {
		user = (v.user.isAdmin) ? 'admin' : 'user' 
		usertype = v.user.type;
		if (!root.classList.contains(user)){
		root.classList.add(user);
		}
		if (!root.classList.contains(usertype)){
		root.classList.add(usertype);
		}

     }
     if (pn.match(/location\/(\w*)\/.*/)){
        var lid;
        lid=pn.match(/location\/(\w*)\/.*/)[1];
        var root = document.documentElement;
        if (!root.classList.contains('_'+lid)){
             root.classList.remove('accounts');
             root.classList.add('_'+lid);
             

            if ( document.querySelectorAll('#locationcss').length>=1 && !root.classList.contains('location_css_added')) 
            {
              root.classList.add('location_css_added');
            }

             window.dispatchEvent(new Event('location_change'));
               var evt = new Event(lid);
               // for the conversation filter 
               window.dispatchEvent(evt);
               window.users=null;
               $('.select-user').remove();
               //  end
             wait('.hl_navbar--links',10000).then(function() {
                  // master ready script.
                  // needs to be re-thought out.
                  menuFix();
                  disableMenuShrink();
     
             }).catch(function() {
             });
        }
     } else 
     {
      // in the admin area 
        root.classList='';
        root.classList.add('accounts');
     }
      
      
 }
 markLocation();
 
 
 function wait(selector) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
 
      var start = performance.now();
      var now = 0;
 
      return new Promise(function (resolve, reject) {
      var interval = setInterval(function () {
           var element = document.querySelector(selector);
 
           if (element instanceof Element) {
                clearInterval(interval);
 
                resolve();
           }
 
           now = performance.now();
 
           if (now - start >= timeout) {
                reject("Could not find the element " + selector + " within " + timeout + " ms");
           }
      }, 10);
      });
 }
 
 
 async function locationMenu(){
     if(jQuery("#nav-links").length==0){
            await wait("#nav-links", 1000);
       } 
      
      
     injectMenu();
     jQuery("body").on('DOMSubtreeModified', "#app .hl_header", async function () {
         injectMenu();
     });
          
 }
 
 
 function injectMenu(){
     var url = window.location.pathname.split("/");
         var locationid = null;
         if(url.length>=3) locationid = url[2];
         try{
                   
                 
           if(typeof menuconfig=="object"){

               $(".router-link-exact-active").click(function(){
                    var isActive = false;
                    var target = $(this).attr("href");
                    $('.mkt-menu-list').each(function(){
                         if($(this).hasClass("active")){
                              isActive = true;
                         }
                    });

                    if(isActive){
                        
                         var v = document.getElementById("app").__vue__;
                         
                         $(".active").each(function(){
                             $(this).removeClass("active");
                         })
                         
                         v.$router.push(`/location/${locationid}/settings`);
                         setTimeout(function(){
                              v.$router.push(`/location/${locationid}/dashboard`);
                         }, 100);
                         // v.$router.go();
                         
                         $(this).addClass("active");
                    }
               });

                menuconfig.forEach(function(location){
                
                
                     location.menus.forEach(function(menu){
                     var customAttr = '';
                     if(!menu.isIconPath) customAttr = `class="${menu.icon}"`;
                     else {
                          customAttr = `style='background: url(${menu.iconPath});
                               background-size: 100%;
                               background-repeat: no-repeat;
                               padding: 10px;
                               height: 1rem;
                               position: relative;
                               left: -1px'`;
                     }
                          
                     var hrefLink = `href="${menu.link}"`;
                     if(menu.isIframe==true) hrefLink = "";
                     var element = `<a ${hrefLink} target="_blank" class="menucreator" >
                                         <i ${customAttr}></i>
                                         <span>${menu.name}</span>
                                    </a>`	;
                                    
                     var src = document.createElement("li");
                     src.setAttribute("class", `mkt-menu-list menu-${location.id}-${menu.id}`);
                     
                     if(menu.isIframe){
                          if(menu.iframe.modal){
                              
                              $(this).addClass("active");
                              jQuery(src).attr({
                                   "data-toggle": "modal",
                                   "data-target": "#mktModal",
                                   "title": menu.iframe.title,
                                   "description": menu.iframe.description,
                                   "target": menu.link
                              });



                              
                              jQuery(src).click(function(){
                                   $("#mktModal").find(".mkt-iframe").empty();

                                   if(typeof $(this).attr("title")!='undefined'){
                                        var description = $(this).attr('description');
                                        if(typeof description=='undefined') description = '';
                                        $("#mktModal").find(".modal-title").html(`${$(this).attr("title")} <span>${description}</span>`);

                                   }
                                   $("#mktModal").find(".mkt-iframe").html(`<div class='content' style='height: 100%'><iframe id='iframe' src='${$(this).attr("target")}' frameborder='0' width='100%' height='100%'></iframe></div>`);
                              });


                              
                              displayModal();
                          }
                          else {
                              src.setAttribute("onclick", `displayIframe('menu-${menu.id}', '${menu.iframe.title}', '${menu.iframe.description}', '${menu.link}')`);
                              $(src).click(function(){
                                   $(".active").removeClass("active");
                                   $(this).addClass("active");
                              });
                          }
                     }
                     src.innerHTML = element;
                          
                          
                    
                         if(locationid==location.id || location.id=="all-location"){
                              if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length==0){
                                  
                                   if(typeof menu.location!='undefined' && menu.location!="bottom"){
                                        if(menu.location=="top") document.querySelector('#nav-links').prepend(src);
                                        else {
                                             if(typeof menu.locationTarget!='undefined'){
                                                  $(`#nav-${menu.locationTarget}`).after(src);
                                             }
                                             else document.querySelector('#nav-links').prepend(src);
                                        } 
                                   }else document.querySelector('#nav-links').appendChild(src);
                              }
                              
                         }else{
                              if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length!=0){
                                   document.querySelectorAll(`.menu-${location.id}-${menu.id}`).forEach(e => e.parentNode.removeChild(e));
                              }
                         }
                    
                          
                          
                     });
                
                     
                });	
           }
         }catch(err){
             
         }
 }
 
 
 
 
 function displayModal(id, title, description, link){
     if(description==null  || description=='null' || typeof description=='undefined') description= "";
     //  var modalElem = `
     //      <style>
     //          .jquery-modal { z-index: 100000 !important; }
              
     //          .jquery-modal .modal {
     //              display: inline-block;
     //             width: 96%;
     //            padding: 0;
     //            height: 89vh;
     //            max-width: unset !important;
     //          }
              
     //          .jquery-modal iframe {
     //                  width: 100%;
     //                 height: 84vh;
     //                 border: none;
     //                 border-top: 1px solid rgb(220, 220, 220);
     //          }
              
     //          .jquery-modal h1 {
     //                  padding: 17px;
     //                 font-size: 19pt;
     //          }
              
     //          .jquery-modal span {
     //                  font-size: 11pt;
     //                 padding-left: 15px;
     //          }
              
     //          .jquery-modal a.close-modal {
     //          position: absolute;
     //             top: 5.5px;
     //             right: 7.5px;
     //          }
     //      </style>
     //      <div id="${id}" class="modal">
     //          ${ (title!=null && title!=undefined && title!="" && title!="null" ? `<h1>${title} <span>${description}</span></h1>` : ``) }
               
     //           <iframe src="${link}" allowfullscreen></iframe>
     //         </div>`;
     //  jQuery("body").prepend(modalElem);
     //  jQuery(`#${id}`).modal();
          var elem = `
          <style type="text/css">#mktModal .modal-open .modal { overflow-y: hidden; } #mktModal .modal-dialog.modal-xl{height:90%;margin:1.5% auto;width: 95%;
               max-width: unset;}#mktModal .modal-content{height:100%;border-radius:0}#mktModal .modal-header{border-radius:0;background:#ffffff;padding:12px 20px;border:0}#mktModal .modal-header h5{color:#616161;font:20px/1.5 Roboto;margin:0;padding:0}#mktModal .modal-header .close{font-size:2.5rem;color:#a0a0a0;top:-1px}#mktModal .modal-body{padding:0}#mktModal .iframe-container{overflow:hidden;height:100%;position:relative}#mktModal .iframe-container iframe{border:0;height:100%;left:0;position:absolute;top:0;width:100%}#mydiv{position:absolute;top: 25%; left: 25%; height: 50%; width: 50%;z-index:10000;background-color:#f1f1f1;border:1px solid #d3d3d3;text-align:center}#mydivheader{padding:10px;cursor:move;z-index:10;background-color:#2196f3;color:#fff}</style>
          <div class='modal fade' id='mktModal' tabindex="-1" role="dialog" aria-labelledby="mktModal" aria-hidden="true" >
                         <div class="modal-dialog modal-dialog-centered modal-xl" role="document">    
                              <div class="modal-content">      
                                   <div class="modal-header" style="height: 3rem;">        
                                        <h5 class="modal-title"></h5>
                                        <span class="modal-description" style='font-size: 11pt;
                                        position: relative;
                                        left: 12px;
                                        font-weight: unset;'></span>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                             <span aria-hidden="true">&times;</span>        
                                        </button>      
                                   </div>      
                              <div class="modal-body">        
                                   <div class="mkt-iframe" style="height: 100%;"></div>      
                              </div>    
                         </div>  
                    </div>`;
          if (jQuery('#mktModal').length<=0)                   
            jQuery("body").prepend(elem);


 }
 
 
 
 function displayIframe(id, title, description, link){
      if(description==null || description=='null') description = "";
      document.querySelector(".hl_wrapper").innerHTML = `
           <style>
                .menu-header {
                     padding: 1rem 2rem 0rem;
                     font-size: 13pt;
                }
 
                .menu-subtitle {
                     padding: 0rem 0rem 0rem 1rem;
                     font-size: 11pt;
                     color: #b5c0c7;
                }
                .menu-iframe {
                     position: relative;
                     top: 14px;
                     bottom: 0px;
                     right: 0px;
                     width: 100%;
                     border: none;
                     margin: 0;
                     padding: 0;
                     overflow: hidden;
                     z-index: 0;
                     height: 75.95vh;
                }
           </style>

          
           ${(title!=null && title!=undefined && title!="" && title!="null" ? `<div class="menu-header">${title} <span class="menu-subtitle">${description}</span></div>` : '')}
           
           <iframe src="${link}" class="menu-iframe" allowfullscreen></iframe>
      `;
 }
 
 
 /** SNIPPET 1 **/
 function contactDetailsShortcut(){
 
 
      // makes it so clicking an opportunity title takes you to the contact details	
      jQuery("body").on('DOMSubtreeModified', ".hl_opportunities", function () {
           if (jQuery('.hl_opportunities').length) {
                jQuery('.card-body').click(
                     function() { 
                          contactlink = jQuery(this).find('a')[0]; 
                          jQuery('.modal-header h2.modal-title').click(
                               function() { 
                                    jQuery('.modal-header button.close').click();
                                    contactlink.click(); 
                               });
                          });  
 
           }
      });
 }
 
 
 /** SNIPPET 2 **/
 function menuFix() {
      
      if(typeof snippets!="undefined" && typeof snippets.menuFix!="undefined" && snippets.menuFix){
           /* Menu Fix */
           
         document.querySelectorAll('ul#nav-links>li>a').forEach(function(el) {
             el.addEventListener("click", function(ev) {
                       document.querySelectorAll('#nav-links a[aria-expanded="true"]').forEach(function(el) {
                            if (el!==ev.target) {el.click();}
                       });			
             });
         });
      }
      
 }
 
 
 
 /** SNIPPET 3 **/
 function disableMenuShrink() {
      if(typeof snippets!="undefined" && typeof snippets.disabledMenuShrink!="undefined" && snippets.disabledMenuShrink){
          
        if (document.querySelectorAll('#navbar').length>0) {

        if(document.querySelector("#navbar").classList.contains("menu-shrink")==false) {
                     document.querySelector("#navbar").classList.add("menu-shrink");
                     document.getElementById('navbar').addEventListener('mouseover', function(){
                          if(document.querySelectorAll('.nav-shrink').length>0){
                                    document.getElementById('navbar').classList.remove("shrink");
                          }
                     });
                     
                     document.getElementById('navbar').addEventListener('mouseout', function(){
                          if(document.querySelectorAll('.nav-shrink').length>0) {
                               document.getElementById('navbar').classList.add("shrink");
                          }
                     });
                }
         
        }
      }
 }

 /* for menu shrink */
function expandmenu() {
if (document.querySelectorAll('header.closing').length<=0) {
     if (document.querySelectorAll('#navbar-toggler.collapse').length>0) {
          if (document.querySelectorAll('header.hl_header.nav-shrink').length>0){
               document.getElementById('navbar').classList.remove("shrink");
               document.querySelector('#app>div').classList.remove('pmd-app');
               document.querySelector('header').classList.remove('nav-shrink'); 
          }
     }
}
}


function collapsemenu() {
if (document.querySelectorAll('#navbar-toggler.collapse').length>0) {
if (document.querySelectorAll('header.hl_header.nav-shrink').length<=0) {
     document.getElementById('navbar').classList.add("shrink");
     document.querySelector('#app>div').classList.add('pmd-app');
     document.querySelector('header.hl_header').classList.add('nav-shrink');         
}
document.querySelector('header').classList.remove('closing')

}
}

// function disableMenuShrink() {
// if (checkAttr('disable_shrink_hover')) {		
//           document.querySelector('i.icon-arrow-left-1').addEventListener('click',function() {
//                     document.querySelector('header.hl_header').classList.add('closing')
//                     collapsemenu()
//           });
          
//           document.getElementById('navbar').removeEventListener('mouseenter', expandmenu);
//           document.getElementById('navbar').removeEventListener('mouseleave',collapsemenu);
          
//           document.getElementById('navbar').addEventListener('mouseenter', expandmenu);
//           document.getElementById('navbar').addEventListener('mouseleave', collapsemenu);
// }
// }


 
 
 /** SNIPPET 4 **/
 function saveButtonFix(){
 
      if(typeof snippets!="undefined" && typeof snippets.saveButtonFix!="undefined" && snippets.saveButtonFix){
           var s=document.createElement("style")
           s.innerHTML='#prospect.unsaved .form-footer.save{position:absolute !important;top:1px !important;right:0px !important;z-index: 999999;padding-top:10px;  padding-right:20px;}#prospect.unsaved {    padding-top:50px !important;}';
           document.getElementsByTagName("head")[0].appendChild(s);
 
           jQuery("body").on('DOMSubtreeModified', "#contact-details", function () {
                if (jQuery('#prospect').length) 
                {
                     jQuery('#prospect input').change(
                     function() { 
                          jQuery('#prospect').addClass('unsaved'); 
                          jQuery('.form-footer.save button').click(
                               function() { jQuery('#prospect').removeClass('unsaved'); }); 
                     });
                }
           });  
      }
      
 }
 
 
 /** SNIPPET 5  **/
 function addFavicon(){
      if(typeof snippets!="undefined" && typeof snippets.addFavicon!="undefined" && snippets.addFavicon.status){
           document.querySelector("link[rel=icon]").href = snippets.addFavicon.link;
      }
 }
 
 
 /** SNIPPET 6  **/
 async function updateTitleTag(){
     jQuery("body").on('DOMSubtreeModified', "#app .hl_header", function () {
     if(document.querySelectorAll("#nav-links").length>0) 
     {
         var previousTitle = document.title;
         if(previousTitle.indexOf("|")!=-1) previousTitle = previousTitle.split("|")[1].replace("|", "");
         var pagename = jQuery('a[href="'+window.location.pathname+'"]').first().text();
		 if (!pagename) { pagename=jQuery('.active a').first().text(); }
		 var tabTitle = pagename + ' | '+  previousTitle;
         if(tabTitle!=previousTitle) document.title= pagename + ' | '+  previousTitle;        
     } 
	});
 }
 
 
 
 /** SNIPPET 7 **/
 async function customButtonsOnDashboard(){
 
      if(typeof snippets!="undefined" && typeof snippets.customButtonsOnDashboard!="undefined" && snippets.customButtonsOnDashboard.status){
           var config = snippets.customButtonsOnDashboard.menus;
 
 
           try{
                if(document.querySelectorAll("#nav-links").length==0) await wait("#nav-links", 1000);
                
                
                
                jQuery("body").on('DOMSubtreeModified', ".hl_dashboard", async function () {
                     
                     jQuery("#nav-links").find("a").each(function(){
                          var title = $(this).text();
                          title = title.replace(" ", "-");
                          $(this).addClass(title.toLowerCase());
                     });
                
                
                     if(document.querySelectorAll(".hl_dashboard").length==0) await wait(".hl_dashboard", 1000);
                     
                     
                     if(jQuery(".custom-button-dashboard").length==0 && config!=undefined){
                          config.forEach(function(menu){
                               var target = menu.target;
                               if(target.indexOf(" ")!=-1) target = target.replace(" ", "-");
                               target = target.toLowerCase();
                               var buttonElem = jQuery(`<button style="margin-left: 20px" class="btn btn-success custom-button-dashboard" data-target='${target}'>${menu.title}</button>`);
                               buttonElem.click(function(){
                                    var target = jQuery(this).data("target");
                                    jQuery("#nav-links").find(`.${target}`)[0].click();
                               });
                               jQuery(".hl_wrapper--inner.hl_dashboard").prepend(buttonElem);
                          });
                               
                     }
                          
                });
           }catch(err){
                
           }
      }
 
      
 }