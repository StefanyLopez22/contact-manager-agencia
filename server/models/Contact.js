const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido'],
    maxlength: [100, 'El email no puede exceder 100 caracteres']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
    match: [/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos'],
    minlength: [10, 'El teléfono debe tener exactamente 10 dígitos'],
    maxlength: [10, 'El teléfono debe tener exactamente 10 dígitos']
  },
  empresa: {
    type: String,
    trim: true,
    maxlength: [50, 'La empresa no puede exceder 50 caracteres']
  },
  puesto: {
    type: String,
    trim: true,
    maxlength: [50, 'El puesto no puede exceder 50 caracteres']
  },
  categoria: {
    type: String,
    enum: {
      values: ['Personal', 'Trabajo', 'Familia', 'Amigos'],
      message: 'Categoría inválida. Las opciones son: Personal, Trabajo, Familia, Amigos'
    },
    default: 'Personal'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);