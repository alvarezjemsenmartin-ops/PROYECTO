const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO; 

async function conectarBD() {
try {
await mongoose.connect(uri);
console.log('Conectado correctamente a MongoDB Atlas con Mongoose');
} catch (error) {
console.log('Error conectando con Mongoose:', error.message);
}
}

module.exports = conectarBD;