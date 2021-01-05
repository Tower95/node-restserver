const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre de la categoria es necesaria'],
        unique: [true, 'ya existe esta categoria intente otro nombre']
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
    usuarios: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true,

    }
});
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('categoria', categoriaSchema);