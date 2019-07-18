const EC = require ('elliptic').ec;//installed elleptic for generating public and private keys
const ec = new EC('secp256k1');//used by bitcoin //Standards for Efficient Cryptography


//Private Key
const myKey = ec.keyFromPrivate('8b161f2530a41a0f7dc1ab63a3af0c6ac43f1901262c033c5374383f6f07d2b0');

//Wallet address Public Address
const myWalletAddress = myKey.getPublic('hex');


const {BlockChain, Transaction} = require('./blockchain');
//BlockChain
let Ruto = new BlockChain(); //name of the coin and Chain starts here

//Transaction One
const Transaction_1 = new Transaction(myWalletAddress,'input public key here',50);

//Signing Transaction
Transaction_1.signTransaction(myKey);

//adding Transaction to the Chain
Ruto.addTransaction(Transaction_1);

//Ruto.createTransaction(new Transaction("Gaurav","Nikita",50));
//Ruto.createTransaction(new Transaction("Nikita","Gaurav",25));
console.log('Mining has been started');
Ruto.minePendingTransactions(myWalletAddress);//sending mining reward to address
console.log("Balance of Rewards is ",Ruto.getBalanceOfAddress(myWalletAddress));
//console.log("Wait for your reward untill next block is mined"); 
//Ruto.minePendingTransactions(myWalletAddress);
//console.log("Balance of rewards is ",Ruto.getBalanceOfAddress(myWalletAddress));
//console.log("Minning Block 1");
//Ruto.addBlock(new Block(1, "12/12/2018", 100)); //adding data to the chain
//console.log("Minning Block 2");
//Ruto.addBlock(new Block(2, "18/12/2018", 200));
console.log(Ruto.isChainValid());
Ruto.chain[1].transactions[0].amount=10;
console.log(Ruto.isChainValid());
//Ruto.chain[1].data = 50;//changing data to verify
//Ruto.chain[1].hash = Ruto.chain[1].calculateHash();//calculating hash after change
//Ruto.isChainValid();
//console.log(JSON.stringify(Ruto," ",1));
