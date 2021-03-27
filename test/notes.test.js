const moongose = require('mongoose')
const Note = require('../model/Note')
const { server } = require('../index')

const { api, initialNotes, getAllContentFromNotes } = require('./helpers')


beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of initialNotes) {
        const noteObject = new Note(note)
        await noteObject.save()
    }
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

    const {
        contents
    } = await getAllContentFromNotes()

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

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)

    expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
    //no json need

    const response = await api.get('/api/notes')

    //si una nota no se agrega la notas deben de quedar iguales
    expect(response.body).toHaveLength(initialNotes.length)
})


test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const { contents, response: SecondResponse } = await getAllContentFromNotes()

    expect(SecondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {

    const validObjectIdThatDoNotExist = '60451827152dc22ad768f442'

    await api
        .delete(`/api/notes/${validObjectIdThatDoNotExist}`)
        .expect(404)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
    server.close()
    moongose.connection.close()
})