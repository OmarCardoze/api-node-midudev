const testingRouter = require('express').Router()
const Note = require('../model/Note')
const User = require('../model/User')

testingRouter.post('/reset', async(req, res) => {
    await Note.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})

module.exports = testingRouter