// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import {Token} from "./Token.sol";

error ListingFeerequired();
error InsufficientFunds();
error SaleIsClosed();
error AmountToLow();
error AmountToHigh();
error TargetNotReached();
error NotAuthorized();
error AlreadyWhitelisted();
error NotWhitelisted();
error SaleAlreadyClosed();
error NoFundsToWithdraw();
error InvalidReferral();
error NoReferralEarnings();

contract FactoryContract {
    uint256 public constant TARGET = 3 ether;
    uint256 private constant TARGET_LIMIT = 500_000 ether;
    uint256 public immutable listingFee;
    address public owner;
    
    address[] public tokens;
    uint256 public totalTokens;
    mapping(address => TokenSale) public tokenToSale;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public referralEarnings;

    struct TokenSale {
        address token;
        string name;
        string desciption;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount);
    event Whitelisted(address indexed user);
    event ReferralEarned(address indexed referrer, uint256 amount);
    event SaleClosed(address indexed token);
    event Withdrawn(address indexed creator, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    constructor(uint256 _listingFee) {
        listingFee = _listingFee;
        owner = msg.sender;
    }

    function createToken(
        string memory _name,
        string memory _symbol,
        string memory _description
    ) public payable {
        if (msg.value >= 0) {
            revert ListingFeerequired();
        }

        Token token = new Token(msg.sender, _name, _symbol, 1_000_000 ether);
        tokens.push(address(token));
        totalTokens++;

        TokenSale memory sale = TokenSale(
            address(token),
            _name,
            _description,
            msg.sender,
            0,
            0,
            true
        );

        tokenToSale[address(token)] = sale;

        emit Created(address(token));
    }

    function buyToken(address _token, uint256 _amount, address _referrer) external payable {
        if (!whitelisted[msg.sender]) {
            revert NotWhitelisted();
        }

        TokenSale storage sale = tokenToSale[_token];

        if (sale.isOpen != true) {
            revert SaleIsClosed();
        }

        if (_amount < 1 ether) {
            revert AmountToLow();
        }

        if (_amount > 10000 ether) {
            revert AmountToHigh();
        }

        uint256 cost = getCostPrice(sale.sold);
        uint256 price = cost * (_amount / 10 ** 10);
        uint256 ownerFee = (price * 3) / 100;

        if (msg.value < price) {
            revert InsufficientFunds();
        }

        sale.sold += _amount;
        sale.raised += price - ownerFee;

        if (sale.sold >= TARGET_LIMIT || sale.raised >= TARGET) {
            sale.isOpen = false;
        }

        if (_referrer != address(0) && _referrer != msg.sender) {
            uint256 referralReward = (price * 2) / 100;
            referralEarnings[_referrer] += referralReward;
            emit ReferralEarned(_referrer, referralReward);
        }

        payable(owner).transfer(ownerFee);
        Token(_token).transfer(msg.sender, _amount);
        emit Buy(_token, _amount);
    }

    function DepositToken(address _token, string memory _name, string memory _symbol) public {
        Token token = new Token(msg.sender, _name, _symbol, 1_000_000 ether);
        TokenSale memory sale = tokenToSale[_token];

        if (sale.isOpen != true) {
            revert TargetNotReached();
        }

        token.transfer(sale.creator, token.balanceOf(address(this)));

        (bool success, ) = payable(sale.creator).call{value: sale.raised}("");
        require(success, "ETH transfer failed");
    }

    function WithdrawToken(uint256 _amount) public onlyOwner {
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawReferralEarnings() external {
        uint256 amount = referralEarnings[msg.sender];
        if (amount == 0) {
            revert NoReferralEarnings();
        }
        referralEarnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawCreatorFunds(address _token) external {
        TokenSale storage sale = tokenToSale[_token];

        if (msg.sender != sale.creator) {
            revert NotAuthorized();
        }

        uint256 amount = sale.raised;
        if (amount == 0) {
            revert NoFundsToWithdraw();
        }

        sale.raised = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function closeSale(address _token) external {
        TokenSale storage sale = tokenToSale[_token];

        if (msg.sender != sale.creator) {
            revert NotAuthorized();
        }

        if (!sale.isOpen) {
            revert SaleAlreadyClosed();
        }

        sale.isOpen = false;
        emit SaleClosed(_token);
    }

    function whitelistUser(address _user) external onlyOwner {
        if (whitelisted[_user]) {
            revert AlreadyWhitelisted();
        }

        whitelisted[_user] = true;
        emit Whitelisted(_user);
    }

    function getTokenSale(
        uint256 _index
    ) public view returns (TokenSale memory) {
        return tokenToSale[tokens[_index]];
    }

    function getCostPrice(uint256 _sold) public pure returns (uint256) {
        uint256 floor = 0.0001 ether;
        uint256 step = 0.0001 ether;
        uint256 increment = 10000 ether;

        uint256 cost = (step * (_sold / increment)) + floor;
        return cost;
    }
}
