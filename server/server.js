require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tu-app.netlify.app',
  '*'  // ← AGREGA esta línea temporalmente
];

// O mejor aún, usa esto SIMPLIFICADO:
app.use(cors({
  origin: true,  // ← Permite TODOS los origins temporalmente
  credentials: true
}));

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/contacts', require('./routes/contacts'));

// Ruta de información
app.get('/', (req, res) => {
  res.json({ 
    message: '🏢 API de Gestión de Contactos - MONGODB ATLAS',
    version: '1.0.0',
    database: 'MongoDB Atlas',
    status: '🟢 Funcionando correctamente'
  });
});

// Ruta de salud
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const Contact = require('./models/Contact');
  
  try {
    const contactCount = await Contact.countDocuments();
    
    res.json({ 
      status: 'OK',
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      contacts: contactCount,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
    suggestion: 'Verifique la URL o consulte la documentación'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('🔥 Error global no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Iniciar servidor
console.log('🚀 Iniciando servidor de Gestión de Contactos...');

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log('\n🎉 ====================================');
      console.log('   🏢 AGENCIA DE CONTACTOS - BACKEND');
      console.log('   ====================================');
      console.log(`   📡 Servidor: http://localhost:${PORT}`);
      console.log(`   🗄️  Base de datos: MongoDB Atlas`);
      console.log(`   🌐 Entorno: ${process.env.NODE_ENV}`);
      console.log('   ⚡ Estado: 🟢 LISTO PARA USAR');
      console.log('   ====================================\n');
      
      console.log('📋 Endpoints disponibles:');
      console.log(`   👉 GET  http://localhost:${PORT}/ - Información API`);
      console.log(`   👉 GET  http://localhost:${PORT}/api/contacts - Todos los contactos`);
      console.log(`   👉 POST http://localhost:${PORT}/api/contacts - Crear contacto`);
      console.log(`   👉 PUT  http://localhost:${PORT}/api/contacts/:id - Actualizar contacto`);
      console.log(`   👉 DEL  http://localhost:${PORT}/api/contacts/:id - Eliminar contacto\n`);
    });

    // Manejo graceful de cierre
    process.on('SIGTERM', () => {
      console.log('🛑 Recibido SIGTERM, cerrando servidor gracefully...');
      server.close(() => {
        const mongoose = require('mongoose');
        mongoose.connection.close();
        console.log('✅ Servidor y conexión a BD cerrados');
        process.exit(0);
      });
    });
  })
  .catch(error => {
    console.error('\n❌ NO SE PUDO INICIAR EL SERVIDOR:');
    console.error('   Error de conexión a MongoDB Atlas');
    console.error('   Detalles:', error.message);
    process.exit(1);
  });

module.exports = app;