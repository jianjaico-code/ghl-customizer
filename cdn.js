var styles = [
    'https://msg.everypages.com/custom-settings/v4/css/jquery.modal.css', 
    'https://kit-free.fontawesome.com/releases/latest/css/free-v4-shims.min.css',
    'https://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css'
];

var scripts = [
    {name: 'jquery', src:'https://code.jquery.com/jquery-3.5.0.slim.js'},
    {name: 'datatable', src:'https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js'},
    {name: 'modal', src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js'}
];
var v; // global container for vue element


if(typeof config == "undefined" && typeof menuconfig != "undefined"){
    var config = [];

    var finalObject = {
        name: menuconfig[0].name,
        id: menuconfig[0].id,
        menus: menuconfig[0].menus,
        userSettings: null,
        isTab: null,
        customButtons: null,
        checkIn: snippets.checkIn,
        dashboardCustomizer: snippets,
        shortcut: snippets.shortcut
    }

    config.push(finalObject);
    //console.log(config);
}

ready(function() {
    v = document.getElementById('app').__vue__;
    addStyles(styles, function(){
        addScript(scripts).then(function(){
            locationMenu();
            dynamicLocationChange();
            checkInButton();
            shortcut();
            locationLogoInit();
            userSettings();
            dashboardCustomizer();
        });

        v = document.getElementById('app').__vue__;

        v.$router.afterEach((to, from) => {
            // console.log('v router change');
            logoClick(locationDefault);
            console.log('router -afterEach');
            locationMenu();
            shortcut();
            generateExpirationCookie();
        });
    });
});


function generateExpirationCookie(){
    var dateNow = new Date();
    var keyword = "expiration";

    dateNow.setDate(dateNow.getDate() + 14);

    if(getCookie(keyword).length <= 0) document.cookie = `${keyword}= ${dateNow.toLocaleDateString()}; expires=${dateNow.toUTCString()}`;
}


function dynamicLocationChange(){
    var className = null;
    // jQuery("body").on('DOMSubtreeModified', "#app .hl_header", function () {
    markLocation();

    v.$router.afterEach((to, from) => {
        console.log('dynamicLocationChage() v router afterEach');
        markLocation();
        wait_prop('#app',10000).then(function() {
            console.log('waiting until vue is loaded');
            window.setTimeout(markLocation(),100);
        });
    });
}

function markLocation() 
{
            // var location_id = getLocationId(); 
        // if(className!=null) jQuery("body").removeClass(className);

        // jQuery("body").addClass(location_id);
        // className = location_id;
     //  function markLocation(pn='') {   
     pn = window.location.pathname;
     var root = document.getElementsByTagName('body')[0];
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
        var root = document.getElementsByTagName('body')[0];
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
                  menuFix(locationDefault);
                  disabledMenuShrink(locationDefault);
                 v = document.getElementById('app').__vue__;
                 if (v && v.user) {
                    // console.log('if admin or user?');
                    user = (v.user.isAdmin) ? 'admin' : 'user' 
                    usertype = v.user.type;
                    if (!root.classList.contains(user)){
                    root.classList.add(user);
                    }
                    if (!root.classList.contains(usertype)){
                    root.classList.add(usertype);
                    }

                 }
    
             }).catch(function() {
             });
        }
     } else 
     {
      // in the admin area 
        // console.log('removing all location classes and restarting');
        root.classList='';
        root.classList.add('accounts');
     }
}





/******************************
 ******************************
 ***** CHECKIN BUTTON
 ******************************/
function shortcut(){
    
    var selected = null;

    jQuery("body").on("DOMSubtreeModified", "#app .hl_dashboard", async function(){
        var id = getLocationId();

        var schema = null;
        var locationDefault = null;
        var isSet = false;
        config.forEach(function(location){ 
            if(location.id=="all-location" && !!location.shortcut) 
                locationDefault = location;
            
        });

        config.forEach(function(location){
            if(location.id==id){
                isSet = true;

                if(!!location.shortcut) schema = location;
            }

            
        });
        

        if(schema==null && isSet==false) schema = locationDefault;

        if(!!schema &&  selected!=schema.id){
            selected = schema.id;
            
            var isInjected = false;
            jQuery(".mkt-button").each(function(){
                if($(this).data("id")==id) isInjected = true;
            });

            if(!isInjected) insertShortcutButton(schema.shortcut, id);
        }
    });
}


function insertShortcutButton(shortcut, id){
    console.log("Running Shortcut Button");
    jQuery(".mkt-button").each(function(){
        $(this).remove();
    });

    var temp = [];
    shortcut.forEach(function(buttons){

        var bgcolor = buttons.color;
        if(bgcolor.indexOf("#")==-1) bgcolor = `#${bgcolor}`;

        var elem = jQuery(`<button class="btn btn-success mkt-button" data-id="${id}" style="background: ${bgcolor}">${buttons.name}</button>`);
        
        
        if(buttons.type=="target"){
            jQuery("#nav-links").find("a").each(function(){
                var title = $(this).text().replace(" ", "-");
                $(this).addClass(title.toLowerCase());
            });

            elem.click(function(){
                jQuery("#nav-links").find(`.${buttons.target}`)[0].click();
            });
        }
        else{
             
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
                  jQuery("#nav-links").find(".router-link-exact-active").click(function(){
                        v.$router.push(`/location/${getLocationId()}/d`);
                        setTimeout(function(){
                            v.$router.push(`/location/${getLocationId()}/dashboard`);
                        }, 1);
                    });
                   elem.click(function(){
                        displayIframe("shortcut", buttons.iframe.title, buttons.iframe.description, buttons.target);
                   });
                  }
             }
        }

        temp.push(elem);
    });


    for(var i=temp.length; i>=0; i--) $('.hl_wrapper--inner.hl_dashboard').prepend(temp[i]);
    
    $('.mkt-button').css('margin-left','20px');
    $('.mkt-button').css('margin-bottom','10px');
}
/****************************************/
/****************************************/
/****************************************/
/****************************************/



