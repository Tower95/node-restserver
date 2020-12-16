const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Ya existe esta categoria!'],
        unique: true
    },
    descripcion: {
        type: String,
        required: false
    },
    disponivilidad: {
        type: Boolean,
        required: false,
        default: true
    },
    idCreador: {
        type: String,
        required: true,

    }
});
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('categoria', categoriaSchema);