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
// Base de datos
// ========================
let urlDb;
if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = 'mongodb+srv://tower:gynWguN9BbrPkGJ@cluster0.fx53q.mongodb.net/cafe';
}

process.env.URLDB = urlDb;