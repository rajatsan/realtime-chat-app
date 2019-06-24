const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')

app.get('/express', (req, res) => {
  res.send({ express: 'Hello' });
});


app.use(express.static(path.join(__dirname, '../client/build')))


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`));