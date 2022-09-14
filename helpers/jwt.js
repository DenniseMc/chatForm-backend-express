const jwt = require('jsonwebtoken');

const createJWT = (email, name) => {

    return new Promise((resolve, reject) => {

        const payload = { email, name };

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '1d'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('Error al crear el token');
            }
            resolve(token);

        })
    })
}

module.exports = {
    createJWT
}


