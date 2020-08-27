pragma solidity ^0.4.24;

import "./interfaces/IPolicy.sol";

contract PolicyRegistry {

    // (sender/securityTokenAddress, tranche, policy)
    mapping (address => mapping (bytes32 => address)) public policies;

    // Emit when the policy gets registered on the PolicyRegistry contract
    event Registered(address indexed _sender, bytes32 _tranche, address indexed _old, address indexed _new);

    // Constructor
    constructor () public
    {

    }

    /**
     * @notice register new policy for SecurityTokens to use
     * @param _policy is the address of the security policy to be registered
     */
    function register(bytes32 _tranche, address _policy) external returns(bool) {
        policies[msg.sender][_tranche] = _policy;
        emit Registered(msg.sender, _tranche, policies[msg.sender][_tranche], _policy);
        return true;
    }


    function checkTransfer(bytes32 _tranche, address _from, address _to, uint256 _amount, bytes _data) public returns(bool) {
        return IPolicy(policies[msg.sender][_tranche]).checkTransfer(_tranche, _from, _to, _amount, _data);
    }

    function checkMint(bytes32 _tranche, address _to, uint256 _amount, bytes _data) public returns(bool) {
        return IPolicy(policies[msg.sender][_tranche]).checkMint(_tranche, _to, _amount, _data);
    }

    function checkBurn(bytes32 _tranche, address _to, uint256 _amount, bytes _data) public returns(bool) {
        return IPolicy(policies[msg.sender][_tranche]).checkBurn(_tranche, _to, _amount, _data);
    }

    function checkChangeTranche(address _owner, bytes32 _from, bytes32 _to, uint256 _amount, bytes _data) public returns(bool) {
        return IPolicy(policies[msg.sender][_to]).checkChangeTranche(_owner, _from, _to, _amount, _data);
    }

}
