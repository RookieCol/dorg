// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.25;

import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {ERC4626} from "solmate/src/tokens/ERC4626.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";

/**
 * @title DorgVault
 * @author Dorg Developers
 * @notice An ERC-4626 compliant tokenized vault implementation
 * @dev Implementation of a minimal, gas-efficient ERC-4626 vault
 *      with secure asset handling using Solmate's SafeTransferLib
 *
 * This vault allows users to deposit any ERC-20 token and receive shares that
 * represent their proportional ownership of the pooled assets. The vault adheres 
 * to the ERC-4626 standard, ensuring compatibility across DeFi protocols.
 *
 * Key features:
 * - Minimal implementation focused on security and gas efficiency
 * - Dynamic vault name and symbol based on the underlying asset
 * - Protection against common vulnerabilities through SafeTransferLib
 * - Standard-compliant interface for DeFi composability
 *
 * DEPLOYMENT: 
 * - Optimism Sepolia: 0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9
 * - Underlying Token: Trust (0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9)
 */
contract DorgVault is ERC4626 {
    using SafeTransferLib for ERC20;

    /**
     * @notice Initializes the vault with a specified ERC-20 token as the underlying asset
     * @dev Sets up the ERC-4626 vault with auto-generated name and symbol based on asset
     * @param asset_ Address of the ERC-20 token to be wrapped by this vault
     */
    constructor(ERC20 asset_)
        ERC4626(asset_, vaultName(asset_), vaultSymbol(asset_))
    {}

    /**
     * @notice Deposits assets into the vault and mints shares to receiver
     * @dev Overrides ERC4626 deposit with optimized implementation
     * @param assets Amount of assets to deposit
     * @param receiver Address to receive the minted shares
     * @return shares Amount of shares minted to receiver
     */
    function deposit(uint256 assets, address receiver)
        public
        override
        returns (uint256 shares)
    {
        // Calculate shares before transfer to prevent potential exploits
        shares = previewDeposit(assets);
        
        // Transfer assets from sender to vault using SafeTransferLib
        asset.safeTransferFrom(msg.sender, address(this), assets);
        
        // Mint shares to designated receiver
        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    /**
     * @notice Burns shares from owner and sends assets to receiver
     * @dev Overrides ERC4626 withdraw with optimized implementation
     * @param assets Amount of assets to withdraw
     * @param receiver Address to receive the withdrawn assets
     * @param owner Address from which to burn the shares
     * @return shares Amount of shares burned from owner
     */
    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        returns (uint256 shares)
    {
        // Calculate shares before withdrawal to ensure correct accounting
        shares = previewWithdraw(assets);

        // Handle allowance if caller is not the owner
        if (msg.sender != owner) {
            uint256 allowed = allowance[owner][msg.sender];
            if (allowed != type(uint256).max) {
                allowance[owner][msg.sender] = allowed - shares;
            }
        }

        // Burn shares from owner
        _burn(owner, shares);
        
        // Transfer assets to receiver using SafeTransferLib
        asset.safeTransfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }

    /**
     * @notice Returns the total amount of underlying assets held by the vault
     * @dev Implemented as direct balance check for simplicity and accuracy
     * @return Total amount of underlying assets
     */
    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    /**
     * @notice Generates vault token name based on underlying asset symbol
     * @dev Concatenates "Vault-" with the asset symbol
     * @param asset_ The underlying ERC-20 asset
     * @return Dynamically generated vault name
     */
    function vaultName(ERC20 asset_) internal view returns (string memory) {
        return string.concat("Vault-", asset_.symbol());
    }

    /**
     * @notice Generates vault token symbol based on underlying asset symbol
     * @dev Concatenates "v" with the asset symbol
     * @param asset_ The underlying ERC-20 asset
     * @return Dynamically generated vault symbol
     */
    function vaultSymbol(ERC20 asset_) internal view returns (string memory) {
        return string.concat("v", asset_.symbol());
    }
}
