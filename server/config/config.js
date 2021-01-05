// ========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;
//.listen(process.env.PORT || 5000)

// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// Vencimiento del token
// ========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '30d';

// ========================
// seed token
// ========================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-desarollo';

// ========================
// Base de datos
// ========================
let urlDb;
if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URL;

}

process.env.URLDB = urlDb;


// ========================
// Google Client ID
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '387712523832-sd8spdqd9thvph0k7j9elhe5fb26i4fm.apps.googleusercontent.com'