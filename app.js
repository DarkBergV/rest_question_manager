var express = require('express');
var pg = require('pg');
var cors = require('cors')

var app = express()
var router = express.Router()


const {Pool} = pg

var port = '3000'


app.set('port', port)
app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded(extended = true))
app.use(cors())
// parse application/json
app.use(express.json())

const pool = new Pool({
    user: "user",
    password: "password",
    host: "host",
    port:"port",
    database:"database"
})


 
app.get('/run', (req,res) => {
  let run = {'run': "running"}
  res.send(run)
})

//return all data information to the client side 

app.get('/home', async (req, res) => {
    
    let data = await  pool.query('select * from questions')
    res.set({"content-type":"application/json",
      "Access-Control-Allow-Origin": "*",
    })
    res.json({"message": data.rows})
  })

//check a question based on the id

app.get('/question/:id', async (req, res) => {
  const id = parseInt(req.params.id)
 
  let data = await  pool.query('select * from questions where question_id = $1', [id])
  
  res.json({"status":200, 'message':data})

 
})

//save question data on the database
app.post('/question', async (req, res) => {
  res.setHeader('Content-type', 'application/json');
  

  await save_data(req.body)

  return res.json({"status":200})
  
})


//delete based on the id of a question

app.delete('/delete/:id', async (req, res) => {
  const id = parseInt(req.body.client_id)
  res.setHeader('Content-type', 'application/json');
 
  
  let row = await pool.query('select * from questions where question_id = $1', [id])
   
  if (row.rows.length <= 0){
   
    return res.json({"status":404})
  }
  else{
    await pool.query('delete from questions where question_id = $1', [id])
    return res.json({"status":200})
  }
  
})

//update based on the id of the question

app.put('/update/:id', async (req, res) => {
  let check = ['question', 'alternative_a', 'alternative_b', 'alternative_c', 'alternative_d', 'alternative_e', 'correct_option', 'type_question', 'question_was_used']
  let id = parseInt(req.params.id)
  let data = req.body
  let command = 'UPDATE questions SET '
  let values = []
  let count = 1
  for (x in data){
    if(check.includes(x)){
      command+= x + ` = $${count}, `
      values.push(data[x])
      count++ 
    }else{
      return res.json({"status":404, "message":"could not find data"})
    }
  }
 
  command = command.slice(0, (command.length - 2))
  command += ` where question_id = $${count++}`
  values.push(id)
  await pool.query(command, values)
  return res.json({"status":200})
  
})



module.exports = app
//function to save data information 
async function save_data(data){
  const current_date = new Date()
  
  let command = "insert into questions (question, alternative_a, alternative_b, alternative_c, alternative_d, alternative_e, correct_option, type_question, question_was_used, date_created) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
  let values = []
  for(const x in data){
    
   
    values.push(data[x])
   
  }

  values.push(current_date)

  await pool.query(command, values)


}