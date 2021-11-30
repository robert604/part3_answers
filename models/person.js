const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

/*mongoose.connect(url).then(result=>{
    console.log('connected to MongoDB')
}).catch(error=>{
    console.log('error connecting to MongoDB:',error.message)
})*/

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person',personSchema)

function connect() {
    return mongoose.connect(url)
}
function closeConnection() {
    return mongoose.connection.close()
}

/*
function findPersons(findParams) {
    mongoose.connect(url)
    Person.find(findParams).then(persons=>{
        mongoose.connection.close()
        return persons
    })
}
*/

module.exports = {Person,connect,closeConnection}