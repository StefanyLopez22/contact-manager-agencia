require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log(' Configurando base de datos MongoDB Atlas...');
    
    await connectDB();
    
    const Contact = require('../models/Contact');
    
    // Limpiar colección existente
    await Contact.deleteMany({});
    console.log(' Colección limpiada');

    const result = await Contact.insertMany(sampleContacts);
    console.log(` ${result.length} contactos insertados en MongoDB Atlas`);
    
    // Verificar que todos tienen 10 dígitos
    const contacts = await Contact.find();
    const validPhones = contacts.filter(contact => /^[0-9]{10}$/.test(contact.telefono));
    console.log(` Teléfonos válidos (10 dígitos): ${validPhones.length}/${contacts.length}`);
    
    await mongoose.connection.close();
    console.log(' Base de datos configurada correctamente!');
    
  } catch (error) {
    console.error(' Error configurando BD:', error.message);
    process.exit(1);
  }
};

setupDatabase();