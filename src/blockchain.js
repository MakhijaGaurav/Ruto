const SHA256 = require('crypto-js/sha256'); //installed and imported crypto-js library for sha256

const EC = require ('elliptic').ec;//installed elleptic for generating public and private keys
const ec = new EC('secp256k1');//used by bitcoin //Standards for Efficient Cryptography

/**********************/
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    
    calculateHash(){//calculates hash of transaction
        return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
    }
    
    signTransaction(signingKey){//signing Transaction with keys
        if(signingKey.getPublic('hex')!= this.fromAddress){
            throw new Error("You cannot sign this transaction!");
        }
        const hashOfTransaction = this.calculateHash();
        const baseSignature = signingKey.sign(hashOfTransaction,'base64');
        this.signature = baseSignature.toDER('hex');
        
    }
    
    isValid(){//verifies if the transactions are correctly signed includes rewardsTx too
        if(this.fromAddress === null){//null addresses rewards
            //Reward Transaction
            console.log("REWARD TRANSACTION!");
            return true;
        }
        
        if(!this.signature || this.signature.length==0){
            console.log("ERROR! NO SIGNATURE");
            throw new Error("There is no signature in this transaction!");
        }
        
        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature); 
    }
}

/*****************************/
class Block { //what my block consist of
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }


    calculateHash() { //calculates hash of the block by adding all the data
        return SHA256(this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.transactions)).toString();
    }


    mineBlock(difficulty) {//mining-->calculating hashes untill it reaches difficulty
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined " + this.hash);
    }
    
    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid())
                return false;
        }
        return true;
    }

}

/**************************/

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; //array of chains with first genenis block
        this.difficulty = 2;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }


    createGenesisBlock() { //first block of the chain with initial dummy data
        return new Block(Date.parse("22/12/2018"), [], "0");
    }



    getLatestBlock() { //returns latest block
        return this.chain[this.chain.length - 1];
    }


    minePendingTransactions(miningRewardAddress) { //MINES PENDING TRANSACTIONS 
        const rewardOfTransaction = new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardOfTransaction);
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        block.previousHash = this.getLatestBlock().hash;
        console.log("Block Mined Success!");
        this.chain.push(block);
        this.miningRewardAddress = miningRewardAddress;

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction) {//creates transaction live by pushing it into array
        if(!transaction.fromAddress||!transaction.toAddress)
            throw new Error("INVALID! Transaction does not have sender/receiver address");
        
        if(!transaction.isValid())
            throw new Error("ERROR! Cannot add invalid transaction to the chain");
        
        
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {//wallet--> returns balance of wallet address
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    isChainValid() { //checks if chain is valid returns bool
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(!currentBlock.hasValidTransaction()){
                console.log('Invalid State Transaction!');
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(currentBlock.hash);
                console.log(currentBlock.calculateHash());
                console.log("Chain Not Valid! Check Current Hash!");
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                console.log("Chain Not Valid!Blocks are not in order!");
                return false;
            }
            console.log("Chain is Valid!");
            return true;
        }
    }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;