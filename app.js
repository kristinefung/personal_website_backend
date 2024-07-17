require('dotenv').config();

const express = require('express');
const cors = require('cors')
const apiRouter = require('./src/routes/api.router');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});