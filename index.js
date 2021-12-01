// 3.13
require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors =  require('cors')
const {Person,connect,closeConnection} = require('./models/person')

const app = express()
app.use(morgan(function(tokens,req,res){
  return JSON.stringify(req.body)
}))
app.use(cors())
app.use(express.static('build'))

/*const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/


app.get('/',(req,res)=>{
    res.send('<h1>Hello There!</h1>')
})

/*app.get('/info',(req,res)=>{
  const str = `<p>Phonebook has info for ${persons.length} people</p>` + '<p>' + new Date().toString() +'</p>'
  res.send(str)
})*/

app.get('/api/persons',(req,res)=>{  
  connect().then(result=>{
    Person.find({}).then(persons=>{
        res.json(persons)      
        closeConnection()
    })
  })  
})

app.get('/api/persons/:id',(req,res)=>{
  const id = req.params.id
  connect().then(result=>{
    Person.find({}).then(persons=>{
      const found = persons.find(person=>person._id.toString()===id)    
      if(found) {
        res.json(found)
      } else {
          res.status(404).end()
      }
      closeConnection()
    })
  }) 
})
/*
app.delete('/api/persons/:id',(req,res)=>{
    const idToDelete = Number(req.params.id)
    const idsAndIndexes = persons.map((person,i)=>{return {id:person.id,i:i}})
    const forDeletion = idsAndIndexes.find(({id})=>idToDelete===id)
    if(forDeletion) {
        persons.splice(forDeletion.i,1)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})
*/
app.use(express.json())
/*
app.post('/api/persons',(req,res)=>{
  const newItem = req.body
  if(!("name" in newItem) || !("number" in newItem)) {
    res.status(400).json({error: "Both name and number must be provided"})
    return
  }
  const existing = persons.find(person=>person.name===newItem.name)
  if(existing) {
    res.status(400).json({error: "Name must be unique"})
    return
  }

  const newId = Math.floor(Math.random()*1000000)
  const toAdd = {...newItem, id: newId}
  persons.push(toAdd)
  res.json(toAdd)
})
*/
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})