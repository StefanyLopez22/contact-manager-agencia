//COMPONENTE principal de react
class App {
  constructor() {
    this.contacts = [];
    this.currentContact = null;
    this.isFormVisible = false;
    this.init();
  }

  async init() {
    this.render();
    this.setupEventListeners();
    await this.loadContacts();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'addContactBtn' || e.target.closest('#addContactBtn')) {
        this.showForm();
      }
      if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        const id = btn.dataset.id;
        const contact = this.contacts.find(c => c._id === id);
        this.showForm(contact);
      }
      if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        const btn = e.target.closest('.delete-btn');
        const id = btn.dataset.id;
        this.handleDelete(id);
      }
      if (e.target.id === 'cancelBtn' || e.target.closest('#cancelBtn')) {
        this.hideForm();
      }
      if (e.target.id === 'addFirstContact' || e.target.closest('#addFirstContact')) {
        this.showForm();
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.form && e.target.form.id === 'contactForm') {
        this.validateField(e.target);
      }
      if (e.target.id === 'telefono') {
        this.updatePhoneCounter(e.target);
      }
    });

    document.addEventListener('submit', (e) => {
      if (e.target.id === 'contactForm') {
        e.preventDefault();
        if (this.validateForm(e.target)) {
          const formData = new FormData(e.target);
          const contactData = Object.fromEntries(formData.entries());
          this.handleSubmit(contactData);
        }
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    field.classList.remove('is-invalid', 'is-valid');

    if (field.required && !value) {
      field.classList.add('is-invalid');
      return false;
    }

    switch(fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          field.classList.add('is-invalid');
          return false;
        }
        break;
      case 'telefono':
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
          field.classList.add('is-invalid');
          return false;
        }
        break;
      case 'nombre':
        if (value.length < 2) {
          field.classList.add('is-invalid');
          return false;
        }
        break;
    }

    field.classList.add('is-valid');
    return true;
  }

  validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showError('Por favor, corrige los campos marcados en rojo');
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
    }

    return isValid;
  }
