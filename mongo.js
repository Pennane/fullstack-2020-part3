const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

function syntaxHelp() {
  console.log('Provide all arguments\nmongo.js <password> <name> <number>\nor\nmongo.js <password>')
  process.exit(1)
}

if (process.argv.length < 5 && process.argv.length !== 3) {
  syntaxHelp()
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@puhelinluettelo.8k2cn.mongodb.net/puhelinluettelodb?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const phonenumberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: String, required: true }
})

phonenumberSchema.plugin(uniqueValidator)

const Phonenumber = mongoose.model('Number', phonenumberSchema)

function listPhoneNumbers() {
  Phonenumber.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((number) => {
      console.log(number.name, number.number)
    })
    mongoose.connection.close()
  })
}

function addPhoneNumber({ name, number }) {
  const phonenumber = new Phonenumber({
    name,
    number,
    date: new Date()
  })

  phonenumber
    .save()
    .then((response) => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.error(err)
      mongoose.connection.close()
    })
}

if (name && number) {
  addPhoneNumber({ name, number })
} else if (!name && !number) {
  listPhoneNumbers()
} else {
  syntaxHelp()
}
