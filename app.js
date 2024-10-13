const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL,{
}).then(() => console.log('Mongo DB Connect'))
.catch(err => console.log(err));

const authRoute = require('./routes/AdminAuth');
app.use('/api/auth/admin',authRoute);

const UserRoute = require('./routes/User');
app.use('/api/user',UserRoute);


const AdminActionRoute = require('./routes/ActionAdmin');
app.use('/api/admin',AdminActionRoute);


const ProjectRoute = require('./routes/project');
app.use('/api/project',ProjectRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));