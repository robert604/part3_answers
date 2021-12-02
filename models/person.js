const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

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

module.exports = {Person,connect,closeConnection}