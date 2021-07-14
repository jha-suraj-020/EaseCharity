// import web3 from './web3';
// import CampaignFactory from './build/CampaignFactory.json';

// const instance = new web3.eth.Contract(CampaignFactory.abi,'0x1ea225927b5d57427A070c862d22F5c14dE3C6dd');

// export default instance;

//below code is the updated version using Infura API

import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi,'0x2DF5652699E57cC041C80d7ab52dF9e50facd7D1');

export default instance;