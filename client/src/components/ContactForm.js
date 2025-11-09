export default class ContactForm {
  constructor(containerId, onSubmit, onCancel, initialData = null) {
    this.container = document.getElementById(containerId);
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.initialData = initialData;
    this.isEditing = !!initialData;
  }

  render() {
    const { nombre = '', email = '', telefono = '', empresa = '', puesto = '', categoria = 'Personal' } = this.initialData || {};

    this.container.innerHTML = `
      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h5 class="card-title mb-0">
            <i class="fas ${this.isEditing ? 'fa-edit' : 'fa-plus'} me-2"></i>
            ${this.isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h5>
        </div>
        <div class="card-body">
          <form id="contactForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="nombre" class="form-label">Nombre *</label>
                <input type="text" class="form-control" id="nombre" name="nombre" value="${nombre}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email *</label>
                <input type="email" class="form-control" id="email" name="email" value="${email}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="telefono" class="form-label">Teléfono *</label>
                <input type="tel" class="form-control" id="telefono" name="telefono" value="${telefono}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="empresa" class="form-label">Empresa</label>
                <input type="text" class="form-control" id="empresa" name="empresa" value="${empresa}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="puesto" class="form-label">Puesto</label>
                <input type="text" class="form-control" id="puesto" name="puesto" value="${puesto}">
              </div>
              <div class="col-md-6 mb-3">
                <label for="categoria" class="form-label">Categoría</label>
                <select class="form-select" id="categoria" name="categoria">
                  <option value="Personal" ${categoria === 'Personal' ? 'selected' : ''}>Personal</option>
                  <option value="Trabajo" ${categoria === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
                  <option value="Familia" ${categoria === 'Familia' ? 'selected' : ''}>Familia</option>
                  <option value="Amigos" ${categoria === 'Amigos' ? 'selected' : ''}>Amigos</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                ${this.isEditing ? 'Actualizar' : 'Crear'} Contacto
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const contactData = Object.fromEntries(formData.entries());
      this.onSubmit(contactData);
    });

    cancelBtn.addEventListener('click', this.onCancel);
  }

  hide() {
    this.container.innerHTML = '';
  }
}