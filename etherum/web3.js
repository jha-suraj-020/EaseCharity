// import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// this will do

import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    //we are in the browser and metamask is running
   
        window.web3.currentProvider.enable();
        web3 = new Web3(window.web3.currentProvider);
         
   // web3 = new Web3(window.web3.currentProvider.enable());
}else{
    //wE ARE ON THE server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/0ed46ad4605041dc8340905dbc669663'
    );
    web3 = new Web3(provider); 
};


export default web3;