require('./mongo')
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { response } = require('express')
const app = express()
const Note = require('./model/Note')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Esta es un api para mostrar notas')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if(note) return res.json(note)
      res.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
    .then(result => {
      res.json(result)
    })
    .catch(next)

})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end)
    .catch(next)
})

app.post('/api/notes', (req, res, next) => {
  const note = req.body
  console.log(note);
  if (!note.content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save().then(savedNote => {
    res.json(savedNote)
  }).catch(err => next(err))
})

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
