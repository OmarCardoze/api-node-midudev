const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../model/User')

loginRouter.post('', async (req, res) => {
    const { body } = req

    //buscar el usuario
    const { username, password } = body
    const user = await User.findOne({ username })

    //verificar la contrasena

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        res.status(401).json({
            error: 'invalid user or password'
        })
    }

    //creacion del token 

    const userForToken = {
        id: user._id,
        username: user.username
    }

    //expiresIn para la experiacion
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        {
          expiresIn: 60 * 60 * 24 * 7
        }
        )

    res.send({
        name: user.name,
        username: user.username,
        token
    })
})

module.exports = loginRouter