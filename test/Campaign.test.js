//const HDWalletProvider = require('truffle-hdwallet-provider');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// const provider = new HDWalletProvider(
// 	'twelve words mnemonic',
// 	'https://rinkeby.infura.io/v3/API_KEY'
// );

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../etherum/build/CampaignFactory.json');
const compiledCampaign = require('../etherum/build/Campaign.json');

let accounts;   //list of accounts ganache provides
let factory;  //refernce to the deployed factory instance
let campaignAddress;   // address where the campaign exists
let campaign;       //actual contract we will be dealing with

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    // this is for deploying new instance of contract
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })       
        .send({ from: accounts[0], gas: '1000000' });
    // above code has the instance of the factory contract

    await factory.methods.createCampaign('100').send({
        from: accounts[1],
        gas: '1000000'
    });
    // created the instace of the campaign, but we only get the trx receipt not the address 

    // to get the address of campaign
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    // give out the first element and assign it to that variable

    //already deployed instructing of its existence to web3
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
        );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('it marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[1],manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[2]
        });

        const isContributer = await campaign.methods.approvers(accounts[2]).call();
        assert(isContributer);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[2]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a amanger to make a payment request', async () => {
        await campaign.methods
         .createRequest('buy batteries', '1000', accounts[1])
         .send({
            from: accounts[1],
            gas: '1000000'
         });

         const request = await campaign.methods.requests(0).call();

         assert.strictEqual('buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods
        .createRequest('A', web3.utils.toWei('5','ether'), accounts[3])
        .send({
            from: accounts[1], gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[2], gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[1], gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[3]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
    });
});