const SHA256 = require('crypto-js/sha256');//installed and imported crypto-js library for sha256

class block{//what my block consist of
    constructor(index,timestamp,data,previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){//calculates hash of the block by adding all the data
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();    
    }
}

class blockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];//array of chains with first genenis block
    }
    createGenesisBlock(){//first block of the chain with initial dummy data
        return new block(0,"22/12/2018","Genesis Block","");
    }
    
    getLatestBlock(){//returns latest block
        return this.chain[this.chain.length-1];
    }
    
    addBlock(newBlock){//adds new block
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid(){//checks if chain is valid returns bool
        for(let i = 1; i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash!=currentBlock.calculateHash()){
                console.log("Not Valid");
                
            }
            
            if(currentBlock.previousHash!=previousBlock.hash)
                console.log("Not Valid");
            console.log("Valid Now!");
        }
    }
    
}

let Ruto = new blockChain();//name of the coin
Ruto.addBlock(new block(1,"12/12/2018",100));//adding data to the chain
Ruto.addBlock(new block(2,"18/12/2018",200));
Ruto.isChainValid();
Ruto.chain[1].data = 50;//changing data to verify
Ruto.chain[1].hash = Ruto.chain[1].calculateHash();//calculating hash after change
Ruto.isChainValid();
//console.log(JSON.stringify(Ruto," ",1));