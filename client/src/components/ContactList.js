import ContactCard from './ContactCard.js';

export default class ContactList {
  constructor(containerId, onEdit, onDelete) {
    this.container = document.getElementById(containerId);
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.contacts = [];
  }

  render(contacts) {
    this.contacts = contacts;
    
    if (contacts.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-address-book fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No hay contactos</h4>
          <p class="text-muted">Agrega tu primer contacto</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = contacts.map(contact => {
      const card = new ContactCard(contact, this.onEdit, this.onDelete);
      return card.render();
    }).join('');

    this.attachEventListeners();
  }

  attachEventListeners() {
    const cards = this.container.querySelectorAll('.col-md-6');
    cards.forEach((card, index) => {
      const contactCard = new ContactCard(this.contacts[index], this.onEdit, this.onDelete);
      contactCard.attachEventListeners(card);
    });
  }
}