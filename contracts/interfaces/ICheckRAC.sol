pragma solidity ^0.4.24;

contract ICheckRAC {
    function check(address _operator, bytes32 _action) public view returns (bool);
}
