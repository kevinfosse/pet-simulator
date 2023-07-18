const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

app.use(cors());
app.get('/api/', (req, res) => {
    res.send('Work!');
  });

  app.get('/api/hello', (req, res) => {
    res.json('Hello');
  });


  const port = process.env.API_PORT;
  if(process.env.API_PORT) {
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
}

module.exports = app;
