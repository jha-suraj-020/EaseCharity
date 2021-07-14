const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//first delete the whole build folder
const buildPath = path.resolve(__dirname, 'build');

const createBuildFolder = () => {
    fs.emptyDirSync(buildPath);
}

//const campaignContract = path.resolve(__dirname,'contracts','Campaign.sol');
const contractsFolderPath = path.resolve(__dirname,'contracts');  //possbile for mulitpe contracts

const buildSources = () => {
    const sources = {};
    const contractFiles = fs.readdirSync(contractsFolderPath);

    contractFiles.forEach(file => {
        const contractFullPath = path.resolve(contractsFolderPath, file);
    sources[file] = {
         content: fs.readFileSync(contractFullPath, 'utf8')
     };
    });
    return sources;
}

const input = {
	language: 'Solidity',
	sources: buildSources(),
	settings: {
		outputSelection: {
			'*': {
				'*': [ 'abi', 'evm.bytecode' ]
			}
		}
	}
}

const compileContracts = () => {
    const compiledContracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

    for (let contract in compiledContracts) {
		for(let contractName in compiledContracts[contract]) {
			fs.outputJsonSync(
				path.resolve(buildPath, `${contractName}.json`),
				compiledContracts[contract][contractName],
				{
					spaces: 2
				}
			)
		}
	}
}

(function run () {
	createBuildFolder();
	compileContracts();
})();