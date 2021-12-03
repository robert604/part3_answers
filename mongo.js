const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://pbuser1:${password}@phonebook.qhnlx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

function makePersonModel(persondb) {
  const personSchema = new persondb.Schema({
    name: String,
    number: String
  })
  const Person = persondb.model('Person',personSchema)
  return Person
}

function addPerson(name,number) {
  mongoose.connect(url)
  const Person = makePersonModel(mongoose)
  const person = new Person({
    name: name,
    number: number
  })    
  person.save().then(()=>{
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })    
}

function findPersons(findParams) {
  mongoose.connect(url)
  const Person = makePersonModel(mongoose)
  Person.find(findParams).then(persons=>{
    persons.forEach(person=>{
      console.log('phonebook:')
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if(process.argv.length==2) {
  console.log('Please provide password')
} else if(process.argv.length==3) {
  findPersons({})
}


