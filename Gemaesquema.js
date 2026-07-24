const mongoose = require('mongoose');
const gemaSchema = new mongoose.Schema({
  Imginf:          { type: String },
  Nombreinf:       { type: String, required: true },
  Tipoinf:         { type: String },
  Colorinf:        { type: String },
  durezainf:       { type: String },
  procedenciainf:  { type: String },
  composicioninf:  { type: String },
  brilloinf:       { type: String },
  rarezainf:       { type: String },
  valorEstimadoinf:{ type: String }
});
module.exports = mongoose.model('Gema', gemaSchema);
