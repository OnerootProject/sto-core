const GeneralPolicy = artifacts.require('./policies/GeneralPolicy.sol')
const PolicyRegistry = artifacts.require('./PolicyRegistry.sol')
const SecurityToken = artifacts.require('./SecurityToken.sol')
const DefaultSTO = artifacts.require('./stos/DefaultSTO.sol')

const STGFactory = artifacts.require('./STGFactory.sol')
const DefaultSTOFactory = artifacts.require('./DefaultSTOFactory.sol')

// Contract Instance Declaration
let iPolicyRegistry;
let iSecurityToken;
let iGeneralPolicy;
let iSTGFactory;
let iDefaultSTOFactory;

/// Function use to launch the security token ecossystem.

module.exports.deploy = async function deploy(owner) {
    await _deployPolicyRegistry(owner);
    await _deploySecurityToken(owner);
    await _deployGeneralPolicy(owner);

    await _registry(owner);

    // Printing all the contract addresses
    console.log(`
        --------------------- Contracts: ---------------------
        PolicyRegistry:        ${iPolicyRegistry.address}
        SecurityToken:         ${iSecurityToken.address}
        GeneralPolicy:         ${iGeneralPolicy.address}
        -----------------------------------------------------------------------------
        `);

    return {
        iGeneralPolicy: iGeneralPolicy,
        iPolicyRegistry: iPolicyRegistry,
        iSecurityToken: iSecurityToken
    }
}

module.exports.deployFactory = async function deploy(owner) {
    await _deployPolicyRegistry(owner);
    await _deploySTGFactory(owner);
    await _deployDefaultSTOFactory(owner);

    // Printing all the contract addresses
    console.log(`
        --------------------- Contracts: ---------------------
        PolicyRegistry:        ${iPolicyRegistry.address}
        STGFactory:             ${iSTGFactory.address}
        DefaultSTOFactory:         ${iDefaultSTOFactory.address}
        -----------------------------------------------------------------------------
        `);

    return {
        iPolicyRegistry: iPolicyRegistry,
        iSTGFactory: iSTGFactory,
        iDefaultSTOFactory: iDefaultSTOFactory
    }
}

module.exports.deploySecurityToken = async function deploySecurityToken(owner, constrParam) {
    return await SecurityToken.new(constrParam.name, constrParam.symbol, constrParam.decimals, constrParam.granularity, constrParam.policyRegistry, { from: owner });
}

module.exports.deployGeneralPolicy = async function deployGeneralPolicy(owner, constrParam) {
    return await SecurityToken.new(constrParam.name, constrParam.symbol, constrParam.decimals, constrParam.granularity, constrParam.policyRegistry, { from: owner });
}

module.exports.deployDefaultSTO = async function deployDefaultSTO(owner, securityToken) {
    return await DefaultSTO.new(securityToken, { from: owner });
}


async function _deployPolicyRegistry(owner) {
    // Step 1
    iPolicyRegistry = await PolicyRegistry.new({ from: owner });
}

async function _deploySecurityToken(owner) {
    // Step 2
    iSecurityToken = await SecurityToken.new('R1 Security Token', 'R1ST', 18, 1,iPolicyRegistry.address, {
        from: owner
    });
}

async function _deployGeneralPolicy(owner) {
    // Step 3
    iGeneralPolicy = await GeneralPolicy.new(iSecurityToken.address, { from: owner });
}

async function _registry(owner) {
    iSecurityToken.registryPolicy('', iGeneralPolicy.address, {from: owner});
}

async function _deploySTGFactory(owner) {
    iSTGFactory = await STGFactory.new(iPolicyRegistry.address, { from: owner });
}

async function _deployDefaultSTOFactory(owner) {
    iDefaultSTOFactory = await DefaultSTOFactory.new({from: owner});
}
