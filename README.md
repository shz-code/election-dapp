# Ethereum DApp for an Election using Truffle, Ganache, and Solidity

This is an example project for building a decentralized application (DApp) for an election on the Ethereum blockchain using *Truffle*, *Ganache*, and *Solidity*.

# Prerequisites
Before you begin, make sure you have the following installed:

- Node.js
- Truffle
- Ganache

# Setup
- Clone this repository to your local machine.
- Install the necessary dependencies by running `npm install` in the project directory.
- Start Ganache. This is necessary for starting a local blockchain network, which can be used for development and testing.
- Compile the smart contracts by running truffle compile. This will compile the Solidity code in the **contracts/** directory.
- Deploy the contracts to the local blockchain network by running truffle migrate. This will deploy the compiled contracts to the local blockchain network.
- Start the development server by running `npm run dev`. This will start the web application on localhost:3000.

# Usage

Once the development server is running, you can interact with the DApp by visiting localhost:3000 in your web browser. The DApp allows users to perform the following actions:

- View the list of candidates in the election. In this example project 2 candidates are listed.
- Vote for a candidate in the election.
- View the total number of votes for each candidate.

# Testing
You can run the test suite by running truffle test. This will run the tests in the **test/** directory.


## Acknowledgements
Inspired from
 - [How to Build Ethereum Dapp](https://youtu.be/3681ZYbDSSk)

# License
This project is licensed under the `MIT License`.