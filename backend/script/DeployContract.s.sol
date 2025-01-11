// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {FactoryContract} from "../src/FacotryContract.sol";

contract DeployFactory is Script {

    function run() external {
        uint256 Fee = 0.01 ether;

        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the FactoryContract
        FactoryContract factory = new FactoryContract(Fee);

        // Log the deployed contract address
        console.log("FactoryContract deployed at:", address(factory));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
