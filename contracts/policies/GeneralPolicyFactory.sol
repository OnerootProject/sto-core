pragma solidity ^0.4.24;

import "./GeneralPolicy.sol";

/**
 * @title Proxy for deploying GeneralPolicy instances
 */
contract GeneralPolicyFactory  {

    event CreatePolicy(address indexed newAddress, address indexed securityToken);

    /**
     * @notice deploys the token and adds default policy like the GeneralPolicy.
     * Future versions of the proxy can attach different policy or pass different parameters.
     */
    function deploy(
        address _securityToken
    ) external returns (address) {
        address newAddress = new GeneralPolicy(_securityToken);
        emit CreatePolicy(newAddress, _securityToken);
        return newAddress;
    }
}
