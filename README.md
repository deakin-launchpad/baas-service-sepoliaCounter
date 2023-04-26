# Baas-service-boilerplate
This is a very simple Node Express application that serves as a counter service. This service provides routes to interact with the counter contract deployed on the Sepolia testnet.

## Other BaaS services we offer.

There are also other baas services that we have developed. These include:

- [Mint NFT](https://github.com/deakin-launchpad/baas-service-mintNFT)

- [Local Counter](https://github.com/deakin-launchpad/baas-service-localCounter)

- [Voting](https://github.com/deakin-launchpad/baas-service-createVoting)

- [Company](https://github.com/deakin-launchpad/baas-service-createcompany)

There will be many more to come!

## Pre-requisite

- [Nodejs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)

## Setup Node.js

In order to setup NodeJS you need to fellow the current steps:

### Mac OS X

- Step1: Install Home brew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

$ brew -v
```

- Step2: Install Node using Brew

```
$ brew install node

$ node -v

$ npm -v
```

### Linux Systems

- Step1: Install Node using apt-get

```
$ sudo apt-get install curl python-software-properties

$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

$ sudo apt-get install nodejs

$ node -v

$ npm -v
```

## Setup Service
This is the Sepolia Counter service. There are two routes available through this service. These are:
```
1. /api/demo/increase_counter

2. /api/demo/decrease_counter
```

To run the service, simply follow these steps:
- Step1: Clone this repository
```
$ git clone https://github.com/deakin-launchpad/baas-service-sepoliaCounter

$ cd baas-service-sepoliaCounter
```

- Step2: Install node modules

```
$ npm i

or

$ npm install
```

- Step3: Copy .env.example to .env

```
$ cp .env.example .env
```

- Step4: Start the application

```
$ npm run start
```

or to start in dev mode

```
$ npm run startWithNodemon
```

The current version of your application would be running on **http://localhost:8080** or **http://IP_OF_SERVER:8080** (in case you are running on the server)

## Setup Node User Onboarding Application

This is another application that is required to interact with services like this

- Step1: Git clone the application

```
$ git clone https://github.com/deakin-launchpad/baas_backend

$ cd baas_backend
```

- Step2: Install node modules

```
$ npm i

or

$ npm install
```

- Step3: Copy .env.example to .env

```
$ cp .env.example .env
```

- Step4: Start the application

```
$ npm run start
```

or to start in dev mode

```
$ npm run startWithNodemon
```

The current version of your application would be running on **http://localhost:8080** or **http://IP_OF_SERVER:8080** (in case you are running on the server)

## Further Documentation

This service uses the **Sepolia testnet**. A simple counter contract has been developed and deployed to the testnet at address: **0x785B548D3d7064F77A26e479AC7847DBCE0c1B46**

We are currently using **web3** and **Infura** to interact with the contract. You need to have an account with Infura if you are using the same.

In the .env file, insert your Infura API key at the end of the **SEPOLIA_RPC** value. Example: **wss://sepolia.infura.io/ws/v3/INFURA_API_KEY**

We are using the **websocket secure (wss)** protocol to connect instead of https due to some connection issues that arise when using https.  

Since the service needs an account to interact with the contract, create an Ethereum account and retrieve the private key for that account. You will need to input this key in the .env file for **PRIVATE_KEY**.

We developed and tested this service's contract using the **Remix IDE** which is a no-setup tool with a GUI for developing smart contracts. You can access this IDE online at: https://remix.ethereum.org/

We used **MetaMask** as our wallet to interact with the contract. More details about MetaMask can be accessed through their website at: https://metamask.io/. They have support for most major browsers through extensions, and have apps for Android and iOS. You can import the Ethereum account you created earlier into MetaMask or you can create a new account.

Once MetaMask is setup, you can change the environment on the Remix IDE to injected provider and use MetaMask.

We used solidity compiler version **0.8.17** and pragma solidity **^0.8.0** for our development of the contract.



Within the source code of this service, there is a file called Counter.json within src/contracts folder. This is the ABI for the contract. This is required to interact with the methods on the contract.

The setup bit at the start of the controller is the most important part of the service. If this fails, the service will not work as expected.

```javascript
// Setup
const provider = new Web3.providers.WebsocketProvider(process.env.SEPOLIA_RPC);
const web3 = new Web3(provider);
const signer = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY); // Set signer from private key
web3.eth.accounts.wallet.add(signer);
const contract = new web3.eth.Contract(artifacts.abi, process.env.CONTRACT_ADDRESS); // Set contract address
```

First, the provider is initiated as a web3 websocketprovider using the Sepolia Infura RPC wss URL.

Next, the signer is initiated using the private key for the account we created earlier. This is how the contract method call transactions are signed.

Lastly, the contract variable is initiated using the JSON ABI and the address of the deployed contract.

Now the contract can be interacted with by using contract.methods.increaseCounter() for example. This creates a transaction object for this contract method call. Then the transaction can be signed and sent using:

``` javascript
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
```

Note here that we haven't specified the gas for the transaction and are using the transaction's estimateGas method to do this for us.

The transactionHash event means that the transaction was successful and is being mined, while the receipt event means that the transaction was mined successfully.

We are using events to get the result of method calls. For example, in this contract we are emitting a CounterIncreased event with a uint value. This value can be accessed in the service code through:

```javascript
counterValue = receipt.events.CounterIncreased.returnValues.value;
```

**Refer to the source code of this repository for further reference on how to create a service to be used with the BAAS platform.**
