pragma solidity ^0.4.24;

import "./SecurityToken.sol";

/**
 * @title Proxy for deploying SecurityToken instances
 */
contract SecurityTokenFactory  {

    event Create(address indexed _securityToken, string _symbol, uint256 _timestamp);

    /**
     * @notice create the token and adds default policy like the GeneralPolicy.
     * Future versions of the proxy can attach different policy or pass different parameters.
     */
    function create(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint256 _granularity,
        address _policyRegistry
    ) external returns (address) {
        address newAddress = new SecurityToken(
            _name,
            _symbol,
            _decimals,
            _granularity,
            _policyRegistry
        );

        emit Create(newAddress, _symbol, now);
        return newAddress;
    }
}
