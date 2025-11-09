export default class ContactCard {
  constructor(contact, onEdit, onDelete) {
    this.contact = contact;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }

  render() {
    const { _id, nombre, email, telefono, empresa, puesto, categoria } = this.contact;
    
    const categoryIcons = {
      'Personal': 'fas fa-user',
      'Trabajo': 'fas fa-briefcase',
      'Familia': 'fas fa-users',
      'Amigos': 'fas fa-handshake'
    };

    return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="badge bg-${this.getCategoryColor(categoria)}">
              <i class="${categoryIcons[categoria]} me-1"></i>
              ${categoria}
            </span>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${_id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${_id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">
              <i class="fas fa-envelope text-primary me-2"></i>
              ${email}
            </p>
            <p class="card-text">
              <i class="fas fa-phone text-success me-2"></i>
              ${telefono}
            </p>
            ${empresa ? `
              <p class="card-text">
                <i class="fas fa-building text-warning me-2"></i>
                ${empresa}
              </p>
            ` : ''}
            ${puesto ? `
              <p class="card-text">
                <i class="fas fa-id-card text-info me-2"></i>
                ${puesto}
              </p>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  getCategoryColor(categoria) {
    const colors = {
      'Personal': 'primary',
      'Trabajo': 'success',
      'Familia': 'warning',
      'Amigos': 'info'
    };
    return colors[categoria] || 'secondary';
  }

  attachEventListeners(container) {
    const editBtn = container.querySelector('.edit-btn');
    const deleteBtn = container.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => this.onEdit(this.contact));
    deleteBtn.addEventListener('click', () => this.onDelete(this.contact._id));
  }
}