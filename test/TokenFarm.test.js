const { assert } = require('chai');

require('chai')
.use(require('chai-as-promised'))
.should()

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm;

    before(async () => {
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
        
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));
        // Send to investor
        await daiToken.transfer(investor, tokens('100', { from: owner }))
    })

    describe('Mock Dai deployment', () => {
        it('has a name', async () => {
            const name = await daiToken.name(); 
            assert.equal(name, 'Mock DAI Token');
        })
    })

    describe('Dapp Token deployment', () => {
        it('has a name', async () => {
            const name = await dappToken.name(); 
            assert.equal(name, 'DApp Token');
        })
    })

    describe('Token Farm deployment', () => {
        it('has a name', async () => {
            const name = await tokenFarm.name(); 
            assert.equal(name, 'Dapp Token Farm');
        })

        it('contract has tokens', async () => {
            const balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;
            // Check investor balance before staking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from : investor });
            await tokenFarm.stakeTokens(tokens('100'), { from : investor });

            // Check staking result
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'invesor Mock DAI wallet balance correct after staking');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'invesor staking status correct after staking');

            await tokenFarm.issueTokens({ from: owner });
           
            // Chekc balance after issuance
            result = await dappToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor DApp Tokens wallet balance correct after issuance');

            // Ensure that only owner can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor });

            // Check result after unstaking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking');

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking');
        })
    })
    
})