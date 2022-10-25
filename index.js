const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = 8000;

const app = http.createServer(async (request, response) =>{
    const requestMethod = request.method;
    const requestURL = request.url;
    if(requestURL === '/apiv1/tasks'){
        const jsonPath = path.resolve('./data.json');
        const jsonFile = await fs.readFile(jsonPath, 'utf-8');
        if(requestMethod === 'GET'){
            response.setHeader("Content-Type", "application/json");
            response.writeHead('200');
            response.write(jsonFile);
        }
        if(requestMethod === 'POST'){
            request.on('data', async (data) => {
                const newTask = JSON.parse(data);
                const arr = JSON.parse(jsonFile);
                arr.push({...newTask, id: getLastId(arr)});
                await fs.writeFile(jsonPath, JSON.stringify(arr));
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
        response.writeHead("503");
    }
    response.end();
});

app.listen(PORT);


const getLastId = (dataArray) => {
    const lastElementIndex = dataArray.length - 1;
    return dataArray[lastElementIndex].id + 1;
}