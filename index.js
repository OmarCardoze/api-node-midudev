require('./mongo')
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

const Note = require('./model/Note')
const User = require('./model/User')

const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const userExtractor = require('./middleware/userExtractor')

const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Esta es un api para mostrar notas')
})

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if (note) return res.json(note)
      res.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
    .catch(next)

})

app.delete('/api/notes/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  const result = await Note.findByIdAndDelete(id)
  if (result === null) return res.sendStatus(404)

  res.status(204).end()
})

app.post('/api/notes', userExtractor, async (req, res, next) => {
  const {
    content,
    important = false
  } = req.body

  //agregar autorizacion al header
  //doc: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication

  // sacar el userId del request
  const { userId } = req

  const user = await User.findById(userId)

  console.log(content);
  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    // esta forma solo funciona con mongoose y no con mongodb
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// limpia la db para testing
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')

  app.use('/api/testing', testingRouter)
}

app.use(notFound)
app.use(handleError)


const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

module.exports = { app, server }