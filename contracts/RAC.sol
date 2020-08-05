pragma solidity ^0.4.24;

/**
 * @title RAC (Role Access Control)
 */
contract RAC {

    //role => operator => permission
    mapping(bytes32=>mapping (address => bool)) permissions;
    //role => action, recommend use bytes32(contract name + function name(...args name))
    mapping(bytes32=>bytes32[]) roles;

    /**
    * check permission
    * @param _operator operator address
    * @param _action the name of the role
    */
//    function check(address _operator, address _action) public view returns (bool) {
//        for (uint256 i = 0; i < groupRoles[operators[_operator]].length; i++) {
//            bytes32 roleId = groupRoles[operators[_operator]][i];
//            if(roles[roleId][_contract][_function]) {
//                return true;
//            }
//        }
//
//        return false;
//    }


}