//promise con async
  async loadContacts() {
    try {
      this.showLoading(true);
      //ejecuta la promise
      const response = await fetch('https://contact-manager-api-wwhr.onrender.com/api/contacts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar contactos');
      }
      
      this.contacts = data.data || [];
      this.renderContacts();
      this.updateStats();
    } catch (error) {
      this.showError('Error al cargar contactos: ' + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  renderContacts() {
    const container = document.getElementById('contactsList');
    if (!container) return;

    if (this.contacts.length === 0) {
      container.innerHTML = `
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
      `;
      return;
    }

    container.innerHTML = this.contacts.map(contact => `
      <div class="col-xl-4 col-lg-6 col-md-6 mb-4">
        <div class="card contact-card h-100 shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
            <span class="badge ${this.getCategoryBadgeClass(contact.categoria)}">
              <i class="fas ${this.getCategoryIcon(contact.categoria)} me-1"></i>
              ${contact.categoria}
            </span>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${contact._id}" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${contact._id}" title="Eliminar">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="contact-avatar mb-3">
              ${contact.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <h5 class="card-title text-dark fw-bold">${contact.nombre}</h5>
            <div class="contact-info">
              <div class="info-item">
                <i class="fas fa-envelope text-primary"></i>
                <span class="text-muted">${contact.email}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-phone text-success"></i>
                <span class="text-muted">${contact.telefono}</span>
              </div>
              ${contact.empresa ? `
                <div class="info-item">
                  <i class="fas fa-building text-warning"></i>
                  <span class="text-muted">${contact.empresa}</span>
                </div>
              ` : ''}
              ${contact.puesto ? `
                <div class="info-item">
                  <i class="fas fa-id-card text-info"></i>
                  <span class="text-muted">${contact.puesto}</span>
                </div>
              ` : ''}
            </div>
          </div>
          <div class="card-footer bg-transparent border-top">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i>
              Agregado: ${new Date(contact.fechaCreacion).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </small>
          </div>
        </div>
      </div>
    `).join('');
  }

  getCategoryBadgeClass(categoria) {
    const classes = {
      'Personal': 'bg-primary',
      'Trabajo': 'bg-success',
      'Familia': 'bg-warning text-dark',
      'Amigos': 'bg-info'
    };
    return classes[categoria] || 'bg-secondary';
  }

  getCategoryIcon(categoria) {
    const icons = {
      'Personal': 'fa-user',
      'Trabajo': 'fa-briefcase',
      'Familia': 'fa-users',
      'Amigos': 'fa-handshake'
    };
    return icons[categoria] || 'fa-user';
  }

  showForm(contact = null) {
    this.currentContact = contact;
    this.isFormVisible = true;
    
    const formContainer = document.getElementById('formContainer');
    const contactsContainer = document.getElementById('contactsContainer');
    
    if (formContainer && contactsContainer) {
      formContainer.innerHTML = this.renderForm();
      formContainer.classList.remove('d-none');
      contactsContainer.classList.add('d-none');
    }
  }

  hideForm() {
    this.isFormVisible = false;
    this.currentContact = null;
    
    const formContainer = document.getElementById('formContainer');
    const contactsContainer = document.getElementById('contactsContainer');
    
    if (formContainer && contactsContainer) {
      formContainer.classList.add('d-none');
      contactsContainer.classList.remove('d-none');
    }
  }

  renderForm() {
    const { nombre = '', email = '', telefono = '', empresa = '', puesto = '', categoria = 'Personal' } = this.currentContact || {};

    return `
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card form-card shadow-lg border-0">
            <div class="card-header bg-gradient-primary text-white py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="card-title mb-0 fw-bold">
                  <i class="fas ${this.currentContact ? 'fa-edit' : 'fa-user-plus'} me-2"></i>
                  ${this.currentContact ? 'Editar Contacto' : 'Nuevo Contacto'}
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
                           value="${nombre}" required placeholder="Ej: Juan Pérez García"
                           maxlength="50">
                    <div class="invalid-feedback">El nombre debe tener al menos 2 caracteres</div>
                    <div class="valid-feedback">¡Perfecto!</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label fw-semibold">Email *</label>
                    <input type="email" class="form-control form-control-lg" id="email" name="email" 
                           value="${email}" required placeholder="ejemplo@empresa.com"
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
                             value="${telefono}" required placeholder="7731852622"
                             maxlength="10" pattern="[0-9]{10}"
                             oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                      <div class="phone-counter">
                        <span class="counter">${telefono ? telefono.length : 0}</span>/<span class="max">10</span> dígitos
                      </div>
                    </div>
                    <div class="form-text text-muted">Solo números, máximo 10 dígitos</div>
                    <div class="invalid-feedback">El teléfono debe tener exactamente 10 dígitos numéricos</div>
                    <div class="valid-feedback">Teléfono válido</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="empresa" class="form-label fw-semibold">Empresa</label>
                    <input type="text" class="form-control form-control-lg" id="empresa" name="empresa" 
                           value="${empresa}" placeholder="Nombre de la empresa"
                           maxlength="50">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="puesto" class="form-label fw-semibold">Puesto/Cargo</label>
                    <input type="text" class="form-control form-control-lg" id="puesto" name="puesto" 
                           value="${puesto}" placeholder="Ej: Gerente de Ventas"
                           maxlength="50">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="categoria" class="form-label fw-semibold">Categoría</label>
                    <select class="form-select form-select-lg" id="categoria" name="categoria">
                      <option value="Personal" ${categoria === 'Personal' ? 'selected' : ''}>Personal</option>
                      <option value="Trabajo" ${categoria === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
                      <option value="Familia" ${categoria === 'Familia' ? 'selected' : ''}>Familia</option>
                      <option value="Amigos" ${categoria === 'Amigos' ? 'selected' : ''}>Amigos</option>
                    </select>
                  </div>
                </div>
                <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
                  <button type="button" class="btn btn-outline-secondary btn-lg" id="cancelBtn">
                    <i class="fas fa-times me-2"></i>Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary btn-lg shadow">
                    <i class="fas ${this.currentContact ? 'fa-save' : 'fa-plus'} me-2"></i>
                    ${this.currentContact ? 'Actualizar Contacto' : 'Crear Contacto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
//crea promise
  async handleSubmit(contactData) {
    try {
      this.showLoading(true);
      //p: crear o actualizar el contacto
      const url = this.currentContact 
        ? `https://contact-manager-api-wwhr.onrender.com/api/contacts/${this.currentContact._id}`
        : 'https://contact-manager-api-wwhr.onrender.com/api/contacts';
      
      const method = this.currentContact ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      this.showSuccess(
        this.currentContact ? 
        'Contacto actualizado correctamente' : 
        'Contacto creado exitosamente'
      );
      
      this.hideForm();
      await this.loadContacts(); //p
      
    } catch (error) {
      this.showError('Error al guardar: ' + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  async handleDelete(contactId) {
    const confirmed = await this.showConfirmation(
      '¿Eliminar contacto?',
      'Esta acción no se puede deshacer. El contacto se eliminará permanentemente de la base de datos.',
      'warning'
    );
    
    if (!confirmed) return;

    try {
      this.showLoading(true);
      
      const response = await fetch(`https://contact-manager-api-wwhr.onrender.com/api/contacts/${contactId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar contacto');
      }

      this.showSuccess('Contacto eliminado correctamente');
      await this.loadContacts();
      
    } catch (error) {
      this.showError('Error al eliminar: ' + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  showConfirmation(title, message, icon = 'warning') {
    return new Promise((resolve) => {
      const modalHtml = `
        <div class="modal fade" id="confirmationModal" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
              <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">
                  <i class="fas fa-${icon} text-${icon} me-2"></i>
                  ${title}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                <p class="mb-0">${message}</p>
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
      `;
      
      const existingModal = document.getElementById('confirmationModal');
      if (existingModal) {
        existingModal.remove();
      }
      
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      modal.show();
      
      document.getElementById('confirmDelete').addEventListener('click', () => {
        modal.hide();
        resolve(true);
      });
      
      document.getElementById('confirmCancel').addEventListener('click', () => {
        modal.hide();
        resolve(false);
      });
      
      document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', () => {
        resolve(false);
      });
    });
  }

  updateStats() {
    const total = this.contacts.length;
    const stats = {
      personal: this.contacts.filter(c => c.categoria === 'Personal').length,
      trabajo: this.contacts.filter(c => c.categoria === 'Trabajo').length,
      familia: this.contacts.filter(c => c.categoria === 'Familia').length,
      amigos: this.contacts.filter(c => c.categoria === 'Amigos').length
    };

    document.getElementById('totalContacts').textContent = total;
    document.getElementById('personalContacts').textContent = stats.personal;
    document.getElementById('workContacts').textContent = stats.trabajo;
    document.getElementById('familyContacts').textContent = stats.familia;
    document.getElementById('friendsContacts').textContent = stats.amigos;
    
    const contactsCountElement = document.getElementById('contactsCount');
    if (contactsCountElement) {
      contactsCountElement.textContent = total;
    }
  }

  updatePhoneCounter(input) {
    const counter = input.parentElement.querySelector('.counter');
    if (counter) {
      const length = input.value.length;
      counter.textContent = length;
      
      if (length === 10) {
        counter.className = 'counter text-success fw-bold';
      } else if (length >= 7) {
        counter.className = 'counter text-warning';
      } else {
        counter.className = 'counter text-danger';
      }
    }
  }

  showLoading(show) {
    let loading = document.getElementById('loadingOverlay');
    
    if (show) {
      if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.className = 'loading-overlay';
        loading.innerHTML = `
          <div class="loading-spinner">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-white fw-semibold">Procesando solicitud...</p>
          </div>
        `;
        document.body.appendChild(loading);
      }
      loading.classList.remove('d-none');
    } else {
      if (loading) {
        loading.classList.add('d-none');
      }
    }
  }

  showSuccess(message) {
    this.showAlert(message, 'success');
  }

  showError(message) {
    this.showAlert(message, 'danger');
  }

  showAlert(message, type) {
    const existingAlerts = document.querySelectorAll('.global-alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `global-alert alert alert-${type} alert-dismissible fade show border-0 shadow`;
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2 fs-5"></i>
        <span class="fw-semibold">${message}</span>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }

  render() {
    document.getElementById('app').innerHTML = `
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
    `;

    this.renderContacts();
  }
}

export default App;