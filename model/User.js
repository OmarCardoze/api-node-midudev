const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Notes'
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
  
  const User = model('User', userSchema)
  
  module.exports = User