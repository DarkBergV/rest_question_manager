
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
        if (res.status === 'success'){
            alert("asd")
        }
    })
    
    
    
})
async function table() {
    let table_test = document.getElementById('table')
    let row = document.createElement('tr')


    data = await get_data()
    
    for (i = 0; i < data.message.length; i++){
        let row = document.createElement('tr')

        for (const x in data.message[i]){
            
            let cell = document.createElement('th')
            cell.append(data.message[i][x])
            row.append(cell)    
        }

        table_test.append(row)

        
    }


    
}

table()})


