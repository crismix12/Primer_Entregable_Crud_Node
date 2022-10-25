//importamos modulos que usaremos http, path, fs
const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = 8000;

const app = http.createServer(async (request, response) =>{
    // dentro del objeto request podemos leer el metodo de la peticion
    // GET -- POST -- PUT -- DELETE
    const requestMethod = request.method;
    const requestURL = request.url;
    // leer la ruta de la peticion y el metodo
    // console.log(requestURL, requestMethod);
    
    //responder el data.json cuando se realice un get al endpoiont /apiv1/tasks
    if(requestURL === '/apiv1/tasks'){
        const jsonPath = path.resolve('./data.json')
        const jsonFile = await fs.readFile(jsonPath, 'utf-8') //acepta dos parametros "ruta y codificacion"
        if(requestMethod === 'GET'){
            //respondo con data.json
            //obtener la ruta del data.json
            // console.log(jsonPath);
            response.setHeader("Content-Type", "application/json");
            response.writeHead('200');
            response.write(jsonFile);
            // response.end();
        }
        if(requestMethod === 'POST'){
            request.on('data', async (data) => {
                //recibo un JSON
                // necesito agregar la data a data.json
                // necesito obtener la informacion *
                // necesito escribir el archivo
                    //primero leer el archivo *
                        //necesito la ruta del archivo  *
                    //escribir en el archivo
                const newTask = JSON.parse(data);
                // console.log(parsed);
                // const dataPath = path.resolve('./data.json');
                const arr = JSON.parse(jsonFile);
                arr.push({...newTask, id: getLastId(arr)});
                await fs.writeFile(jsonPath, JSON.stringify(arr));
                // console.log(arr);
            })
            response.setHeader("Content-Type", "application/json");
            response.writeHead('201');
        }
        if(requestMethod === 'PUT'){
           request.on('data', async(data) => {
                const received = JSON.parse(data);
                const arr = JSON.parse(jsonFile);
                const findId = arr.findIndex((itm) => {
                    return itm.id === received.id;
                 });

                 arr[findId].status = received.status;
                 await fs.writeFile(jsonPath, JSON.stringify(arr));
           }) 
           response.setHeader("Content-Type", "application/json");
           response.writeHead('200');
        }
        if(requestMethod === 'DELETE'){
            request.on('data', async(data) => {
                const received = JSON.parse(data);
                const arr = JSON.parse(jsonFile);

                const filteredArr = arr.filter((itm) => {
                    return itm.id !== received.id;
                 })

                 await fs.writeFile(jsonPath, JSON.stringify(filteredArr));

           }) 
           response.setHeader("Content-Type", "application/json");
           response.writeHead('200');           
        }
    } else {
        response.writeHead("503") //poner un estado de la respuesta
    }
    
    //ya que saben como leer la ruta de la peticion
    // el metodo de la peticion
    // obtener la informacion que se envia por el body

    //1- cuando se haga un post agregar un elemento al json y responder con un status 201
    //2- cuando se haga un PUT (solamente se enviara por el body {status: true}) se envia un id: data y 
    //   actualizar el elemento y responder con un status investigar con que estado puedes responder
    //3- CUando se haga un delete eliminar el elemento del json y responder (investigar con que status code puedes responder)
    
    response.end();
});

app.listen(PORT);


const getLastId = (dataArray) => {
    const lastElementIndex = dataArray.length - 1;
    return dataArray[lastElementIndex].id + 1;
}