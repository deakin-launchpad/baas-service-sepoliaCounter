pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

contract Counter {

    uint public counter;

    event CounterIncreased(uint value);
    event CounterDecreased(uint value);

    function increaseCounter() public returns(uint) {
        counter = counter + 1;
        emit CounterIncreased(counter);
        return counter;
    }

    function decreaseCounter() public returns(uint) {
        counter = counter - 1;
        emit CounterDecreased(counter);
        return counter;
    }

}