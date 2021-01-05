const express = require('express');

const { verificarToken } = require('../server/middlewares/autenticacion');

let app = express();

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const _ = require('underscore');

//=============================
// Optener todos los productos
//=============================
app.get('/productos', (req, res) => {

    //trae todos los productos
    //populate : usuario categoria
    //paginado
    let body = req.body;
    if (body.page <= 0) {
        body.page = 1;
    }
    let pagina = 10 * (body.page - 1) || 0;
    let limite = 10;
    Producto.find({ disponible: true })
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .limit(limite)
        .skip(pagina)
        .exec((err, ProductosDB) => {
            if (err) {
                return res.status(201).json({
                    ok: false,
                    err
                });
            }
            res.status(400).json({
                ok: true,
                ProductosDB
            });
        });
});

//=============================
// Optener un producto por id
//=============================
app.get('/productos/:id', (req, res) => {
    //populate: usuario, categoria

    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, ProductosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    erro: 'No exixte ese producto',
                    err
                });
            }
            res.status(201).json({
                ok: true,
                ProductosDB
            });
        })


});
//=============================
// Buscar un producto 
//=============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino

    //exprecion regular
    let regex = new RegExp(termino, 'i')


    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(200).json({
                ok: true,
                productosDB
            })
        })

})

//=============================
// Crea un producto 
//=============================
app.post('/productos', verificarToken, async(req, res) => {
    //grabar un usuario.
    //grabar una categoria.
    let body = req.body

    let categoria = await Categoria.find({ nombre: body.categoria }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (categoriaDB.length === 0) {
            return res.status(500).json({
                ok: false,
                err: 'no se enecontro esa categiria'
            });
        }
    });
    categoria = categoria[0]._id;
    let productoNuevo = new Producto({
        categoria,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
    });

    productoNuevo.save((err, productoNuevoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: { message: 'No se pudo crear el producto ', err }
            });
        }
        if (!productoNuevoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            productoNuevoDB
        });
    });
});


//=============================
// Actuliazar un producto por id
//=============================
app.put('/productos/:id', [verificarToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion'])

    let productoNuevo = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        usuario: req.usuario._id,
        descripcion: body.descripcion
    };

    Producto.findByIdAndUpdate(id, productoNuevo, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        });
    });
});

//=============================
// Borrar un producto por id
//=============================
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;

    let productoNuevo = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, productoNuevo, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;