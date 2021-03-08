
//los schemas se hace para tener un modelo de los datos que se guardan 
// doc: https://mongoosejs.com/docs/guide.html#definition

const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})


// por defecto se guarda el id así => _id y agrega tambien el __v y con esto se elimina
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note