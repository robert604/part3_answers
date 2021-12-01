require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require('morgan')
const cors =  require('cors')

app.use(express.static('build'))
app.use(express.json())
const {Person,connect,closeConnection} = require('./models/person')


app.use(morgan(function(tokens,req,res){
  return JSON.stringify(req.body)
}))
app.use(cors())

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
    Person.findById(id).then(person=>{ 
      if(person) {
        res.json(person)
      } else {
          res.status(404).end()
      }
      closeConnection()
    }).catch(error=>{
      res.status(500).end()
    })
  }) 
})

app.delete('/api/persons/:id',(req,res)=>{
  const id = req.params.id
  connect().then(result=>{
    Person.findByIdAndDelete(id).then(result=>{ 
      if(result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
      closeConnection()
    }).catch(error=>{
      console.log(error)
      res.status(500).end()
    })
  }) 
})


app.post('/api/persons',(req,res)=>{
  const newInfo = req.body
  connect().then(result=>{
    const person = new Person({
      name: newInfo.name,
      number: newInfo.number
    })    
    person.save().then(result=>{
      res.json(result)
      closeConnection()
    })
  })  
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})