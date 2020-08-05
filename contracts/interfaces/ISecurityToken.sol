pragma solidity ^0.4.24;
interface ISecurityToken {
    /**
     * @notice Returns the investor count
     * @return Investor count
     */
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    function transferFrom(address from, address to, uint256 value) public returns (bool);

    function sendTranche(bytes32 _tranche, address _to, uint256 _value, bytes _data) public returns (bool success);
    function getInvestorCount(bytes32 _tranche) external view returns(uint256);
    function getDecimals() external view returns(uint256);
    function getTrancheTotalSupply(bytes32 _tranche) external view returns (uint256);
    function balanceOfTranche(bytes32 _tranche, address _owner) external view returns (uint256);
    function mint(address _investor, uint256 _value) public returns (bool success);
    function mintTranche(bytes32 _tranche, address _investor, uint256 _value, bytes _data) public returns (bool success);
    function getInvestorDefaultTranche(address _owner) public view returns (bytes32);
}