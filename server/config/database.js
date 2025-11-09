const mongoose = require('mongoose');

const connectDB = () => {
  return new Promise((resolve, reject) => {
    const mongoURI = process.env.MONGODB_URI;
    
    console.log('🔄 Conectando a MongoDB Atlas...');
    
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log('✅ CONECTADO a MongoDB Atlas');
      console.log('📊 Base de datos:', mongoose.connection.name);
      resolve();
    })
    .catch((error) => {
      console.error('❌ ERROR de conexión a MongoDB:', error.message);
      reject(error);
    });
  });
};

module.exports = connectDB;