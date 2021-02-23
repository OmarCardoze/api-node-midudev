const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let notes = [
    {
        id: 1,
        content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        important: false
    },
    {
        id: 2,
        content: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        important: false
    },
    {
        id: 3,
        content: "ccccccccccccccccccccccccccccccccccccccccccccc",
        important: false
    }
]

app.get('/', (req, res) => {
    res.send('Esta es un api para mostrar notas')
})

app.get('/notes', (req, res) => {
    res.json(notes)
})

app.get('/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const note = notes.find(note => note.id === id)

    if (note) {
        res.send(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})


app.post('/notes', (req, res) => {
    const note = req.body

    if (!note || !note.content) {
        return res.status(400).json({
            error: 'note.content is missing'
        })
    }

    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)

    let newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toDateString()
    }

    notes = notes.concat(newNote)
  res.status(201).json(newNote)
 
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
