const jwt = require('jsonwebtoken');


//================================
// Verificar Token
//================================
let verificarToken = (req, res, next) => {
    let token = req.headers['token']; //]('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    });


};

//================================
// Verificar Admin Role
//================================

let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (!usuario.role === 'ADMIN_ROLE') {

        next();

    } else {
        return res.json({
            ok: false,
            err: { message: 'Solo los usuarios Admin puenden realizar esta accion' }
        })

    }
}


module.exports = {
    verificarToken,
    verificarAdmin_Role
}