pragma solidity ^0.4.24;

import "../interfaces/IPolicy.sol";
import "../interfaces/ISecurityToken.sol";
import "../libraries/SafeMath.sol";
import "../modules/Pausable.sol";
import "../modules/Versionable.sol";
import "../modules/RAC.sol";

contract GeneralPolicy {
    using SafeMath for uint256;

    uint8 public version = 1;
    string public name = "SecurityTokenPolicy";
    address public securityToken;

    //from and to timestamps that an investor can transfer tokens respectively
    struct Restriction {
        uint256 fromTime;
        uint256 toTime;
        uint256 expiryTime;
        bool canTransfer;
    }


    // An address can only transfer tokens once their corresponding uint256 > block.number
    // (unless allowAllTransfers == true or allowAllWhitelistTransfers == true)
    // (investor, tranche, Restriction)
    mapping (address => mapping (bytes32 => Restriction)) public whitelist;
    // The maximum number of concurrent token holders
    mapping (bytes32 => uint256) public maxHolderCount;
    // Maximum percentage that any holder can have
    mapping (bytes32 => uint256) public maxHolderPercentage;


    // Emit when investor details get modified related to their whitelisting
    event ModifyWhitelist(
        bytes32 _tranche,
        address _investor,
        uint256 _fromTime,
        uint256 _toTime,
        uint256 _expiryTime,
        bool _canTransfer,
        address _addedBy,
        uint256 _timestamp
    );

    event ConfigHolder(bytes32 _tranche, uint256 _oldHolderCount, uint256 _newHolderCount, uint256 _oldHolderPercentage, uint256 _newHolderPercentage);
    event Error(string _name, uint256 _errcode, string _errmsg);

    // Constructor
    constructor (address _securityToken) public
    {
        securityToken = _securityToken;
    }

    function checkTransfer(bytes32 _tranche, address _from, address _to, uint256 _amount, bytes _data) public returns(bool) {
        require(_checkWhileList(_tranche, _from, _to), "checkWhileList fail");
//        require(_checkCount(_tranche, _from, _to), "checkCount fail");
//        require(_checkPercentage(_tranche, _from, _to, _amount), "checkPercentage");
        return true;
    }

    function checkMint(bytes32 _tranche, address _to, uint256 _amount, bytes _data) public returns(bool) {
        require(whitelist[_to][_tranche].expiryTime >= now);
        return true;
    }

    function checkChangeTranche(address _owner, bytes32 _from, bytes32 _to, uint256 _amount, bytes _data) public returns(bool) {
        return true;
    }

    /**
    * @notice Adds or removes addresses from the whitelist.
    * @param _investor is the address to whitelist
    * @param _fromTime is the moment when the sale lockup period ends and the investor can freely sell his tokens
    * @param _toTime is the moment when the purchase lockup period ends and the investor can freely purchase tokens from others
    * @param _expiryTime is the moment till investors KYC will be validated. After that investor need to do re-KYC
    * @param _canTransfer is used to know whether the investor is restricted investor or not.
    */
    function modifyWhitelist(
        bytes32 _tranche,
        address _investor,
        uint256 _fromTime,
        uint256 _toTime,
        uint256 _expiryTime,
        bool _canTransfer
    )
    public
    {
        //Passing a _time == 0 into this function, is equivalent to removing the _investor from the whitelist
        whitelist[_investor][_tranche] = Restriction(_fromTime, _toTime, _expiryTime, _canTransfer);
        /*solium-disable-next-line security/no-block-members*/
        emit ModifyWhitelist(_tranche, _investor, _fromTime, _toTime, _expiryTime, _canTransfer, msg.sender, now);
    }


    /**
    * @notice Adds or removes addresses from the whitelist.
    * @param _investors List of the addresses to whitelist
    * @param _fromTimes An array of the moment when the sale lockup period ends and the investor can freely sell his tokens
    * @param _toTimes An array of the moment when the purchase lockup period ends and the investor can freely purchase tokens from others
    * @param _expiryTimes An array of the moment till investors KYC will be validated. After that investor need to do re-KYC
    * @param _canTransfer An array of boolean values
    */
    function batchModifyWhitelist(
        bytes32[] _tranches,
        address[] _investors,
        uint256[] _fromTimes,
        uint256[] _toTimes,
        uint256[] _expiryTimes,
        bool[] _canTransfer
    ) public {
        require(_investors.length == _tranches.length, "Mismatched input lengths");
        require(_investors.length == _fromTimes.length, "Mismatched input lengths");
        require(_fromTimes.length == _toTimes.length, "Mismatched input lengths");
        require(_toTimes.length == _expiryTimes.length, "Mismatched input lengths");
        require(_canTransfer.length == _toTimes.length, "Mismatched input length");
        for (uint256 i = 0; i < _investors.length; i++) {
            modifyWhitelist(_tranches[i], _investors[i], _fromTimes[i], _toTimes[i], _expiryTimes[i], _canTransfer[i]);
        }
    }

    function _checkWhileList(bytes32 _tranche, address _from, address _to) internal returns(bool) {
        if(!whitelist[_from][_tranche].canTransfer) {
            emit Error("checkWhileList", 1, '_from canTransfer false');
            return false;
        }
        if(whitelist[_from][_tranche].fromTime > now) {
            emit Error("checkWhileList", 2, '_from fromTime > now');
            return false;
        }
        if(whitelist[_from][_tranche].expiryTime < now) {
            emit Error("checkWhileList", 3, '_from expiryTime < now');
            return false;
        }

        if(whitelist[_to][_tranche].toTime > now) {
            emit Error("checkWhileList", 4, '_to toTime > now');
            return false;
        }

        if(whitelist[_to][_tranche].expiryTime < now) {
            emit Error("checkWhileList", 5, '_to expiryTime < now');
            return false;
        }

        return true;
    }

    /**
    * @notice config holders there can be
    * @param _maxHolderCount is the new maximum amount of token holders
    * @param _maxHolderPercentage is the new maximum percentage (0~100)
    */
    function configHolder(bytes32 _tranche, uint256 _maxHolderCount, uint256 _maxHolderPercentage) public {
        emit ConfigHolder(_tranche, maxHolderCount[_tranche], _maxHolderCount, maxHolderPercentage[_tranche], _maxHolderPercentage);
        maxHolderCount[_tranche] = _maxHolderCount;
        maxHolderPercentage[_tranche] = _maxHolderPercentage;
    }


    function _checkCount(bytes32 _tranche, address _from, address _to) internal returns(bool) {
        // Allow transfers to existing maxHolders
        if (ISecurityToken(securityToken).balanceOfTranche(_tranche, _to) != 0) {
            return true;
        }
        if (maxHolderCount[_tranche] >= ISecurityToken(securityToken).getInvestorCount(_tranche)) {
            return true;
        }

        emit Error("checkCount", 1, 'over maxHolderCount');
        return false;
    }


    function _checkPercentage(bytes32 _tranche, address _from, address _to, uint256 _amount) internal returns(bool) {
        uint256 newBalance = ISecurityToken(securityToken).balanceOfTranche(_tranche, _to).add(_amount);
        uint256 trancheTotalSupply = ISecurityToken(securityToken).getTrancheTotalSupply(_tranche);
        // if decimals is 18 then multiplied by 10**16 - e.g. 20% is 20 * 10**16
        if (newBalance.mul(uint256(10)**18).div(trancheTotalSupply) <= maxHolderPercentage[_tranche].mul(uint256(10)**16)) {
            return true;
        }

        emit Error("checkPercentage", 1, 'newBalance.mul(uint256(10)**18).div(trancheTotalSupply) <= maxHolderPercentage[_tranche].mul(uint256(10)**16)');
        return false;
    }

}
