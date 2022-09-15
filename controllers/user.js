const { response } = require('express');
const { db } = require('../database/config');
const { createJWT } = require('../helpers/jwt');

const DB_TABLE = 'users_test_dennise_morales';

const createUser = async (req, res = response) => {

    console.info('FUNCTION - createUser');
    
    const {
        name,
        secondName,
        firstLastName,
        secondLastName,
        birthDate,
        email,
        phone

    } = req.body;

    try {

        //validate if email exist
        const userEmailValidation = await db.query(
            `SELECT id as id,
            name as name,
            second_name as secondName,
            first_lastname as firstLastName,
            second_lastname as secondLastName, 
            birth_date as birthDate, 
            email as email, 
            phone as phone 
        FROM ${DB_TABLE} WHERE email = '${email}' `,
            {
                type: db.QueryTypes.SELECT
            }
        );

        if (userEmailValidation && userEmailValidation.length > 0) {
            return res.status(500).json({
                status: false,
                message: 'El correo electrónico proporcionado ya existe.'
            });            
        };

        const respInsert = await db.query(
            `INSERT INTO ${DB_TABLE} (name, second_name, first_lastname, second_lastname, birth_date, email, phone, capture_date) 
            VALUES (:name, :secondName, :firstLastName, :secondLastName, :birthDate, :email, :phone, now())`,
            {
                type: db.QueryTypes.INSERT,
                replacements: {
                    name,
                    secondName: secondName ? secondName : null,
                    firstLastName,
                    secondLastName: secondLastName ? secondLastName : null,
                    birthDate,
                    email,
                    phone
                }
            }
        );
        const [id, rows] = respInsert;
        if (id && rows && rows > 0) {

            const user = await db.query(
                `SELECT id as id,
                name as name,
                second_name as secondName,
                first_lastname as firstLastName,
                second_lastname as secondLastName, 
                birth_date as birthDate, 
                email as email, 
                phone as phone 
            FROM ${DB_TABLE} WHERE id = ${id}`,
                {
                    type: db.QueryTypes.SELECT
                }
            );

            // create JWT
            const token = await createJWT(user.email, user.name);

            res.status(201).json({
                status: true,
                user: { ...user[0], token }
            });
        } else {
            return res.status(500).json({
                status: false,
                message: 'Ocurrió un error al insertar la información.'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Ocurrió un error al insertar la información.'
        });
    }
}

module.exports = {
    createUser
}