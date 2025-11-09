const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET /api/contacts - Obtener TODOS los contactos
router.get('/', async (req, res) => {
  try {
    console.log('📥 Solicitando todos los contactos...');
    
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    console.log(`✅ Encontrados ${contacts.length} contactos`);
    res.json({
      success: true,
      data: contacts,
      count: contacts.length,
      message: `Se encontraron ${contacts.length} contactos`
    });
  } catch (error) {
    console.error('❌ Error al obtener contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener contactos',
      error: error.message
    });
  }
});

// GET /api/contacts/:id - Obtener UN contacto por ID
router.get('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(`📥 Solicitando contacto con ID: ${contactId}`);
    
    const contact = await Contact.findById(contactId);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    console.log(`✅ Contacto encontrado: ${contact.nombre}`);
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Error al buscar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar el contacto',
      error: error.message
    });
  }
});

// POST /api/contacts - Crear NUEVO contacto
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creando nuevo contacto...', req.body);
    
    const nuevoContacto = new Contact(req.body);
    const contactoGuardado = await nuevoContacto.save();
    
    console.log(`✅ Contacto creado: ${contactoGuardado.nombre} (${contactoGuardado._id})`);
    res.status(201).json({
      success: true,
      message: 'Contacto creado exitosamente',
      data: contactoGuardado
    });
  } catch (error) {
    console.error('❌ Error al crear contacto:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya existe en la base de datos',
        field: 'email'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear contacto',
      error: error.message
    });
  }
});

// PUT /api/contacts/:id - ACTUALIZAR contacto
router.put('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(`✏️ Actualizando contacto ID: ${contactId}`, req.body);
    
    const contactoActualizado = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!contactoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado para actualizar'
      });
    }
    
    console.log(`✅ Contacto actualizado: ${contactoActualizado.nombre}`);
    res.json({
      success: true,
      message: 'Contacto actualizado exitosamente',
      data: contactoActualizado
    });
  } catch (error) {
    console.error('❌ Error al actualizar contacto:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya existe en la base de datos',
        field: 'email'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error al actualizar contacto',
      error: error.message
    });
  }
});

// DELETE /api/contacts/:id - ELIMINAR contacto
router.delete('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(`🗑️ Eliminando contacto ID: ${contactId}`);
    
    const contactoEliminado = await Contact.findByIdAndDelete(contactId);
    
    if (!contactoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado para eliminar'
      });
    }
    
    console.log(`✅ Contacto eliminado: ${contactoEliminado.nombre}`);
    res.json({
      success: true,
      message: 'Contacto eliminado exitosamente',
      data: contactoEliminado
    });
  } catch (error) {
    console.error('❌ Error al eliminar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar contacto',
      error: error.message
    });
  }
});

module.exports = router;