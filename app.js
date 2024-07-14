require('dotenv').config();

const express = require('express');
const apiRouter = require('./src/routes/api.router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});