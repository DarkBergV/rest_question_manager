document.addEventListener("DOMContentLoaded", function(event){
   
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


    data = await get_data()
    
    for (i = 0; i < data.message.length; i++){
        let row = document.createElement('tr')
        let id 
        for (const x in data.message[i]){
                
            let cell = document.createElement('th')
            cell.append(data.message[i][x])
            if (x === 'question_id'){
                id = data.message[i][x]
            }
            row.append(cell)    
        }
        
        row.append(await createDelete(id))
        
        table_test.append(row)

        
    }


    
}

table()})


