const express = require('express');
const Usuario = require('../models/usuario');



const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();


const { verificarToken, verificarAdmin_Role } = require('../server/middlewares/autenticacion');
app.get('/usuario', verificarToken, (req, res) => {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })

    //asi optenemos los parametros opcionales.
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let activos = { estado: true };

    Usuario.find(activos, 'nombre email role estado goole img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count(activos, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })


})

app.post('/usuario', [verificarToken, verificarAdmin_Role], (req, res) => {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });
        usuario.save((err, usuarioDb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // usuarioDb.password = null;
            res.json({
                ok: true,
                usuario: usuarioDb
            })

        });
    })
    //con el /:id se espesifica un paramatro para la funcion 
app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    body.estado = false;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

})

module.exports = app;