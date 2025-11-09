const API_BASE_URL = 'https://contact-manager-api-wwhr.onrender.com/api';
const fetchAPI = (endpoint, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      
      if (!response.ok) {
        reject(new Error(data.message || 'Error en la petición'));
        return;
      }
      
      resolve(data);
    } catch (error) {
      reject(new Error(`Error de conexión: ${error.message}`));
    }
  });
};

export const contactService = {
  getContacts: () => {
    return fetchAPI('/contacts');
  },

  getContact: (id) => {
    return fetchAPI(`/contacts/${id}`);
  },

  createContact: (contactData) => {
    return fetchAPI('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  updateContact: (id, contactData) => {
    return fetchAPI(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  },

  deleteContact: (id) => {
    return fetchAPI(`/contacts/${id}`, {
      method: 'DELETE'
    });
  }
};