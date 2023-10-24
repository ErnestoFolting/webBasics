const axios = require('axios');
const https = require('https');
let data = JSON.stringify({
  "username": "User2",
  "password": "Password123"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://localhost:7006/login',
  headers: { 
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
