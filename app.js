
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const express = require('express');
const port = 3000
const axios = require('axios');


const user = require('./model/User')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
//   try {
        const getUser = await user.findOne({
            where: {
                username:username,
                password:password
            }
        });
        if(getUser !== null && getUser !== undefined && getUser instanceof Object) {
            const token = jwt.sign({
                name: username,
            }, "sample")
            
            res.header('auth-token', token).json({
                error: null,
                data: {token}
            })
        }else {
                res.json({message:"User not found"});
        }

});


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, 'sample', (err, user) => {
        if (err) {
          return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).send('No token provided');
    }
  };

  
app.get('/jobs', verifyToken, async (req, res) => {
    const { description, location, full_time, page } = req.query;
  let url = 'http://dev3.dansmultipro.co.id/api/recruitment/positions.json';

  
  if (description || location || full_time) {
    const searchParams = new URLSearchParams({ description, location, full_time });
    url += '?' + searchParams.toString();
  }

  
  if (page) {
    url += `&page=${page}`;
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving jobs data');
  }
  });

// Get job detail API
app.get('/jobs/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const url = `http://dev3.dansmultipro.co.id/api/recruitment/positions/${id}`;
    
    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error retrieving job detail data');
    }
});
  

app.listen(port, () => console.log("Apps Running on port "+ port))