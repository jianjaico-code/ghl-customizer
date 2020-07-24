<template>
      <div class="modal micromodal-slide" id="savedTemplates" aria-hidden="true">
            <div class="modal__overlay" tabindex="-1" data-micromodal-close>
                  <div class="modal__container" style="width: 27rem;" role="dialog" aria-modal="true" aria-labelledby="locationId-title">
                  <header class="modal__header">
                        <h2 class="modal__title" i><span class="fas fa-plus"></span>&nbsp;&nbsp;Load From Saved Templates</h2>
                        <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
                  </header>
                  <main class="modal__content" id="locationId-content">
                        <table>
                              <template v-for="(template, index) in templates">
                                    <tr>
                                          <td style="width: 46%">{{ template.date | trimDate }}</td>
                                          <td>{{ template.name }}</td>
                                          <td style="text-align: right;" @click="loadTemplate(template.code)"><span class="load-template">Load</span></td>
                                    </tr>
                              </template>
                        </table>
                  </main>
                  </div>
            </div>
      </div>
</template>

<script>
module.exports = {
      props: ['savedtemplate'],
      data: function(){
            return {
                  templates: []
            }
      },
      mounted: function(){
            console.log(`[Component] SavedTemplates.vue`);
            this.retrieveTemplates();
      },
      methods: {
            retrieveTemplates(){
                  templates = localStorage.getItem("templates");
                  if(templates==null) this.templates = [];
                  else this.templates = JSON.parse(templates);

                  
            },
            loadTemplate(code){
                  MicroModal.close("savedTemplates");
                  this.$emit('load-template', code);
            }
      },
      filters: {
            trimDate: function(value){
                  if(!value) return '';

                  if(value.indexOf("T")!=-1) value = value.replace("T", " ");
                  if(value.indexOf(".")!=-1) value = value.substr(0, value.indexOf("."));
                  return value;
            }
      },
      watch: {
            savedtemplate(newValue){
                  this.savedtemplate = false;
                  this.retrieveTemplates();
            }
      }
}
</script>

<style scoped>
table {
      font-size: 10pt;
      width: 100%;
}

.load-template {
      background: rgb(0, 68, 158);
    padding: 3px 5px;
    border-radius: 2px;
    font-size: 9pt;
    color: rgb(255, 255, 255);
    cursor: pointer;
}

.load-template:hover{
      opacity: .8;
}
</style>