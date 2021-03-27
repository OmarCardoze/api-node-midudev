const { app } = require('../index')
const supertest = require('supertest')

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

module.exports = {
    api,
    initialNotes,
    getAllContentFromNotes
}