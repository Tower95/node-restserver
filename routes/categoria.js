const express = require('express');

const { verificarToken, verificarAdmin_Role } = require('../server/middlewares/autenticacion');

let app = express();

const _ = require('underscore');

const Categoria = require('../models/categoria');


app.get('/categoria', verificarToken, (req, res) => {
    //Muestra todas las categorias.
    Categoria.find((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No hay niguna categoria' }
            });
        }
        return res.status(200).json({
            categoria: categoriaDB
        })
    });
});

app.get('/categoria/:id', verificarToken, (req, res) => {
    //Muestra una de las categorias por id.
    let id = req.params.id;
    console.log(id);
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

app.post('/categoria', [verificarToken, verificarAdmin_Role], (req, res) => {
    //crear nueva categoria y la regresa
    let body = req.body;
    if (body === null) {
        return res.status(400).json({
            ok: false,
            err: { message: 'No enviaste los datos nesesarios' }
        })
    }
    let categoriaNueva = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        disponivilidad: body.disponivilidad,
        idCreador: req.usuario._id
    });
    categoriaNueva.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                erro: { message: 'No se pudo crear la categoria', err }
            });
        }
        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'disponivilidad', 'nombre'])
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    //solo puede ser borrada por un administrador
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


module.exports = app;