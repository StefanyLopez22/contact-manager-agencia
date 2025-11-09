require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log('🚀 Configurando base de datos MongoDB Atlas...');
    
    await connectDB();
    
    const Contact = require('../models/Contact');
    
    // Limpiar colección existente
    await Contact.deleteMany({});
    console.log('🧹 Colección limpiada');
    
    // Insertar datos de ejemplo CON TELÉFONOS DE 10 DÍGITOS
    const sampleContacts = [
      {
        nombre: 'Ana García López',
        email: 'ana.garcia@techsolutions.com',
        telefono: '6123456789', // 10 dígitos
        empresa: 'Tech Solutions S.A.',
        puesto: 'Desarrolladora Senior',
        categoria: 'Trabajo'
      },
      {
        nombre: 'Carlos Martínez Ruiz',
        email: 'carlos.martinez@personal.com',
        telefono: '6234567890', // 10 dígitos
        empresa: 'Freelance',
        puesto: 'Diseñador Gráfico',
        categoria: 'Amigos'
      },
      {
        nombre: 'María Rodríguez Santos',
        email: 'maria.rodriguez@hospitalcentral.com',
        telefono: '6345678901', // 10 dígitos
        empresa: 'Hospital Central',
        puesto: 'Médica Especialista',
        categoria: 'Familia'
      },
      {
        nombre: 'David Chen Zhang',
        email: 'david.chen@innovatech.com',
        telefono: '6456789012', // 10 dígitos
        empresa: 'Innovatech Corporation',
        puesto: 'Director de Proyectos',
        categoria: 'Trabajo'
      }
    ];

    const result = await Contact.insertMany(sampleContacts);
    console.log(`✅ ${result.length} contactos insertados en MongoDB Atlas`);
    
    // Verificar que todos tienen 10 dígitos
    const contacts = await Contact.find();
    const validPhones = contacts.filter(contact => /^[0-9]{10}$/.test(contact.telefono));
    console.log(`📞 Teléfonos válidos (10 dígitos): ${validPhones.length}/${contacts.length}`);
    
    await mongoose.connection.close();
    console.log('🎉 Base de datos configurada correctamente!');
    
  } catch (error) {
    console.error('❌ Error configurando BD:', error.message);
    process.exit(1);
  }
};

setupDatabase();