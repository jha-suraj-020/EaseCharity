const HDWalletProvider = require('truffle-hdwallet-provider');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledFactory = require('../etherum/build/CampaignFactory.json');

// enter the provider part here, ganache or rinkby or infura
// const provider = new HDWalletProvider(
// 	'knee february humble enjoy napkin brother smart tilt viable banner series desert',
// 	'HTTP://127.0.0.1:7545'
// );

//below provider is wrt to Rinkbey rest network
const provider = new HDWalletProvider(
	'skin census tissue focus matter whisper enemy twist hero post lottery aspect',
	'https://rinkeby.infura.io/v3/0ed46ad4605041dc8340905dbc669663'
);

const web3 = new Web3 (provider);

//const compiledCampaign = require('../etherum/build/Campaign.json');

const deploy = async () => {
    accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // this is for deploying new instance of contract
    const factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })       
        .send({ from: accounts[0], gas: '1000000' });
    

    console.log('Contract deployed to', factory.options.address);

    provider.engine.stop();
};  
deploy();