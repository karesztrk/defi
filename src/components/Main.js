import React from 'react';
import dai from '../dai.png';

const Main = ({
  daiTokenBalance,
  dappTokenBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
}) => {
  const staking = window.web3.utils.fromWei(stakingBalance, 'Ether');
  const dappTokens = window.web3.utils.fromWei(dappTokenBalance, 'Ether');
  const balance = window.web3.utils.fromWei(daiTokenBalance, 'Ether');
  const onSubmit = (e) => {
    e.preventDefault();
    stakeTokens(window.web3.utils.toWei(e.target[0].value.toString(), 'Ether'));
  };
  const onUnstake = (e) => {
    unstakeTokens();
  };
  return (
    <div id='content' clasName='mt-3'>
      <table className='table table-borderless text-muted text-center'>
        <thead>
          <tr>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{staking}&nbsp;mDAI</td>
            <td>{dappTokens}&nbsp;DAPP</td>
          </tr>
        </tbody>
      </table>

      <div className='card mb-4'>
        <div className='card-body'>
          <form className='mb-3' onSubmit={onSubmit}>
            <div>
              <label className='float-left'>
                <b>Stake Tokens</b>
              </label>
              <span className='float-right text-muted'>Balance: {balance}</span>
            </div>
            <div className='input-group mb-4'>
              <input
                type='text'
                className='form-control form-control-lg'
                placeholder='0'
                required
              />
              <div className='input-group-append'>
                <div className='input-group-text'>
                  <img src={dai} height='32' alt='' />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block btn-lg'>
              STAKE!
            </button>
          </form>
          <button
            type='submit'
            className='btn btn-link btn-block btn-sm'
            onClick={onUnstake}
          >
            UN-STAKE...
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
