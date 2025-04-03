document.addEventListener("DOMContentLoaded", function(event){
 
    const routes = {
        "/question_page":{
        path:'/public/questions/question.html',
        title: 'question'
        },
        "/":{
            path:'public/home.html',
            title:'home'
        },
        "/public/home.html":{
            path:'/public/home.html',
            title:'home'
        },
        404:{
            path:"/templates/404.html",
            title:'404'
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
                    let nav = document.createElement('nav')
                    link.href = `/question_page/${id}`
                    link.addEventListener('click', async function (e) {
                       
                        const {target} = e;
                
                     
                        if (!target.matches('nav a')){
                            return;
                        }
                       
                        e.preventDefault();
                        route();
                    
                    }) 
                    link.append(data.message[i][x])
                    nav.append(link)
                    cell.append(nav)
                    
                }else{
                    cell.append(data.message[i][x])
                }
                row.append(cell)  
            }
        
            
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


/*async function locationHandler() {
    


    var location = window.location.hash.replace('#','')
    console.log(location)

    const route = routes[location] 
    

    let html = await fetch(route.path).then(response => response.text())
 

   

   
    if (location == 'question_page'){
        document.getElementById('content').innerHTML = html
        let response = await fetch(`http://localhost:3000/question/{}`, {
            mode:"cors"
        }
        )
        .then(response =>response.json())
        await organizeData(response)
    }

    
    
}*/

//Organize the question data on the form 
async function organizeData(res) {
  
    const values = {"question":1,"alternative_a":1,"alternative_b":1, "alternative_c":1, "alternative_d":1, "alternative_e":1, "correct_option": 0, "type_question":0, "date_created":2, "question_was_used":0 }
    let edit = document.getElementById('question_edit')
    let submit = document.createElement('button')
    submit.value = 'submit'
    submit.append('submit')
    submit.addEventListener('click', async function (e) {
        let form_items = ['question', 'alternative_a', 'alternative_b', 'alternative_c', 'alternative_d', 'alternative_e', 'correct_option', 'type_question', 'question_was_used']
        e.preventDefault(e)
        let form = document.querySelector('form')
        

        console.log(form)
        
        
    })

  


    for (const x in res.message.rows[0]){
        let label = document.createElement("label")
        label.append(x.replace('_', ' '), ': ')
        if (values[x] === 1){
        
            let input = document.createElement('input')
            
            input.value = res.message.rows[0][x]
            edit.append(label)
            edit.append(input)
        } else if(x == "correct_option"){
            let select = document.createElement('select')
            
            let options = ["a","b","c","d","e"]
            for (i = 0; i < options.length; i++){
                let option = document.createElement('option')
                option.value = options[i]
                if(option.value == res.message.rows[0][x]){
                    option.selected = res.message.rows[0][x]
                }
                console.log(res.message.rows[0][x])
                
             
                option.append(options[i])
                select.append(option) 
            }
            edit.append(label)
            edit.append(select)
           
        } else if(x == 'type_question'){
            let types = ['Excel', 'Word', 'Internet', 'Microsoft', 'Email']

            let select = document.createElement('select')

            for (i = 0; i < types.length; i++){
                let option = document.createElement('option')
                option.value = types[i].toLowerCase()
                if (option.value == res.message.rows[0][x]){
                    option.selected = res.message.rows[0][x]
                }

                option.append(types[i])

                select.append(option)
            }
            edit.append(label)
            edit.append(select)
        } else if(x == 'question_was_used'){
            let select = document.createElement('select')
            let used = ["Yes", "No"]

            let used_value
            if (res.message.rows[0][x]){
                used_value = "yes"
            }else{
                used_value = "no"
            }

            for (i = 0; i<used.length; i++){
                let option = document.createElement('option')
                option.value = used[i].toLowerCase()
            
                if(option.value === used_value){
                    option.selected = used_value
                }
                option.append(used[i])
                select.append(option)
            }
            edit.append(label)
            edit.append(select)
        }
        edit.append(submit)

    }
    
    
}

async function update_question(id){
    await fetch(`http://localhost:3000/update/:${id}`, {
        method : "put",
        headers : {
            "content-type":"application/json"
        },
        mode: "cors",
       
    })
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

const route = (event) => {

    event = event || window.event;
    
    event.preventDefault();

    window.history.pushState({}, "", event.target.href);
    locationHandler();
}

const locationHandler = async() =>{
    let location = window.location.pathname;
   
    if (location.length ==0){
        location = '/';
    }
    let urldata =location.split("/")
    console.log(urldata) 
    let id = urldata.slice(urldata.length - 1)[0]
    if (parseInt(id)) {
        location = location.slice(0, (location.length - 3))
        
        console.log(id)
        
        const route = routes[location] || routes['404']
        console.log(route.path)

        const html = await fetch(route['path']).then((response) => response.text());
    

        document.getElementById('content').innerHTML = html;

        if (location == '/question_page'){
            document.getElementById('content').innerHTML = html
            let response = await fetch(`http://localhost:3000/question/${id}`, {
                mode:"cors"
            }
            )
            .then(response =>response.json())
            await organizeData(response)
            
        }


    } else {
        const route = routes[location]
        console.log('skibidiiiiiiiiiiiiiiiiiiii')
        console.log(route)
        console.log(location)

        const html = await fetch(route['path']).then((response) => response.text());
        document.getElementById('content').innerHTML = html;
        table()
        
       
    }
    
    


    

}
window.onpopstate = locationHandler;

window.route = route

window.onbeforeunload = locationHandler;

locationHandler()

})


