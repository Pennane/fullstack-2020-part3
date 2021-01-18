const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

const validateByMinLength = (minLength = 0) => {
  return {
    validator: (value) => value && value.length >= minLength,
    message: `Field is shorter than the minimum allowed length of ${minLength} characters`
  }
}

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonenumberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, validate: validateByMinLength(3) },
  number: { type: String, required: true, validate: validateByMinLength(8) }
})

phonenumberSchema.plugin(uniqueValidator)

phonenumberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonenumber', phonenumberSchema)
