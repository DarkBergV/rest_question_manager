
async function get_data() {
    const response = await fetch("http://localhost:3000/home")

    const json_file = await response.json();
    console.log(json_file)
        
 

}

get_data()
