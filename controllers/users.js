const bcrypt = require('bcrypt');
const userRouter = require('express').Router()
const User = require('../model/User')

//populate hace como un join pero no lo es con las notas al usuario

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1
    })
    res.json(users)
})

userRouter.post('/', async (req, res) => {

    try {
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

    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }


})

module.exports = userRouter