const moongose = require('mongoose')
const supertest = require('supertest')
const {app, server} = require('../index')
const Note = require('../model/Note')

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

beforeEach(async () => {
    await Note.deleteMany({})

    const note1 = new Note(initialNotes[0])
    await note1.save()

    const note2 = new Note(initialNotes[1])
    await note2.save()
})

test('should motes are return as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about the bootcamp', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(note => note.content)

    expect(contents).toContain('Aprendiendo buco de esta vaina')
})

test('a valid note can be added', async () => {
    const newNote = {
        content: 'Proximamente async await',
        important: true
    }

    await api 
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /json/)

    const response = await api.get('/api/notes')

    const contents = response.body.map(note => note.content)

    expect(contents).toContain(newNote.content)
})

afterAll(() => {
    server.close()
    moongose.connection.close()
})