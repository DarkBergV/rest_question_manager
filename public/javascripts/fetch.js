document.addEventListener("DOMContentLoaded", function(event){
 
    const routes = {
        "question_page":{
        path:'questions/question.html',
        title: 'question'
        }
    }
    
        
 

    async function get_data() {
    const response = await fetch("http://localhost:3000/home", {
        mode:"cors"})

    const json_file = await response.json()

    return json_file
  
    

        
 

}

document.getElementById("form-submit").addEventListener("click", async function(e){
    form_items = ['question', 'alternative_a', 'alternative_b', 'alternative_c', 'alternative_d', 'alternative_e', 'correct_option', 'type_question', 'question_was_used']
    e.preventDefault()
    let form = document.querySelector('form')
    let data = new Object()
    for (i = 0; i < form_items.length; i++){
       
        data[form_items[i]] = form[form_items[i]].value

    }
    data = JSON.stringify(data)
    await fetch('http://localhost:3000/question', {
        
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        mode: "cors",
        body:(data),
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
        if (res.status === 200){
            alert("asd")
        }
    })
    
    
    
})

async function delete_data(id) {
    
    id = JSON.stringify({"client_id": id})
    await fetch(`http://localhost:3000/delete/:${id}`, {
        method : 'DELETE',
        headers:{
            "content-type":"application/json"
        },
        mode:"cors",
        body:(id)
    })
    .then(response =>response.json())
    .then(res => {
        console.log(res)
        if (res.status===404){
            alert('not found')
        }else if(res.status===200){
            alert('success')
        }
    })
    
}

async function createDelete(id) {
    // create form and buttons
    let delete_form = document.createElement('form')
    delete_form.method = "DELETE"
    console.log(id)
    let delete_space = document.createElement('th')
    let delete_button = document.createElement('button')
    let delete_figure = document.createTextNode('\u00D7')
    delete_button.type = 'submit'

    //add figure to button and button to form
    delete_button.append(delete_figure)
    delete_form.append(delete_button)

    //button logic when clicked
    delete_button.addEventListener('click', async function (e) {
        e.preventDefault();
        await delete_data(id,e)  
    })

    //add button to space on the table 
    delete_space.append(delete_form)
    return delete_space
}
async function table() {
    let table_test = document.getElementById('table')
    let row = document.createElement('tr')
    const values = {"question":1,"alternative_a":0,"alternative_b":0, "alternative_c":0, "alternative_d":0, "alternative_e":0, "correct_option": 0, "type_question":1, "date_created":1, "question_was_used":1 }


    data = await get_data()
    
    for (i = 0; i < data.message.length; i++){
        let row = document.createElement('tr')
        let id 
        for (const x in data.message[i]){
            if (values[x] === 1 ){
                let cell = document.createElement('th')
                if(x === "question"){
                    let link = document.createElement("a")
                    link.href = `#question_page`
                    /*link.addEventListener('click', async function (e) {
                        e.preventDefault()
                        await locationHandler()  
                    
                    })*/ 
                    link.append(data.message[i][x])
                    cell.append(link)
                }else{
                    cell.append(data.message[i][x])
                }
                row.append(cell)  
            }
            console.log(typeof x)
            
            if (x === 'question_id'){
                id = data.message[i][x]
            }
              
        }
        
        row.append(await createDelete(id))
        
        table_test.append(row)

        
    }


    
}

async function editPage(id) {
    
    await fetch(`http://localhost:3000/question/${id}`, {
        mode:"cors"
    }
    )
    .then(response =>{
        console.log(response)
    }) 
}


async function locationHandler() {
    


    var location = window.location.hash.replace('#','')
    console.log(location)

    const route = routes[location] 
    console.log(route)

    let html = await fetch(route.path).then(response => response.text())
    console.log(html, 'skibidi')

   

    document.getElementById('content').innerHTML = html

    let response = await fetch(`http://localhost:3000/question/48`, {
        mode:"cors"
    }
    )
    .then(response =>response.json())
    await organizeData(response)

    
    
}


async function organizeData(res) {
    console.log(res)
    const values = {"question":1,"alternative_a":1,"alternative_b":1, "alternative_c":1, "alternative_d":1, "alternative_e":1, "correct_option": 0, "type_question":0, "date_created":2, "question_was_used":0 }
    let edit = document.getElementById('question_edit')
    console.log(res.message)


    for (const x in res.message.rows[0]){
        if (values[x] === 1){
            console.log(x)
            let input = document.createElement('input')
            let label = document.createElement("label")
            label.append(x.replace('_', ' '), ': ')
            input.value = res.message.rows[0][x]
            edit.append(label)
            edit.append(input)
        }
    }
    
    
}

async function load_question() {
    let query = window.location.href
    let id = query.split('?')[1].split('=')[1]
    await fetch(`http://localhost:3000/question/${id}`, {
        mode:'cors'
    })
    .then(response => response.json())
    .then(res => {
        
        if (res.status === 200){
            organizeData(res)
        }
    })
}

window.addEventListener('hashchange', locationHandler)

table()})


