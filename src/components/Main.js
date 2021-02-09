
import React from 'react';

import dai from '../dai.png';

const Main = ({
  stakingBalance,
  dappTokenBalance,
  stakeDaiTokens,
  daiTokenBalance,
  unstakeDaiTokens
}) => {
  const inputRef = React.useRef(null);

  const handleSubmit = event => {
    event.preventDefault();

    let amount;
    amount = inputRef.current.value.toString();
    amount = window.web3.utils.toWei(amount, 'Ether');
    stakeDaiTokens(amount);
  };

  const handleUnstakeClick = () => {
    unstakeDaiTokens();
  };

  return (
    <div
      id="content"
      className="mt-3">
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance (at Token Farm)</th>
            <th scope="col">Reward Balance (at my wallet)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{window.web3.utils.fromWei(stakingBalance, 'Ether')} mDAI</td>
            <td>{window.web3.utils.fromWei(dappTokenBalance, 'Ether')} DAPP</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-4" >
        <div className="card-body">
          <form
            className="mb-3"
            onSubmit={handleSubmit}>
            <div>
              <label className="float-left">
                <b>
                  Stake Tokens
                </b>
              </label>
              <span className="float-right text-muted">
                Balance (at my wallet): {window.web3.utils.fromWei(daiTokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={inputRef}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img
                    src={dai}
                    height="32"
                    alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg">
              STAKE!
            </button>
          </form>
          <button
            className="btn btn-link btn-block btn-sm"
            onClick={handleUnstakeClick}>
            UN-STAKE...
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
