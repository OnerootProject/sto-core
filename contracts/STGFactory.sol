pragma solidity ^0.4.24;

import "./SecurityToken.sol";
import "./policies/GeneralPolicy.sol";


/**
 * @title Proxy for deploying SecurityToken and GeneralPolicy instances
 */
contract STGFactory  {

    address public policyRegistry;

    event CreateSTG(address indexed _securityToken, string _symbol, address indexed _policy, uint256 _timestamp);

    // Constructor
    constructor (address _policyRegistry) public
    {
        policyRegistry = _policyRegistry;
    }

    /**
     * @notice create the token and adds default policy like the GeneralPolicy.
     * Future versions of the proxy can attach different policy or pass different parameters.
     */
    function create(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint256 _granularity
    ) external returns (address) {
        address stAddress = new SecurityToken(
            _name,
            _symbol,
            _decimals,
            _granularity,
            policyRegistry
        );

        address policyAddress = new GeneralPolicy(stAddress);
        SecurityToken(stAddress).registryPolicy(bytes32(keccak256(abi.encodePacked(''))), policyRegistry);
        emit CreateSTG(stAddress, _symbol, policyAddress, now);
        return stAddress;
    }
}
