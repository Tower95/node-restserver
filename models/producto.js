const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del producto es necesario'], unique: true },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
    img:{type:String, require:[false]}
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('Producto', productoSchema);