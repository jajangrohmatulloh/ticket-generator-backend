const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const dbTicket = require('./db-ticket.json');

let dataTicket = dbTicket || [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
  res.json(dataTicket);
});

app.post('/create', (req, res) => {
  const ticketId =
    dataTicket.length == 0
      ? 12000
      : dataTicket[dataTicket.length - 1].ticketId + 1;
  const { packageEvent, name, startDate, finishDate } = req.body;
  const dataTicketNew = {
    ticketId,
    packageEvent,
    startDate,
    finishDate,
    name,
  };

  dataTicket.push(dataTicketNew);
  fs.writeFile(
    './db-ticket.json',
    JSON.stringify(dataTicket),
    'utf-8',
    function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send('data has been saved');
      }
    }
  );
});

app.delete('/', (req, res) => {
  const { ticketIds } = req.body;

  dataTicket.map((val, i) => {
    for (let ticketId of ticketIds) {
      if (val.ticketId == ticketId) {
        dataTicket.splice(i, 1);
      }
    }
  });

  fs.writeFile(
    './db-ticket.json',
    JSON.stringify(dataTicket),
    'utf-8',
    function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
    }
  );

  res.send('Data has been deleted');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
