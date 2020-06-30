pragma solidity ^0.6.4;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract tokenSale is Crowdsale {
    KycContract kyc;
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
    Crowdsale(rate, wallet, token) public {
       kyc = _kyc;
    }
    //over ride to this function from crowdSale
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender), "kyc is not completed yet aborting");//if the kyc not completed then aborting
    }
}