/******************************
 ******************************
 ***** CHECKIN BUTTON
 ******************************/
function checkInButton(){
    // called only once, but we should still check that the style has not been injected yet.
    if ($('#checkin_css').length<=0)
    {
    config.forEach(function(location){
        var elemCSS = document.createElement("style");
        elemCSS.id = 'checkin_css';
        var addon = '';
        if(location.id!="all-location") addon = `.${location.id} `;


        // HIDE BUTTON
        var hideButton = '';
        if(!!location.checkIn && location.checkIn.hideButton)
            hideButton = `${addon} #navbar-collapse .hl_navbar--button { display: none; }`;
        


        // COLOR
        var color = '';
        if(!!location.checkIn && !!location.checkIn.color){
            var bgcolor = location.checkIn.color;
            if(bgcolor.indexOf("#")==-1) bgcolor = `#${bgcolor}`;

            color = `${addon} #navbar-collapse .hl_navbar--button {
                background:${bgcolor};
                line-height:24px;
                position: relative;
                text-indent:-9999px;
            }`
        }


        // TEXT
        var text = '';
        if(!!location.checkIn && !!location.checkIn.text){
            text  = `
               ${addon} #navbar-collapse .hl_navbar--button{
                    color: #ffffff00 !important;
                    -webkit-touch-callout: none; /* iOS Safari */
                         -webkit-user-select: none; /* Safari */
                         -khtml-user-select: none; /* Konqueror HTML */
                         -moz-user-select: none; /* Old versions of Firefox */
                              -ms-user-select: none; /* Internet Explorer/Edge */
                              user-select: none; /* Non-prefixed version, currently
                                                       supported by Chrome, Edge, Opera and Firefox */
               }
               ${addon} #navbar #navbar-collapse .hl_navbar--button:after {
                    content: "${location.checkIn.text}";
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
                    text-indent:0px;
                }
               @media screen and (max-width: 1199px) and (min-width: 768px) { 
                    ${addon} #navbar #navbar-collapse .hl_navbar--button:after {
                        content:"";
                    }
               }`
        }


        // TYPES
        var types = '';
        if(!!location.checkIn && !!location.checkIn.target){
            types = `
               /* Change the Text on the Pop Up Check In Box */ 
               ${addon} #client-checkin--modalLabel {
                    color: #ffffff00 !important;
                    -webkit-touch-callout: none; /* iOS Safari */
                    -webkit-user-select: none; /* Safari */
                    -khtml-user-select: none; /* Konqueror HTML */
                    -moz-user-select: none; /* Old versions of Firefox */
                    -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Non-prefixed version, currently
                                   supported by Chrome, Edge, Opera and Firefox */ 
               }
               
               
               ${addon} #client-checkin--modalLabel:after {
                    content: "${location.checkIn.target}";
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

               


               ${addon} #client-checkin--modalLabel i{
                    font-size:16px !important;   
               }
              `
        }
        elemCSS.innerHTML = `${hideButton} ${color} ${text} ${types}`;
        document.getElementsByTagName("head")[0].appendChild(elemCSS);
    });
    }

    jQuery("body").on("DOMSubtreeModified", ".hl_header:not('.checkin')", async function(e){
        jQuery('.hl_header').addClass('checkin');  // only run this once.
        var locationDefault = null;
        config.forEach(function(location){ 
            if(location.id=="all-location" && !!location.checkIn){
                locationDefault = location.checkIn;
            }
        });

        config.forEach(function(location){

            var schema = null;
            if(!!location.checkIn && Object.keys(location.checkIn).length>0) schema = location.checkIn;
            else schema = locationDefault;

            console.log(schema);
            if(!!schema && !!schema.type){

                
                if(schema.type!='default' && jQuery(".target-source").length==0){
                    var elem = jQuery(".hl_navbar--button").html();
                    elem = jQuery(`<div class="hl_navbar--button btn btn-success btn-block target-source">${elem}</div>`);
                   jQuery(".hl_navbar--button").remove();

                   var pn = window.location.pathname;
                   if(pn.match(/location\/(\w*)\/.*/)!=null) jQuery("#navbar-collapse").prepend(elem);
                }



                // TARGET
                if(schema.type=='target' && !!schema.target){
                    jQuery("#nav-links").find("a").each(function(){
                        var title = $(this).text().replace(" ", "-");
                        $(this).addClass(title.toLowerCase());
                    });

                    if(jQuery(".target-source").length!=0){
                        var target = schema.target;
                        if(target.indexOf(" ")!=-1) target = target.replace(" ", "-");
                        target = target.toLowerCase();
                        
                        jQuery(".target-source").attr("data-link", target);
                        jQuery(".target-source").click(function(e){
                             e.preventDefault();
                             e.stopPropagation();
                             var target = $(this).attr("data-link");
                             jQuery("#nav-links").find(`.${target}`)[0].click();
                        });
                   }
                }


                // LINK
                if(schema.type=='link' && !!schema.target){


                    // IFRAME
                    if(!!schema.isIframe && schema.isIframe){
                        console.log(schema.iframe);

                        if(schema && schema.iframe && schema.iframe.isModal){
                                   
                            jQuery(".target-source").attr({
                                 "data-toggle": "modal",
                                 "data-target": "#mktModal",
                                 "title": schema.iframe.title,
                                 "description": schema.iframe.description,
                                 "target": schema.target
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
                            jQuery(".target-source").unbind('click'); // otherwise it opens 10+ windows.
                            jQuery(".target-source").click(function(){
                                 displayIframe("checkIn", schema.iframe.title, schema.iframe.description, schema.target);
                            });
                       }



                    }else {
                        console.log('unbinding');
                        jQuery('.target-source').unbind('click');
                        console.log('binding click');
                        jQuery(".target-source").click(function(){
                            window.open(schema.target, "_blank");
                        });
         
                    }
                }
            }
        });
    });
   
}
/****************************************/
/****************************************/
/****************************************/
/****************************************/





/******************************
 ******************************
 ***** LOCATION LOGO
 ******************************/
async function locationLogoInit(){
    // needs the check for if it's set.
    // but this code is tested do not change.
    var index = config.findIndex(val => val.id == 'all-location');
    if(typeof config[index].locationLogo != "undefined" && config[index].locationLogo){
        $("body").on('DOMSubtreeModified', ".hl_wrapper", function () {
            if (document.querySelectorAll('.hl_navbar--logo').length>0 && document.querySelectorAll('.hl_wrapper').length>0) {

                hl = document.querySelector('.hl_wrapper').__vue__;      
                if (hl && hl.location && hl.location._data)
                {
                logo_url='';
                locationCookie = '';
                    if (hl.location._data.logo_url) {
                        logo_url = hl.location._data.logo_url;          
                    } else {
                        if (v.company && v.company.logoURL) logo_url = v.company.logoURL;
                    }
                    if (logo_url.length>0 && document.querySelector('.hl_navbar--logo img').src!=logo_url)
                    {
                        locationCookie = document.cookie = `${v.$route.params.location_id}=${logo_url}; path='/${v.$route.params.location_id}'` ;
                        document.querySelector('.hl_navbar--logo img').src=logo_url;
                    }
                }
                else{
                    if(typeof v.$route.params.location_id != 'undefined') document.querySelector('.hl_navbar--logo img').src= getCookie(v.$route.params.location_id);
                }
            }
        });
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
/****************************************/
/****************************************/
/****************************************/
/****************************************/



/******************************
 ******************************
 ***** USER SETTINGS
 ******************************/
function userSettings(){

       
    config.forEach(function(location){
        if(!!location.userSettings){
            
            var addon = "";
            if(location.id!="all-location") addon = `.${location.id} `;
            var style = `${addon}.user .hl_settings--header li.settings-team {display: none; }`;
            Object.keys(location.userSettings).forEach(function(key){

                    if(!location.userSettings[key]){
                        style += `${addon}.user .hl_settings--header li.settings-${key}{
                            display: none;
                        }`
                    }
            });

            jQuery("head").append(`<style class="toolkitstyles usersettings">${style}</style>`);

            $("body").on('DOMSubtreeModified', ".hl_wrapper", function () {
                    $('.hl_settings--nav').find("li").each(function(){
                        var paths = $(this).find("a").attr("href").split("/");
                        var setting = paths[paths.length-1];
                        $(this).addClass(`settings-${setting}`);
                    });
            });
        }    
    
    });
}
/****************************************/
/****************************************/
/****************************************/
/****************************************/






/******************************
 ******************************
 ***** DASHBOARD CUSTOMIZER
 ******************************/
var locationDefault = null;

function dashboardCustomizer(){

    //jQuery("body").on("DOMSubtreeModified", ".hl_header", async function(){
        v = document.getElementById('app').__vue__;
        pn = window.location.pathname;

        var schema = null;
        config.forEach(function(location){ 
            if(location.id=="all-location" && !!location.dashboardCustomizer)
                locationDefault = location.dashboardCustomizer;
        });


        config.forEach(function(location){
            if(location.id==getLocationId() && !!location.dashboardCustomizer) schema = location.dashboardCustomizer;
            else schema = locationDefault;
        });


        contactDetailsShortcut(schema);
        menuFix(schema);
        disabledMenuShrink(schema);
        saveButtonFix(schema);
        addFavicon(schema);
        updateTitleTag(schema);
        logoClick(schema);
        campaignToggle(schema);
        triggerToggle(schema);
        messageActions(schema);
        opportunityTags(schema);
        driveLink(schema);
        opportunityDate(schema);
        twilioWarning(schema);
        conversationFilter(schema);
        deleteContact(schema);


        injectDataTableCSS();
        if(pn.indexOf("custom_values")!=-1) customDatatables(schema, 'customValues');
        if(pn.indexOf("custom_fields")!=-1) customDatatables(schema, 'customFields');

        v.$router.afterEach((to, from) => {
            injectDataTableCSS();
            if(to.path.indexOf("custom_values")!=-1) customDatatables(schema, 'customValues');
            if(to.path.indexOf("custom_fields")!=-1) customDatatables(schema, 'customFields');
        });



        function injectDataTableCSS(){
             // CHECK FOR CSS
             if($("#datatableStyle").length==0){
                $("head").append(`<style id='datatableStyle'>dataTables_wrapper  {
                    padding:5px;
                }
                .dataTables_wrapper label {
                font-size:14px;
                }
                table.dataTable, table.dataTable thead th {
                    border-bottom-color:rgba(186,186,186,0) !important;
                }
                .dataTables_filter {
                text-indent:7px;
                    float:left !important;
                    margin-left:20px;
                    text-align:left !important;
                }
                .dataTables_length{
                    float:right !important;
                }
                .dataTables_length select{
                    border:1px #ccc solid;
                }
                .dataTables_length label {
                    font-size:14px !important;
                padding:10px;
                }
                .dataTables_wrapper input[type=search] {
                    display:block;
                
                    border-radius:5px;
                    border:1px #ccc solid;
                    padding:3px;
                    width:300px;
                 }</style>`);
            }
        }
   // });
}


function contactDetailsShortcut(schema){
    if(!!schema && !!schema.contactDetailsShortcut && jQuery(".hl_opportunities").length)
    { 
        $("body").on("click", function(event) {
            if ($('#add-opportunities-modal .modal-title .icon-edit').length>0)
            {
                if (event.target.classList.contains('modal-title'))
                {
                   if ($('#tab1').length>0)
                   {
                       contact_id = document.querySelector('#tab1').__vue__.contact.id;
                       location_id = v.$route.params.location_id;
                       $('.close').click();
                       v.$router.push('/location/'+location_id+'/customers/detail/'+contact_id);
                   }
                }  
            }
        });
    }         
}

function customDatatables(schema, type){
    if(schema && schema.customDatatables){
        $('head').append('<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css">');
        
        $(document).ready( function () {
            var counter = 0;
            var timer = setInterval(() => {  
                hl_settings = document.querySelector('.hl_settings--body'); 
                if(hl_settings && hl_settings.__vue__ && hl_settings.__vue__._data[type]){
                    if (hl_settings.__vue__._data[type].length>0)
                    {
                        // console.log(hl_settings.__vue__._data[type]);
                        if (!!window.jQuery)
                        {
                            $('table.table').DataTable();
                        // console.log("Datatable Run")
                        clearInterval(timer);
                        }
                    }
                }

                counter ++;

                if(counter >= 20) clearInterval(timer);
            }, 500);
            
        } );


    }
}


function twilioWarning(schema){
    if(schema && schema.twillioWarning){
        if ($('#hide_twilio_css').length<=0){
            jQuery('head').append('<style id="hide_twilio_css">.user body.with-alert #app { padding-top:0px; },.user .hl_alert_twilio {display:none; }</style>');
        }
    }
}


function menuFix(schema){
    if(!!schema && !!schema.menuFix && schema.menuFix){
        // console.log('menufix');
        document.querySelectorAll("ul#nav-links>li>a").forEach(function(e){
            e.addEventListener("click", function(el){
                document.querySelectorAll("#nav-links a[aria-expanded='true']").forEach(function(ev){
                    if(ev!==el.target) ev.click();
                });
            });
        });
    }
}

function disabledMenuShrink(schema){
    if(!!schema && !!schema.disabledMenuShrink && schema.disabledMenuShrink){
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

function saveButtonFix(schema){
    if(!!schema && !!schema.disabledMenuShrink && schema.disabledMenuShrink){
        if (document.querySelectorAll('#saveButtonCSS').length<=0)
        {
            var s=document.createElement("style")
            s.id='saveButtonCSS';
            s.innerHTML='#prospect.unsaved .form-footer.save{position:absolute !important;top:1px !important;right:0px !important;z-index: 999999;padding-top:10px;  padding-right:20px;}#prospect.unsaved {    padding-top:50px !important;}';
            document.getElementsByTagName("head")[0].appendChild(s);
        }

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

function addFavicon(schema){
    if(!!schema && !!schema.addFavicon && schema.addFavicon.status){
        document.querySelector("link[rel=icon]").href = schema.addFavicon.link;
    }
}

function updateTitleTag(schema){
  v.$router.afterEach((to, from) => {
    if (to && v.company)
    {
        title = to.name + ' | ' + v.company.name;
        title = title.replace(/_/g,' ');
        title = title.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() }); //titleCase
        document.title=title;
    }
  });
  // also on page load 
  if (v.$route && v.$route.name && v.company && v.company.name) 
  {
    title = v.$route.name + ' | ' + v.company.name;
    title = title.replace(/_/g,' ');
    title = title.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() }); //titleCase
    document.title=title;
  }

}

function logoClick(schema){
                // console.log('logoClick()');
    if(!!schema && !!schema.logoClick){
        if(jQuery("#logo_click_style").length==0) 
               // console.log('click init');
            jQuery('head').append('<style id="logo_click_style">.hl_navbar--logo { cursor:pointer; }</style>');

            wait('.hl_navbar--logo',10000).then(function() {
                jQuery('.hl_navbar--logo').click(function() { 
                    console.log('Clicked! - Logo');
                    v = document.getElementById('app').__vue__;
                    if (v.$route.params.location_id)
                    {
                        v.$router.push('/location/'+v.$route.params.location_id+'/');
                    } else 
                    {
                        // agency 
                        v.$router.push('/accounts/');
                    }
                });
             }).catch(function() {
                console.log('logo did not load - could not hook');
             });

    }
}

function campaignToggle(schema){
    if(!!schema && schema.campaignToggle){
        // console.log('snippets.campaignToggle');
        if (jQuery('#campaignstyles').length<=0)
        {
            style = `.py-2:not(.folder-open) button.mktk {
            opacity:50%;
            pointer-events: none;
            } .mktk-draft>div:first-child a::before,.mktk-published>div:first-child a::before{height:10px;width:10px;margin-top:4px;margin-left:-5px;margin-right:6px;background-color:#37ca37;border-radius:50%;display:inline-block;content:' '}.mktk-draft>div:first-child a::before{background-color:#929292}`;
            jQuery('head').append('<style class="toolkitstyles" id="campaignstyles">'+style+'</style>');
        }
        jQuery("body").on('DOMSubtreeModified', ".hl_customer-acquisition--table", async function()
        {
            pn = window.location.href;
            if (pn.indexOf('marketing/acquisition')>0)
            {
            // add green / grey circle next to campaigns
            document.querySelectorAll('.hl_customer-acquisition--table .w-100').forEach(function(me) { 
                if (me.__vue__ && me.__vue__.campaign )
                {
                    me.classList.add('mktk-'+me.__vue__.campaign.status);
                }
            });
            // add buttons to folders
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
            publish.classList = 'btn btn-light4 mktk';  
            publish.style="margin-right:10px;padding:5px;font-size:.8125rem;";

            publish.addEventListener("click", function(e) 
                {
                //e.target.parentNode.parentNode.firstElementChild.firstElementChild.classList.contains('show-active');
                campaigns = e.target.parentNode.parentNode.nextSibling.childNodes;
                campaigns.forEach(function(campaign) {
                    campaign.classList.remove('mktk-draft');
                    campaign.classList.add('mktk-published');
                    campaign.__vue__.campaign.status='published';
                });
                });

            draft = document.createElement('button');
            draft.innerText='Draft';
            draft.classList = 'btn btn-light4 mktk';    
            draft.style="margin-right:10px;padding:5px;font-size:.8125rem;";

            draft.addEventListener("click", function(e) 
                {
                campaigns = e.target.parentNode.parentNode.nextSibling.childNodes;
                campaigns.forEach(function(campaign) {
                    campaign.classList.remove('mktk-published');
                    campaign.classList.add('mktk-draft');                    
                    campaign.__vue__.campaign.status='draft';
                });
                });
                if (me && me.parentNode && me.parentNode.nextSibling)
                {
                    me.parentNode.nextSibling.append(draft);
                    me.parentNode.nextSibling.append(publish);                    
                }

            });
            } // if on the right page
        });


    }
}

function triggerToggle(schema){
    if(!!schema && !!schema.triggerToggle){

        if (jQuery('#triggerstyles').length<=0)
        {
            style = `.trigger_actions {position:absolute;margin-top:-20px;}.active-true .dropdown button{background:#37ca37!important;color:#fff}.active-true .triggers_name::before,.active-false .triggers_name::before{height:10px;width:10px;margin-top:4px;margin-left:-5px;margin-right:6px;background-color:#37ca37;border-radius:50%;display:inline-block;content:' '}.active-false .triggers_name::before{background-color:#929292}`;
            jQuery('head').append('<style class="toolkitstyles" id="triggerstyles">'+style+'</style>');
        }        

        v = document.getElementById('app').__vue__;
        jQuery("body").on('DOMSubtreeModified', ".hl_triggers--item", async function(){
            // add green / grey circle on change of draft to published.
                $(this).removeClass('active-true');
                $(this).removeClass('active-false');
                $(this).addClass('active-'+ this.__vue__.trigger._data.active); 
        });

        jQuery("body").on('DOMSubtreeModified', ".hl_triggers--wrap", async function(){

            /* Add Class to mark Active/Draft */
            // document.querySelectorAll('.hl_triggers--item:not(.active-true,.active-false)').forEach(function(me) { me.classList.add('active-'+me.__vue__.trigger._data.active); });
            // add green / grey circle
            $('.hl_triggers--item:not(.active-true,.active-false)').each(function() { $(this).addClass('active-'+ this.__vue__.trigger._data.active); });

           

            /* Add Buttons to Turn on with Folders */
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

function messageActions(schema){
    /* shows open, delivered & clicks on mail items */
    if(!!schema && !!schema.messageActions){
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

function opportunityTags(schema){
  
    if(!!schema && !!schema.opportunityTags){
    
       jQuery("body").on('DOMSubtreeModified', ".hl_opportunities", async function(){

            // restrict to opportunities page
            if (pn.split('/')[pn.split('/').length-1]!='opportunities')
                return;

            // add classes
            $('.tag').each(
                 function() {
                // console.log('tag each');
                      p = $(this).closest('.card-body');
                      tag = $(this).text();
                      if (tag=='group') tag='group2';
                      if (!p.hasClass('tag-'+tag)) 
                      {
                           p.addClass('tag-'+tag);
                      } 
                 });
            // remove classes
            $('.card-body').each(
                 function() {
                    // console.log('card-body each');
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

function driveLink(schema){
    var input, stop;
     stop=false;
     if(!!schema && !!schema.driveLink){
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
     }


     function display(links){
          stop=true;
          if ($(input).hasClass('gdrive')) return;
          $(input).addClass('gdrive');
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
            return `<style class="toolkitstyles" id="gdrivestyles">
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
function toDateTime(secs) 
{
    // used on opportunityDate();
     var t = new Date(1970, 0, 1); // Epoch
     t.setSeconds(secs);
     return t;
}
function opportunityDate(schema)
{

    if(!!schema && !!schema.opportunityDate)
    {
        if ($('#opdatecss').length<=0)
        {
            style = `i.fa-calendar-plus-o{float:right;text-align:right}i.fa-calendar-plus-o span.opdate{display:block}`;
            $('head').append('<style class="toolkitstyles" id=opdatecss>'+style+'</style'); 
        }

     jQuery("body").on('DOMSubtreeModified', ".hl_opportunities", async function(){
            // console.log(e)
            pn = window.location.pathname;
            if (pn.split('/')[pn.split('/').length-1]=='opportunities')
            {
                // opportunity page
                 document.querySelectorAll('.hl_opportunities-item:not(.hasdate)').forEach(function(op) 
                 {
                     op.classList.add('hasdate');
                     opdate = toDateTime(op.__vue__.opportunity._data.date_added.seconds);
                     opdate = opdate.toDateString();
                     opdate = opdate.substring(4,opdate.length);

                     if ($(op).find('span.opdate').length==0){
                          $(op).find('i.fa-calendar-plus-o').append('<span class="opdate">'+opdate+'</span>');
                     }
                });
            }
        });
    }
}
function conversationFilter(schema){
    if(!!schema && !!schema.conversationFilter){
        v = document.getElementById('app').__vue__;
        function userDropdown() 
        {
            if ($('.select-user').length<=0)
            {   
                var select_users = document.createElement("SELECT");
                // console.log(window.users.length);
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
                if (mlsearch)
                    mlsearch.after(div_select);
            
            if ($('#messagefilterstyles').length<=0) //fix to show the load more...
            $('head').append('<style class="toolkitstyles" id="messagefilterstyles"> .messages-list { height: calc(100vh - 320px);}</style>');

            }
        }

        function filterConversations(userid) {
            style='.messages-list--item,.messages-list li { display:block; }';
            if (userid!='all')
                style='.messages-list--item { display:none; } .messages-list--item:not([user_id]), .messages-list--item[user_id='+userid+'] { display:block;}';
            
            style=style+' .messages-list { height: calc(100vh - 320px);}';

            if ($('#messagefilterstyles').length<=0)
            {
                $('head').append('<style class="toolkitstyles" id="messagefilterstyles">'+style+'</style>');
            } else 
            {
                $('#messagefilterstyles').html(style);
            }
            markUsers();
        }
        function markUsers() {
            document.querySelectorAll('.messages-list--item:not([user_id])').forEach(function(t) {
                //console.log('.messages-list--item:not([user_id])');
                if (t.__vue__._self.$parent.$options && t.__vue__._self.$parent.$options.propsData)
                {
                    props = t.__vue__._self.$parent.$options.propsData;
                    assigned_to=props.conversation.assigned_to
                    t.setAttribute('user_id',assigned_to);
                }
            });
        }
        jQuery("body").on('DOMSubtreeModified', ".messages-list", async function(){
            markUsers();
        });

        jQuery("body").on('DOMSubtreeModified', ".message-body--conversation", async function(){
            if (!window.users)
            {
                    window.loading_users=true;
                    // console.log('loading users');
                    css = '.messages-list-search{margin-top:-20px;z-index:6;position:relative}.select-user{margin-top:-10px;z-index:7;position:relative;margin-bottom:20px;font-size:12px;text-align:center;font-weight:700}.select-user select{display:block;margin:auto;padding:3px;border:1px #ccc solid;border-radius:5px}';
                    if (!document.querySelector('#conversation_user_dropdown'))
                        jQuery("head").append(`<style class="toolkitstyles" id="conversation_user_dropdown">${css}</style>`);

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
                if (!window.loading_users)
                {
                    userDropdown();
                }
            } 
        });
    }
}

function deleteContact(schema)
{
    if(!!schema && !!schema.deleteContact)
    {
 $("body").on('DOMSubtreeModified', "#prospect,.message-body--aside", function () {
    
     if (document.querySelectorAll('#deleteButton').length<=0)
    {
        deleteButton = document.createElement('button');
        deleteButton.id = 'deleteButton';
        deleteButton.innerText = 'Delete Contact';
        deleteButton.classList='btn btn-light2 btn-xs';

        $(deleteButton).click(function() {
            if (confirm('This will delete the contact & the conversation. Are you sure?'))
            {
                if (document.querySelectorAll('#prospect').length>0) 
                {
                    //contact page 
                    conversation = document.querySelector('.message-body--conversation').__vue__.conversation;    
                    contact = document.querySelector('.hl_wrapper').parentElement.__vue__.contact; 
                    if (contact && contact.opportunities)
                    {
                        contact.opportunities.forEach(function(me) { 
    //                         delete opportunities;
                                v.$db.collection("opportunities").doc(me.id).delete();
                         });                        
                    }
                    if (conversation)
                    {
                        conversation.delete().then(function() {
                            contact.deleteHipaaContact().then(function() {
                                 window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500); 
                            });
                        });                   
                    } else {
                        if (contact)
                        {
                            contact.deleteHipaaContact().then(function() {
                                 window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500); 
                            });
                        }                        
                    }
                }
                if (document.querySelectorAll('.hl_contact-details-center').length>0)
                {
                    contact_details = document.querySelector('.hl_contact-details-center').__vue__;
                    if (contact_details && contact_details.opportunities)
                    {
                        contact_details.opportunities.forEach(function(me){
                             v.$db.collection("opportunities").doc(me.id).delete();
                        });
                    }

                    if (contact_details.conversation)
                    {
                        contact_details.conversation.delete().then(function() {
                            contact.deleteHipaaContact();
                            window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500); 
                        });
                    } else
                    {
                        contact.deleteHipaaContact();
                        window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500); 
                    }
                    
                }
                if (document.querySelectorAll('.aside-texts-infos').length>0) 
                {
                    //conversation page
                    contact_details = document.querySelector('.message-body--aside .avatar').__vue__;
                    if (contact_details && contact_details.opportunities)
                    {
                        contact_details.opportunities.forEach(function(me){
                             v.$db.collection("opportunities").doc(me.id).delete();
                        });
                    }

                    conversation = document.querySelector('.hl_wrapper').parentElement.__vue__.conversation; 
                    contact = document.querySelector('.message-body--aside .avatar').__vue__.contact;
                    
                    if (conversation)
                    {         
                        conversation.delete().then(function() 
    //                     v.$db.collection("conversations").doc("6hzRcFIziDYq6ZTp4lSY").delete().then(function() {
                        {
                            conversation.deleted=true;
                            contact = document.querySelector('.message-body--aside .avatar').__vue__.contact;
                            contact.delete().then(function() {
                                 $('.router-link-exact-active.messages-list--item').remove();
                                window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500);                            
                            });
                                            
                        }).catch(function(error) {
                            console.error("Error removing document: ", error);
                        });
                    } else 
                    {
                        if (contact)
                        {
                            contact.deleteHipaaContact().then(function() {
                                window.setTimeout(function() {  v.$router.push('/'); v.$router.go('-1'); }, 500);                            
                            });
                        }
                    }

                 
                }

            }
        });
        
        if (document.querySelectorAll('#prospect').length>0) //contact
            document.querySelector('#prospect').append(deleteButton);

        if (document.querySelectorAll('.aside-texts-infos').length>0) // conversation
        {

                
            document.querySelector('.aside-texts-infos').append(deleteButton);
           
        }

    }
});

    }
}

/****************************************/
/****************************************/
/****************************************/
/****************************************/





/******************************
 ******************************
 ***** LOCATION-BASED MENUS
 ******************************/
async function locationMenu(){
    if(jQuery("#nav-links").length==0) await wait("#nav-links", 100000);
    
    
    injectMenu();
    jQuery("body").on('DOMSubtreeModified', "#app .hl_header", function () {

        injectMenu();
    });
        
}


function injectMenu(){
    var url = window.location.pathname.split("/");
    var locationid = null;
    if(url.length>=3) locationid = url[2];

    try{
                
        if(typeof config=="object"){
            // console.log(config);
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
                        
                        v.$router.push(`/location/${locationid}/d`);
                        setTimeout(function(){
                            v.$router.push(`/location/${locationid}/dashboard`);
                        }, 1);                        
                        $(this).addClass("active");
                    }
            });


            config.forEach(function(location){
                location.menus.forEach(function(menu){
                    if(typeof v.$router.history.current.params.location_id == 'undefined' && location.id == 'agency-dashboard'){
                        if(menu.type=="multi" && typeof menu.child=="object"){
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
    
    
                            var element = `<a data-toggle="collapse" role="button" aria-expanded="false" id="nav-${location.id}-${menu.id}" aria-controls="nav-${location.id}-${menu.id}" class="collapsed">
                                                <i ${customAttr}></i>
                                                <span>${menu.name}</span>
                                                <i class="caret icon-arrow-down-1"></i>
                                            </a>
                                            <div id="nav-${location.id}-${menu.id}" class="nav-marketing-links collapse">
                                                <ul></ul>
                                            </div>
                                            
                                            `	;
    
                            var src = document.createElement("li");
                            src.setAttribute("class", `mkt-menu-list menu-${location.id}-${menu.id}`);
    
                            src.innerHTML = element;

                            menu.child.forEach(function(child){
                                var s = optionLink(child, location, false);
                                src.getElementsByTagName("ul")[0].appendChild(s);
                            });
    
            
                            if(location.id=="agency-dashboard" ){
                                if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length==0){
                                    
                                    if(typeof menu.location!='undefined' && menu.location!="bottom"){
                                            if(menu.location=="top") document.querySelector('#nav-links').prepend(src);
                                            else {
                                                if(typeof menu.locationTarget!='undefined'){
                                                    $(`#nav-${menu.locationTarget}`).after(src);
                                                }
                                                else document.querySelector('#nav-links').prepend(src);
                                            } 
                                    }else {
                                        document.querySelector('#nav-links').appendChild(src);
                                    }
                                }
                                
                            }else{
                                if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length!=0){
                                    document.querySelectorAll(`.menu-${location.id}-${menu.id}`).forEach(e => e.parentNode.removeChild(e));
                                }
                            } 
    
    
    
                            $(src).click(function(){
                                var t = $(this).find("a").attr("aria-expanded");
                                if(t=="true") t = false;
                                else t = true;
    
                                $(this).find("a").attr("aria-expanded", t);
                                $(this).find(".nav-marketing-links").toggle("show")
    
                            });

    
                        }else{
                            
                            var src = optionLink(menu, location);
                            if(location.id=="agency-dashboard" ){
                                if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length==0){
                                    if(typeof menu.location!='undefined' && menu.location!="bottom"){
                                            if(menu.location=="top") document.querySelector('#nav-links').prepend(src);
                                            else {
                                                if(typeof menu.locationTarget!='undefined'){
                                                    $(`#nav-${menu.locationTarget}`).after(src);
                                                }
                                                else document.querySelector('#nav-links').prepend(src);
                                            } 
                                    }else {
                                        document.querySelector('#nav-links').appendChild(src);
                                    }
                                }
                                
                            }else{
                                if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length!=0){
                                    document.querySelectorAll(`.menu-${location.id}-${menu.id}`).forEach(e => e.parentNode.removeChild(e));
                                }
                            } 
                        }

                    }
                    else if(typeof v.$router.history.current.params.location_id != 'undefined' && location.id != 'agency-dashboard'){
                        if(menu.type=="multi" && typeof menu.child=="object"){
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
    
    
                            var element = `<a data-toggle="collapse" role="button" aria-expanded="false" id="nav-${location.id}-${menu.id}" aria-controls="nav-${location.id}-${menu.id}" class="collapsed">
                                                <i ${customAttr}></i>
                                                <span>${menu.name}</span>
                                                <i class="caret icon-arrow-down-1"></i>
                                            </a>
                                            <div id="nav-${location.id}-${menu.id}" class="nav-marketing-links collapse">
                                                <ul></ul>
                                            </div>
                                            
                                            `	;
    
                            var src = document.createElement("li");
                            src.setAttribute("class", `mkt-menu-list menu-${location.id}-${menu.id}`);
    
                            src.innerHTML = element;
    
    
                            menu.child.forEach(function(child){
                                var s = optionLink(child, location, false);
                                src.getElementsByTagName("ul")[0].appendChild(s);
                            });
    
    
    
                            
                            if(locationid==location.id || location.id=="all-location" ){
                                if(document.querySelectorAll(`.menu-${location.id}-${menu.id}`).length==0){
                                    console.log("There is no menu button like this");
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
    
    
    
                            $(src).click(function(){
                                var t = $(this).find("a").attr("aria-expanded");
                                if(t=="true") t = false;
                                else t = true;
    
                                $(this).find("a").attr("aria-expanded", t);
                                $(this).find(".nav-marketing-links").toggle("show")
    
                            });
    
    
                        }else{
                            
                            var src = optionLink(menu, location);
                            if(locationid==location.id || location.id=="all-location" ){
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
                        }
                    }
                });
            
                
            });	
        }
    }catch(err){
        console.log(err)
    }
}



function optionLink(menu, location, type=true){
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
    var element = `<a ${hrefLink} class="menucreator" >
                        <i ${customAttr}></i>
                        ${menu.name}
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
                $(this).addClass("router-link-exact-active");
            });
        }
    }

    src.innerHTML = element;
    return src;

    
}
/****************************************/
/****************************************/
/****************************************/
/****************************************/
 


function getCompanyId(){
    return new Promise((resolve, reject)=>{
         var checker = setInterval(()=>{
              v = document.getElementById("app").__vue__;
              if(typeof v.company!='undefined'){
                   clearInterval(checker);
                   resolve(v.company._id);
              }
         }, 100);
    });
}   

function getLocationId(){
    var url = window.location.pathname.split("/");
    var locationid = null;
    if(url.length>=3) locationid = url[2];

    return locationid;
}



function addStyles(styles, callback){
    styles.forEach(function(link){
        var styleElem = document.createElement("link");
        styleElem.rel = "stylesheet";
        styleElem.href = link;
        document.querySelector("head").appendChild(styleElem);
    });
    if (document.querySelectorAll('#fafix').length<=0){
        var css = `.fa.fa-compress:before { content:"\\f066" !important; } .fa.fa-expand:before {content: "\\f065"}`;
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.id = 'fafix';
        style.innerText = css;
        head.appendChild(style);
    }
    
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
          // console.log(src);
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
                    if(type=="datatable" && !!window.jQuery && !!window.jQuery().DataTable){
                        isExist = true;
                        // console.log("Datatable should run");
                    }
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

function wait_prop(selector,key='') {
    // waits until vue is loaded on property
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var start = performance.now();
    var now = 0;

    return new Promise(function (resolve, reject) {
    var interval = setInterval(function () {
         var element = document.querySelector(selector);

         if (key=='')
         {
             if (element && element.__vue__) {
                  clearInterval(interval);
                  resolve();
             }            
         } else 
             if (element && element.__vue__ && element.__vue__[key]) {
                  clearInterval(interval);
                  resolve();
             }            
         {

         }

         now = performance.now();

         if (now - start >= timeout) {
              reject("Could not find the element " + selector + " within " + timeout + " ms");
         }
    }, 10);
    });
}



function displayModal(id, title, description, link){
    if(description==null  || description=='null' || typeof description=='undefined') description= "";
    
         var elem = `
         <style class="toolkitstyles" id="toolkit_modal_css" type="text/css">#mktModal .modal-open .modal { overflow-y: hidden; } #mktModal .modal-dialog.modal-xl{height:90%;margin:1.5% auto;width: 95%;
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
    jQuery("#nav-links").find(".router-link-exact-active").click(function(){
        if(v.$route.name == 'dashboard'){
            console.log("1");
            v.$router.push(`/location/${getLocationId()}/d`);
            setTimeout(function(){
                console.log("2");
                v.$router.push(`/location/${getLocationId()}/dashboard`);
            }, 1);
        }
    });
     if(description==null || description=='null') description = "";
     document.querySelector(".hl_wrapper").innerHTML = `
        <style class="toolkitstyles" id="toolkit_iframe_css">
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
