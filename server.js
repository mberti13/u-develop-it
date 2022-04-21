// *Imports connection.js
const db = require('./db/connection');
//imports express into server file
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');


//sets the port designation for hosting on server
const PORT = process.env.PORT || 3001;

//sets express equal to app
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// ! creates an instance of express app
app.use('/api', apiRoutes);

//TEST GET ROUTE
// app.get('/', (req,res) =>{
//     res.json({
//         message: 'Hello World'
//     });
// });
// ****QUERIES****
// ! Queries were moved to their respective modules
//Default Response for any other request(Not Found)
//CATCHALL ROUTE
// * Initializes the server on EXPRESS.js
app.use((req, res) => {
    res.status(404).end()
});

// * STARTS the server at PORT or 3001
//Function to start server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
