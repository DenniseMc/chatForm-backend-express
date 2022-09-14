/*
    Rutas de usuario
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fieldsValidation');
const { createUser } = require('../controllers/user');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.post(
    '/create', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty().isString(),
        check('firstLastName', 'El primer apellido es obligatorio').not().isEmpty().isString(),
        check('birthDate', 'La fecha de nacimiento no tiene un formato válido').custom( isDate ),
        check('email', 'El email es obligatorio').isEmail(),
        check('phone', 'El teléfono celular es obligatorio').not().isEmpty().isString(),
        fieldsValidation
    ],
    createUser 
);

module.exports = router;