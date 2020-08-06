pragma solidity ^0.4.24;

import "./DefaultSTO.sol";
import "../interfaces/ICheckRAC.sol";
import "../interfaces/IAddRAC.sol";
import "../modules/DataType.sol";

/**
 * @title Proxy for deploying STO instances
 */
contract DefaultSTOFactory is DataType {

    address public racRegistry;

    event CreateSTO(bytes32 indexed _tranche, address indexed _sto, address indexed _securityToken);

    // Constructor
    constructor (address _racRegistry) public
    {
        racRegistry = _racRegistry;
    }

    /**
    * @dev modifier to scope access to a single role (uses msg.sender as addr)
    * @param _action the name of the role
    */
    modifier onlyRole(string _action)
    {
        require(racRegistry != address(0), "RAC does not Register");
        require(ICheckRAC(racRegistry).check(msg.sender, stringToBytes32(_action)), "Permission deny");
        _;
    }

    /**
     * @notice create the sto.
     * PARAMS:
     * @param _tranche special tranche
     * @param _paused value: false or true
     * @param _addresses value: [_fundRaiseToken, _fundsReceiver]
     * @param _values  value: [_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]
     */
    function create(address _securityToken, bytes32 _tranche, bool _paused, address[] _addresses, uint256[] _values) external onlyRole('createSTO') returns (address) {
        require(_addresses.length == 2, "invalid _addresses");
        require(_values.length == 8, "invalid _values");
        address newAddress = new DefaultSTO(_securityToken, _tranche, _paused, _addresses, _values);

        IAddRAC(racRegistry).addRole(newAddress, stringToBytes32("mint"));

        emit CreateSTO(_tranche, newAddress, _securityToken);
        return newAddress;
    }
}
