const { app } = require('../index')
const supertest = require('supertest')
const  User  = require('../model/User')
const api = supertest(app)

const initialNotes = [
    {
        content: 'Aprendiendo buco de esta vaina',
        important: true,
        date: new Date()
    },
    {
        content: 'Aprendiendo rantan de esta vaina',
        important: true,
        date: new Date()
    },
]

const getAllContentFromNotes = async () => {
    const response = await api.get('/api/notes')

    return {
        contents: await response.body.map(note => note.content),
        response
    }

}

const getUsers = async () => {
    const usersDB = await User.find({})
    return usersDB.map(user => user.toJSON())
}

module.exports = {
    api,
    initialNotes,
    getAllContentFromNotes,
    getUsers
}