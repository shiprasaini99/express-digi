import 'dotenv/config';
import logger from "./logger.js";
import morgan from "morgan";
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;


const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


// app.get('/' , (req,res) => {
//     res.send('Hello from Shipra')
// });

// app.get('/login' , (req,res) => {
//     res.send('Hi..u are successfully logged in...')
// });

app.use(express.json());

let teaData = [];
let nextId = 1;

app.post('/sendData' , (req,res)=>{
    logger.info('post request was made');
    const {name, price} = req.body;
    const newTea = {id: nextId++, name , price};
    teaData.push(newTea);
    res.status(201).send(teaData);
})

//get the whole data
app.get('/sendData', (req,res)=>{
    res.status(200).send(teaData);
})


//get the data
app.get('/sendData/:id', (req,res)=>{
    const tea = teaData.find(t => t.id === parseInt(req.params.id))

    if(!tea) return res.status(404).send('Tea not found')

    res.status(200).send(tea)
}) 


//update the data
app.put('/sendData/:id', (req,res) =>{
    const teaId = req.params.id;

    const tea = teaData.find(t => t.id === parseInt(req.params.id));

    if(!tea) return res.status(404).send('Tea not found');

    const {name, price} = req.body;
    tea.name = name;
    tea.price = price;
    res.status(200).send(tea);
})

//delete a data
app.delete('/sendData/:id' , (req, res) =>{
      const index =   teaData.findIndex(t => t.id === parseInt(req.params.id));

        if(index === -1){
            return res.status(404).send('404 not found')
        } 
        teaData.splice(index,1);
        res.status(204).send('deleted');
})

app.listen(port, ()=>{
    console.log(`Server is listening at ${port}...`);
})