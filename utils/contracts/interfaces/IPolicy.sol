pragma solidity ^0.4.24;

contract IPolicy {
//    function getName() external view returns (string);
    function checkTransfer(bytes32 _tranche, address _from, address _to, uint256 _amount, bytes _data) public returns(bool);
    function checkMint(bytes32 _tranche, address _to, uint256 _amount, bytes _data) public returns(bool);
    function checkBurn(bytes32 _tranche, address _to, uint256 _amount, bytes _data) public returns(bool);
    function checkChangeTranche(address _owner, bytes32 _from, bytes32 _to, uint256 _amount, bytes _data) public returns(bool);

}
