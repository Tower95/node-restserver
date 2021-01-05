const express = require('express');

const { verificarToken, verificarAdmin_Role } = require('../server/middlewares/autenticacion');

let app = express();

const _ = require('underscore');

const Categoria = require('../models/categoria');


app.get('/categoria', verificarToken, (req, res) => {
    //Muestra todas las categorias.
    Categoria.find({})
        .populate('usuarios', 'nombre email')
        .sort('nombre')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                categoria: categoriaDB
            })
        });
});

app.get('/categoria/:id', verificarToken, async(req, res) => {
    //Muestra una de las categorias por id.
    let id = req.params.id;
    console.log(id);
    let cat = await Categoria.findById(id);
    res.status(200).json({
        ok: true,
        categoria: cat
    })

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
        usuarios: req.usuario._id
    });
    categoriaNueva.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                erro: { message: 'No se pudo crear la categoria', err }
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    let id = req.params.id;


    let body = _.pick(req.body, ['descripcion', 'disponivilidad', 'nombre'])
    let categorioa = {
        descripcion: body.descripcion,
        disponivilidad: body.disponivilidad,
        nombre: body.nombre,
        idCreador: req.usuario._id
    };
    Categoria.findByIdAndUpdate(id, categorioa, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(200).json({
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
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


module.exports = app;