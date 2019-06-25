const SHA256 = require('crypto-js/sha256'); //installed and imported crypto-js library for sha256

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block { //what my block consist of
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }


    calculateHash() { //calculates hash of the block by adding all the data
        return SHA256(this.index + this.previousHash + this.nonce + this.timestamp + JSON.stringify(this.data)).toString();
    }


    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined " + this.hash);
    }

}

class blockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; //array of chains with first genenis block
        this.difficulty = 4;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }


    createGenesisBlock() { //first block of the chain with initial dummy data
        return new Block("22/12/2018", "Genesis Block", "");
    }



    getLatestBlock() { //returns latest block
        return this.chain[this.chain.length - 1];
    }


    minePendingTransactions(miningRewardAddress) { //MINES PENDING TRANSACTIONS
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        block.previousHash = this.getLatestBlock().hash;
        console.log("Block Mined Success!");
        this.chain.push(block);
        this.miningRewardAddress = miningRewardAddress;

        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress, this.miningReward)
        ];
    }
    
    createTransaction(){
        this.pendingTransactions.push(Transaction);
    }
    
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance-= trans.amount;
                }
                if(trans.toAddress === address){
                    balance+=trans.amount;
                }
            }
        }
        return balance;
    }


    isChainValid() { //checks if chain is valid returns bool
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash != currentBlock.calculateHash()) {
                console.log("Not Valid");

            }

            if (currentBlock.previousHash != previousBlock.hash)
                console.log("Not Valid");
            console.log("Valid Now!");
        }
    }



}

let Ruto = new blockChain(); //name of the coin
Ruto.createTransaction(new Transaction("Gaurav","Nikita",50));
Ruto.createTransaction(new Transaction("Nikita","Gaurav",25));
console.log('Mining has been started');
Ruto.minePendingTransactions("ashu-address");
console.log("Balance of Rewards is ",Ruto.getBalanceOfAddress("ashu-address"));
console.log("Wait for your reward untill next block is mined");
Ruto.minePendingTransactions("ashu-address");
console.log("Balance of rewards is ",Ruto.getBalanceOfAddress("ashu-address"));
//console.log("Minning Block 1");
//Ruto.addBlock(new Block(1, "12/12/2018", 100)); //adding data to the chain
//console.log("Minning Block 2");
//Ruto.addBlock(new Block(2, "18/12/2018", 200));
//Ruto.isChainValid();
//Ruto.chain[1].data = 50;//changing data to verify
//Ruto.chain[1].hash = Ruto.chain[1].calculateHash();//calculating hash after change
//Ruto.isChainValid();
//console.log(JSON.stringify(Ruto," ",1));
