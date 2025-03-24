
document.addEventListener("DOMContentLoaded", function(event){
    async function get_data() {
    const response = await fetch("http://localhost:3000/home", {
        mode:"cors"})

    const json_file = await response.json()
    return json_file
  
    

        
 

}
async function table() {
    let table_test = document.getElementById('table')
    let row = document.createElement('tr')


    data = await get_data()
    
    for (i = 0; i < data.message.length; i++){
        let row = document.createElement('tr')

        for (const x in data.message[i]){
            console.log(data.message[i][x])
            let cell = document.createElement('th')
            cell.append(data.message[i][x])
            row.append(cell)    
        }

        table_test.append(row)

        
    }
    
}

table()})