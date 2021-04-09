const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

//mongoose-unique-validator, es para validar que solo exista un usuario

const userSchema = new Schema({
    username: {
      type: String,
      unique: true
    },
    name: String,
    passwordHash: String,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      
      //Para que nos devuelva de la BD el id sin el guion bajo(_)
      delete returnedObject._id
      delete returnedObject.__v

    //Para que no nos devuelva la contraseña en el json muy importante!
      delete returnedObject.passwordHash
    }
  })
  
  userSchema.plugin(uniqueValidator)

  const User = model('User', userSchema)
  
  module.exports = User