//imports express into server file
const express = require('express');


//sets the port designation for hosting on server
const PORT = process.env.PORT || 3001;

//sets express equal to app
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended:false }));
app.use(express.json());


//TEST GET ROUTE
// app.get('/', (req,res) =>{
//     res.json({
//         message: 'Hello World'
//     });
// });

//Default Response for any other request(Not Found)
//CATCHALL ROUTE
app.use((req,res) =>{
    res.status(404).end()
});

//Function to start server on port 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
