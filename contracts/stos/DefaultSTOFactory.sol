pragma solidity ^0.4.24;

import "./DefaultSTO.sol";

/**
 * @title Proxy for deploying STO instances
 */
contract DefaultSTOFactory  {

    event CreateSTO(bytes32 indexed _tranche, address indexed _sto, address indexed _securityToken);

    /**
     * @notice create the sto.
     * PARAMS:
     * @param _tranche special tranche
     * @param _paused value: false or true
     * @param _addresses value: [_fundRaiseToken, _fundsReceiver]
     * @param _values  value: [_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]
     */
    function create(address _securityToken, bytes32 _tranche, bool _paused, address[] _addresses, uint256[] _values) external returns (address) {
        require(_addresses.length == 2, "invalid _addresses");
        require(_values.length == 8, "invalid _values");
        address newAddress = new DefaultSTO(_securityToken);
        DefaultSTO(newAddress).configure(_tranche, _paused, _addresses, _values);
        emit CreateSTO(_tranche, newAddress, _securityToken);
        return newAddress;
    }
}
