import "dotenv/config";
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions.js";
const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
import { respondToServer } from "../../helpers/helperFunctions.js";
import Web3 from 'web3'; // Ethereum Interaction facilitator
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const artifacts = require('../../contracts/Counter.json'); // ABI

// Setup
const provider = new Web3.providers.WebsocketProvider(process.env.SEPOLIA_RPC);
const web3 = new Web3(provider);
const signer = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY); // Set signer from private key
web3.eth.accounts.wallet.add(signer);
const contract = new web3.eth.Contract(artifacts.abi, process.env.CONTRACT_ADDRESS); // Set contract address

/**
 * @param {Object} payloadData
 * @param {Function} callback
 */
const decreaseCounter = (payloadData, callback) => {
	let counterValue;
	const tasks = {
		callDecreaseCounter: async (cb) => {
			try {
				const tx = contract.methods.decreaseCounter();
				const receipt = await tx
					.send({
						from: signer.address,
						gas: await tx.estimateGas(),
					})
					.once("transactionHash", (txhash) => {
						console.log(`Mining transaction ...`);
						console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
					})
					.once("receipt", (receipt) => {
						console.log(`Transaction mined!`);
					});

				counterValue = receipt.events.CounterDecreased.returnValues.value;
			} catch (err) {
				console.log(err);
				cb(ERROR.APP_ERROR);
			}
		}
	};
	async.series(tasks, (err, result) => {
		let returnData;
		if (err || !counterValue) {
			// respond to server with error
			returnData = null;
		} else {
			// respond to server with success
			returnData = { result: counterValue };
		}
		respondToServer(payloadData, returnData, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		});
	});
};

export default decreaseCounter;
