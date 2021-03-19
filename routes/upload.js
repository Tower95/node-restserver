const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//paqutes para el manejo de archivos.
const fs = require('fs');
const path = require('path');
const app = express();

//middelware de fileupload.
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;
    let tiposValidos = ['usuarios','productos']
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'los tipos validas son: ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:'No se selecciono ningun archivo'
            }
        });
    }
    //Validacion de extencion.
    let file = req.files.newFile;
    let nameSplit = file.name.split('.');
    let extension = nameSplit[nameSplit.length -1];
    
    //Extenciones permitdas.
    let extencionesValidas = ['png','jpg','gif','jpeg'];

    if(extencionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'las extenciones validas son: ' + extencionesValidas.join(', '),
                ext:extension
            }
        })
    }

    //Cambiar nombre al archivo.
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${tipo}/${fileName}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        // imagen cargada
        switch(tipo){
            case'usuarios':{
                ImagenUsuario(id, res,fileName);
            }break;
            case 'productos':{
                ImagenProducto(id,res,fileName);
            }break
            default: break;
        }
        
        
        
        
    })

});

//Esta funcion guarda la imagen de un USUARIO.
function ImagenUsuario(id, res,fileName){
    Usuario.findById(id,(err,usuarioDb)=>{
        if(err){
            deletFile(fileName,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDb){
            deletFile(fileName,'usuarios')
            return res.status(400).json({
                ok:false,
                err:{
                    message : 'Usuario no existe'
                }
            });
        }
        //Aqui borramos la imagen anterior del usuario.
        deletFile(usuarioDb.img,'usuarios')

        usuarioDb.img = fileName;
        usuarioDb.save((err,usuarioGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.status(201).json({
                ok:true,
                usuario:usuarioGuardado,
                img:fileName
            });
        });
    });
}

//Esta funciion guarda la imagen de un PRODUCUTO.
function ImagenProducto(id, res, fileName){
    Producto.findById(id,(err,productoDb)=>{
       
        if(err){
            deletFile(fileName,'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDb){
            deletFile(fileName,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'No existe el producto.'
                }
            })
        }
        deletFile(productoDb.img,'productos');
        productoDb.img = fileName;
        productoDb.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.status(201).json({
                ok:true,
                producto:productoGuardado,
                img:fileName
            });
        });
    });
}

//Esta funcion elimina la imagen.
function deletFile(filName,tipo){

    let pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${filName}`)
    if(fs.existsSync(pathImagen)){
        //unlink elimina un archivo (NO FUNCIONA CON DIRECTORIOS).
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;