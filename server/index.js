const express = require("express"); 
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0465a4d3f5cf7514f1a0b41fe575062675dcd7bbc6180b7a901d13b43a80ce9f43d9f568c52e2dcaded36958f61fece4050ee48bfcba604a07e6e2a669047934a3": 100,
  "04b087ea1ef5887e20e1271b78073be6de917b69c793b8293a22d7cc6353bc2939b15a3a06b2e503fb47200bf1b55462891b06cf56a191461eeb370fa639faa96e": 50,
  "0413af5d0782f3c82597617805dd1c9095dacd7320ef8d3aa7c38bafbfaef3de23c13c12f99c18b00dae1468036adab8cd5a2b2a6d5fe9dba83c87d6cc9e533a9d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  // TODO: get a signature from the client side application
  // recover the public address from the signature

  const { sender, amount, recipient } = req.body;
  
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
