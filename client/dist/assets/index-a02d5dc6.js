(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();class r{constructor(){this.contacts=[],this.currentContact=null,this.isFormVisible=!1,this.init()}async init(){this.render(),this.setupEventListeners(),await this.loadContacts()}setupEventListeners(){document.addEventListener("click",t=>{if((t.target.id==="addContactBtn"||t.target.closest("#addContactBtn"))&&this.showForm(),t.target.classList.contains("edit-btn")||t.target.closest(".edit-btn")){const s=t.target.closest(".edit-btn").dataset.id,a=this.contacts.find(i=>i._id===s);this.showForm(a)}if(t.target.classList.contains("delete-btn")||t.target.closest(".delete-btn")){const s=t.target.closest(".delete-btn").dataset.id;this.handleDelete(s)}(t.target.id==="cancelBtn"||t.target.closest("#cancelBtn"))&&this.hideForm(),(t.target.id==="addFirstContact"||t.target.closest("#addFirstContact"))&&this.showForm()}),document.addEventListener("input",t=>{t.target.form&&t.target.form.id==="contactForm"&&this.validateField(t.target),t.target.id==="telefono"&&this.updatePhoneCounter(t.target)}),document.addEventListener("submit",t=>{if(t.target.id==="contactForm"&&(t.preventDefault(),this.validateForm(t.target))){const e=new FormData(t.target),s=Object.fromEntries(e.entries());this.handleSubmit(s)}})}validateField(t){const e=t.value.trim(),s=t.name;if(t.classList.remove("is-invalid","is-valid"),t.required&&!e)return t.classList.add("is-invalid"),!1;switch(s){case"email":if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return t.classList.add("is-invalid"),!1;break;case"telefono":if(!/^[0-9]{10}$/.test(e))return t.classList.add("is-invalid"),!1;break;case"nombre":if(e.length<2)return t.classList.add("is-invalid"),!1;break}return t.classList.add("is-valid"),!0}validateForm(t){let e=!0;if(t.querySelectorAll("[required]").forEach(a=>{this.validateField(a)||(e=!1)}),!e){this.showError("Por favor, corrige los campos marcados en rojo");const a=t.querySelector(".is-invalid");a&&a.focus()}return e}async loadContacts(){try{this.showLoading(!0);const t=await fetch("https://contact-manager-api-wwhr.onrender.com/api/contacts"),e=await t.json();if(!t.ok)throw new Error(e.message||"Error al cargar contactos");this.contacts=e.data||[],this.renderContacts(),this.updateStats()}catch(t){this.showError("Error al cargar contactos: "+t.message)}finally{this.showLoading(!1)}}renderContacts(){const t=document.getElementById("contactsList");if(t){if(this.contacts.length===0){t.innerHTML=`
        <div class="col-12">
          <div class="text-center py-5">
            <div class="empty-state">
              <i class="fas fa-address-book fa-4x text-light mb-3"></i>
              <h3 class="text-light">No hay contactos registrados</h3>
              <p class="text-light opacity-75">Comienza agregando tu primer contacto a la agenda</p>
              <button class="btn btn-primary btn-lg mt-3 shadow" id="addFirstContact">
                <i class="fas fa-plus me-2"></i>Agregar Primer Contacto
              </button>
            </div>
          </div>
        </div>
      `;return}t.innerHTML=this.contacts.map(e=>`
      <div class="col-xl-4 col-lg-6 col-md-6 mb-4">
        <div class="card contact-card h-100 shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
            <span class="badge ${this.getCategoryBadgeClass(e.categoria)}">
              <i class="fas ${this.getCategoryIcon(e.categoria)} me-1"></i>
              ${e.categoria}
            </span>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${e._id}" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${e._id}" title="Eliminar">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="contact-avatar mb-3">
              ${e.nombre.split(" ").map(s=>s[0]).join("").toUpperCase()}
            </div>
            <h5 class="card-title text-dark fw-bold">${e.nombre}</h5>
            <div class="contact-info">
              <div class="info-item">
                <i class="fas fa-envelope text-primary"></i>
                <span class="text-muted">${e.email}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-phone text-success"></i>
                <span class="text-muted">${e.telefono}</span>
              </div>
              ${e.empresa?`
                <div class="info-item">
                  <i class="fas fa-building text-warning"></i>
                  <span class="text-muted">${e.empresa}</span>
                </div>
              `:""}
              ${e.puesto?`
                <div class="info-item">
                  <i class="fas fa-id-card text-info"></i>
                  <span class="text-muted">${e.puesto}</span>
                </div>
              `:""}
            </div>
          </div>
          <div class="card-footer bg-transparent border-top">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i>
              Agregado: ${new Date(e.fechaCreacion).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric"})}
            </small>
          </div>
        </div>
      </div>
    `).join("")}}getCategoryBadgeClass(t){return{Personal:"bg-primary",Trabajo:"bg-success",Familia:"bg-warning text-dark",Amigos:"bg-info"}[t]||"bg-secondary"}getCategoryIcon(t){return{Personal:"fa-user",Trabajo:"fa-briefcase",Familia:"fa-users",Amigos:"fa-handshake"}[t]||"fa-user"}showForm(t=null){this.currentContact=t,this.isFormVisible=!0;const e=document.getElementById("formContainer"),s=document.getElementById("contactsContainer");e&&s&&(e.innerHTML=this.renderForm(),e.classList.remove("d-none"),s.classList.add("d-none"))}hideForm(){this.isFormVisible=!1,this.currentContact=null;const t=document.getElementById("formContainer"),e=document.getElementById("contactsContainer");t&&e&&(t.classList.add("d-none"),e.classList.remove("d-none"))}renderForm(){const{nombre:t="",email:e="",telefono:s="",empresa:a="",puesto:i="",categoria:o="Personal"}=this.currentContact||{};return`
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card form-card shadow-lg border-0">
            <div class="card-header bg-gradient-primary text-white py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="card-title mb-0 fw-bold">
                  <i class="fas ${this.currentContact?"fa-edit":"fa-user-plus"} me-2"></i>
                  ${this.currentContact?"Editar Contacto":"Nuevo Contacto"}
                </h4>
                <button type="button" class="btn-close btn-close-white" id="cancelBtn"></button>
              </div>
            </div>
            <div class="card-body p-4">
              <form id="contactForm" novalidate>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label fw-semibold">Nombre Completo *</label>
                    <input type="text" class="form-control form-control-lg" id="nombre" name="nombre" 
                           value="${t}" required placeholder="Ej: Juan Pérez García"
                           maxlength="50">
                    <div class="invalid-feedback">El nombre debe tener al menos 2 caracteres</div>
                    <div class="valid-feedback">¡Perfecto!</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label fw-semibold">Email *</label>
                    <input type="email" class="form-control form-control-lg" id="email" name="email" 
                           value="${e}" required placeholder="ejemplo@empresa.com"
                           maxlength="100">
                    <div class="invalid-feedback">Por favor ingresa un email válido</div>
                    <div class="valid-feedback">Email válido</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="telefono" class="form-label fw-semibold">Teléfono *</label>
                    <div class="position-relative">
                      <input type="tel" class="form-control form-control-lg" id="telefono" name="telefono" 
                             value="${s}" required placeholder="7731852622"
                             maxlength="10" pattern="[0-9]{10}"
                             oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                      <div class="phone-counter">
                        <span class="counter">${s?s.length:0}</span>/<span class="max">10</span> dígitos
                      </div>
                    </div>
                    <div class="form-text text-muted">Solo números, máximo 10 dígitos</div>
                    <div class="invalid-feedback">El teléfono debe tener exactamente 10 dígitos numéricos</div>
                    <div class="valid-feedback">Teléfono válido</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="empresa" class="form-label fw-semibold">Empresa</label>
                    <input type="text" class="form-control form-control-lg" id="empresa" name="empresa" 
                           value="${a}" placeholder="Nombre de la empresa"
                           maxlength="50">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="puesto" class="form-label fw-semibold">Puesto/Cargo</label>
                    <input type="text" class="form-control form-control-lg" id="puesto" name="puesto" 
                           value="${i}" placeholder="Ej: Gerente de Ventas"
                           maxlength="50">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="categoria" class="form-label fw-semibold">Categoría</label>
                    <select class="form-select form-select-lg" id="categoria" name="categoria">
                      <option value="Personal" ${o==="Personal"?"selected":""}>Personal</option>
                      <option value="Trabajo" ${o==="Trabajo"?"selected":""}>Trabajo</option>
                      <option value="Familia" ${o==="Familia"?"selected":""}>Familia</option>
                      <option value="Amigos" ${o==="Amigos"?"selected":""}>Amigos</option>
                    </select>
                  </div>
                </div>
                <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
                  <button type="button" class="btn btn-outline-secondary btn-lg" id="cancelBtn">
                    <i class="fas fa-times me-2"></i>Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary btn-lg shadow">
                    <i class="fas ${this.currentContact?"fa-save":"fa-plus"} me-2"></i>
                    ${this.currentContact?"Actualizar Contacto":"Crear Contacto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `}async handleSubmit(t){try{this.showLoading(!0);const e=this.currentContact?`https://contact-manager-api-wwhr.onrender.com/api/contacts/${this.currentContact._id}`:"https://contact-manager-api-wwhr.onrender.com/api/contacts",s=this.currentContact?"PUT":"POST",a=await fetch(e,{method:s,headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),i=await a.json();if(!a.ok)throw new Error(i.message||`Error ${a.status}`);this.showSuccess(this.currentContact?"Contacto actualizado correctamente":"Contacto creado exitosamente"),this.hideForm(),await this.loadContacts()}catch(e){this.showError("Error al guardar: "+e.message)}finally{this.showLoading(!1)}}async handleDelete(t){if(await this.showConfirmation("¿Eliminar contacto?","Esta acción no se puede deshacer. El contacto se eliminará permanentemente de la base de datos.","warning"))try{this.showLoading(!0);const s=await fetch(`https://contact-manager-api-wwhr.onrender.com/api/contacts/${t}`,{method:"DELETE"}),a=await s.json();if(!s.ok)throw new Error(a.message||"Error al eliminar contacto");this.showSuccess("Contacto eliminado correctamente"),await this.loadContacts()}catch(s){this.showError("Error al eliminar: "+s.message)}finally{this.showLoading(!1)}}showConfirmation(t,e,s="warning"){return new Promise(a=>{const i=`
        <div class="modal fade" id="confirmationModal" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
              <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">
                  <i class="fas fa-${s} text-${s} me-2"></i>
                  ${t}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                <p class="mb-0">${e}</p>
              </div>
              <div class="modal-footer border-0">
                <button type="button" class="btn btn-secondary" id="confirmCancel">Cancelar</button>
                <button type="button" class="btn btn-danger" id="confirmDelete">
                  <i class="fas fa-trash me-2"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `,o=document.getElementById("confirmationModal");o&&o.remove(),document.body.insertAdjacentHTML("beforeend",i);const n=new bootstrap.Modal(document.getElementById("confirmationModal"));n.show(),document.getElementById("confirmDelete").addEventListener("click",()=>{n.hide(),a(!0)}),document.getElementById("confirmCancel").addEventListener("click",()=>{n.hide(),a(!1)}),document.getElementById("confirmationModal").addEventListener("hidden.bs.modal",()=>{a(!1)})})}updateStats(){const t=this.contacts.length,e={personal:this.contacts.filter(a=>a.categoria==="Personal").length,trabajo:this.contacts.filter(a=>a.categoria==="Trabajo").length,familia:this.contacts.filter(a=>a.categoria==="Familia").length,amigos:this.contacts.filter(a=>a.categoria==="Amigos").length};document.getElementById("totalContacts").textContent=t,document.getElementById("personalContacts").textContent=e.personal,document.getElementById("workContacts").textContent=e.trabajo,document.getElementById("familyContacts").textContent=e.familia,document.getElementById("friendsContacts").textContent=e.amigos;const s=document.getElementById("contactsCount");s&&(s.textContent=t)}updatePhoneCounter(t){const e=t.parentElement.querySelector(".counter");if(e){const s=t.value.length;e.textContent=s,s===10?e.className="counter text-success fw-bold":s>=7?e.className="counter text-warning":e.className="counter text-danger"}}showLoading(t){let e=document.getElementById("loadingOverlay");t?(e||(e=document.createElement("div"),e.id="loadingOverlay",e.className="loading-overlay",e.innerHTML=`
          <div class="loading-spinner">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-white fw-semibold">Procesando solicitud...</p>
          </div>
        `,document.body.appendChild(e)),e.classList.remove("d-none")):e&&e.classList.add("d-none")}showSuccess(t){this.showAlert(t,"success")}showError(t){this.showAlert(t,"danger")}showAlert(t,e){document.querySelectorAll(".global-alert").forEach(i=>i.remove());const a=document.createElement("div");a.className=`global-alert alert alert-${e} alert-dismissible fade show border-0 shadow`,a.innerHTML=`
      <div class="d-flex align-items-center">
        <i class="fas ${e==="success"?"fa-check-circle":"fa-exclamation-triangle"} me-2 fs-5"></i>
        <span class="fw-semibold">${t}</span>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
      </div>
    `,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.remove()},5e3)}render(){document.getElementById("app").innerHTML=`
      <!-- Loading Overlay -->
      <div class="loading-overlay d-none" id="loadingOverlay">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>

      <!-- Main Container -->
      <div class="container-fluid px-4 py-4 bg-light min-vh-100">
        <!-- Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="header-section bg-white rounded-3 shadow-sm border">
              <div class="d-flex justify-content-between align-items-center p-4">
                <div>
                  <h1 class="display-6 fw-bold text-primary mb-2">
                    <i class="fas fa-address-book me-3"></i>
                    Agencia de Contactos
                  </h1>
                  <p class="text-muted mb-0 fs-5">Sistema profesional de gestión de contactos empresariales</p>
                </div>
                <button class="btn btn-primary btn-lg shadow-sm fw-semibold" id="addContactBtn">
                  <i class="fas fa-plus me-2"></i>Nuevo Contacto
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-5">
          <div class="col-xl-2 col-md-4 col-6 mb-3">
            <div class="card stat-card bg-primary text-white shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h2 class="card-title mb-0 fw-bold" id="totalContacts">0</h2>
                    <small class="opacity-90">Total Contactos</small>
                  </div>
                  <div class="stat-icon">
                    <i class="fas fa-users fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6 mb-3">
            <div class="card stat-card bg-success text-white shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h2 class="card-title mb-0 fw-bold" id="personalContacts">0</h2>
                    <small class="opacity-90">Personal</small>
                  </div>
                  <div class="stat-icon">
                    <i class="fas fa-user fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6 mb-3">
            <div class="card stat-card bg-info text-white shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h2 class="card-title mb-0 fw-bold" id="workContacts">0</h2>
                    <small class="opacity-90">Trabajo</small>
                  </div>
                  <div class="stat-icon">
                    <i class="fas fa-briefcase fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6 mb-3">
            <div class="card stat-card bg-warning text-white shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h2 class="card-title mb-0 fw-bold" id="familyContacts">0</h2>
                    <small class="opacity-90">Familia</small>
                  </div>
                  <div class="stat-icon">
                    <i class="fas fa-users fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6 mb-3">
            <div class="card stat-card bg-dark text-white shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h2 class="card-title mb-0 fw-bold" id="friendsContacts">0</h2>
                    <small class="opacity-90">Amigos</small>
                  </div>
                  <div class="stat-icon">
                    <i class="fas fa-handshake fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div id="formContainer" class="d-none mb-4"></div>

        <!-- Contacts Container -->
        <div id="contactsContainer">
          <div class="row">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="text-dark mb-0 fw-bold">
                  <i class="fas fa-list me-2"></i>
                  Lista de Contactos
                </h3>
                <div class="text-muted badge bg-white text-dark p-3 border shadow-sm fs-6">
                  <i class="fas fa-users me-2"></i>
                  <span id="contactsCount">${this.contacts.length}</span> contactos registrados
                </div>
              </div>
            </div>
          </div>
          <div class="row" id="contactsList"></div>
        </div>
      </div>
    `,this.renderContacts()}}document.addEventListener("DOMContentLoaded",()=>{new r});
