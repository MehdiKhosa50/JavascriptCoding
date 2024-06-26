const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const {v4 : uuidv4} =require('uuid');
const nodeAddress = uuidv4().split('-').join();

const port = process.argv[2];

const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

app.get('/createNewBlock', function (req, res) {
  res.send(bitcoin);
});

app.post('/createNewTransaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransactions(req.body.amount, req.body.sender, req.body.receiver);
    res.json({ note: `The new transaction has been added to block ${blockIndex}` });
});

app.get('/mine' , function(req,res){
  const lastblock = bitcoin.getLastBlock();
  const previousBlockHash = lastblock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastblock.index+1
  }
  const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
  const blockHash = bitcoin.createHashBlock(previousBlockHash,currentBlockData,nonce);
  bitcoin.createNewTransactions(100,"000000",nodeAddress);
  const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);
  res.json({
    note: "The new Block has been Mined Successfully!",
    block: newBlock
  });
});

app.get('/wallet', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/wallet', function (req, res) {
    const blockIndex = bitcoin.createNewTransactions(req.body.amount, req.body.sender, req.body.receiver);
    res.json({ note: `The new transaction has been added to block ${blockIndex}` });
});
app.listen(port,function(){
    console.log(`Server is Running in ${port}`);
});