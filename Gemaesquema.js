const mongoose = require('mongoose');
const gemaSchema = new mongoose.Schema({
  imagenUrl:          { type: String },
  nombre:       { type: String, required: true },
  tipo:         { type: String },
  color:        { type: String },
  durezaMohs:       { type: String },
  procedencia:  { type: String },
  composicion:  { type: String },
  brillo:       { type: String },
  rareza:       { type: String },
  valorEstimado:{ type: String }
});
module.exports = mongoose.model('Gema', gemaSchema);
