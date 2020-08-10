const router = require('koa-router')()
var config = require('../config')
var BaseService = require('../services/BaseService')

let data = {
    httpProvider: config.httpProvider
}

router.get('/', async (ctx, next) => {
    ctx.redirect('/dashboard');
})


router.get('/dashboard', async (ctx, next) => {
    await ctx.render('dashboard', data)
})

router.get('/intro', async (ctx, next) => {
    await ctx.render('intro', data)
})

router.get('/metamask', async (ctx, next) => {
    await ctx.render('metamask', data)
})

router.get('/getBalance', async (ctx, next) => {
    await ctx.render('getBalance', data)
})

router.get('/getAccount', async (ctx, next) => {
    await ctx.render('getAccount', data)
})

router.get('/sign', async (ctx, next) => {
    await ctx.render('sign', data)
})

//st
router.get('/createST', async (ctx, next) => {
    await ctx.render('createST', data)
})
router.get('/approve', async (ctx, next) => {
    await ctx.render('approve', data)
})
router.get('/authorizeOperator', async (ctx, next) => {
    await ctx.render('authorizeOperator', data)
})
router.get('/changePolicyRegistry', async (ctx, next) => {
    await ctx.render('changePolicyRegistry', data)
})
router.get('/registryPolicy', async (ctx, next) => {
    await ctx.render('registryPolicy', data)
})
router.get('/getPolicy', async (ctx, next) => {
    await ctx.render('getPolicy', data)
})
router.get('/balanceOf', async (ctx, next) => {
    await ctx.render('balanceOf', data)
})
router.get('/balanceOfTranche', async (ctx, next) => {
    await ctx.render('balanceOfTranche', data)
})
router.get('/mint', async (ctx, next) => {
    await ctx.render('mint', data)
})
router.get('/batchMint', async (ctx, next) => {
    await ctx.render('batchMint', data)
})
router.get('/mintTranche', async (ctx, next) => {
    await ctx.render('mintTranche', data)
})

//gp
router.get('/modifyWhiteList', async (ctx, next) => {
    await ctx.render('modifyWhiteList', data)
})

//gp
router.get('/batchModifyWhitelist', async (ctx, next) => {
    await ctx.render('batchModifyWhitelist', data)
})

//sto
router.get('/getSTOSecurityToken', async (ctx, next) => {
    await ctx.render('getSTOSecurityToken', data)
})
router.get('/createSTO', async (ctx, next) => {
    await ctx.render('createSTO', data)
})
router.get('/configureSTO', async (ctx, next) => {
    await ctx.render('configureSTO', data)
})
router.get('/buy', async (ctx, next) => {
    await ctx.render('buy', data)
})
router.get('/buyWithToken', async (ctx, next) => {
    await ctx.render('buyWithToken', data)
})

//rac
router.get('/checkRole', async (ctx, next) => {
    await ctx.render('checkRole', data)
})
router.get('/addRole', async (ctx, next) => {
    await ctx.render('addRole', data)
})
router.get('/batchAddRole', async (ctx, next) => {
    await ctx.render('batchAddRole', data)
})
router.get('/removeRole', async (ctx, next) => {
    await ctx.render('removeRole', data)
})
router.get('/batchRemoveRole', async (ctx, next) => {
    await ctx.render('batchRemoveRole', data)
})

module.exports = router
