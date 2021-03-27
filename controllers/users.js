const bcrypt = require('bcrypt');
const userRouter = require('express').Router()
const User = require('../model/User')

userRouter.post('/', async (req, res) => {
    const { body } = req

    const { username, name, password } = body

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

   const saveUser = await user.save()
   
   res.json(saveUser)
})

module.exports = userRouter