// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.25;

/**
 * @title IDorgVault
 * @notice Interface for the DorgVault ERC-4626 implementation
 * @dev This interface defines the main functions for interacting with the DorgVault
 * 
 * DEPLOYED INSTANCE: Optimism Sepolia
 * Contract: 0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9
 * Underlying Token: Trust (0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9)
 */
interface IDorgVault {
    /**
     * @notice Event emitted when assets are deposited
     * @param caller The address that initiated the deposit
     * @param owner The address that received the shares
     * @param assets The amount of assets deposited
     * @param shares The amount of shares minted
     */
    event Deposit(
        address indexed caller,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    /**
     * @notice Event emitted when assets are withdrawn
     * @param caller The address that initiated the withdrawal
     * @param receiver The address that received the assets
     * @param owner The address that burned the shares
     * @param assets The amount of assets withdrawn
     * @param shares The amount of shares burned
     */
    event Withdraw(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    /**
     * @notice Returns the address of the underlying token used by the vault
     * @return The ERC20 asset address
     */
    function asset() external view returns (address);

    /**
     * @notice Returns the total amount of underlying assets held by the vault
     * @return The total asset amount
     */
    function totalAssets() external view returns (uint256);

    /**
     * @notice Returns the amount of shares that would be minted for a given amount of assets
     * @param assets The amount of assets to convert
     * @return The amount of shares that would be minted
     */
    function convertToShares(uint256 assets) external view returns (uint256);

    /**
     * @notice Returns the amount of assets that would be withdrawn for a given amount of shares
     * @param shares The amount of shares to convert
     * @return The amount of assets that would be withdrawn
     */
    function convertToAssets(uint256 shares) external view returns (uint256);

    /**
     * @notice Returns the maximum amount of assets that can be deposited for a given user
     * @param receiver The address that would receive the shares
     * @return The maximum amount of assets that can be deposited
     */
    function maxDeposit(address receiver) external view returns (uint256);

    /**
     * @notice Returns a preview of the shares that would be minted for a given deposit
     * @param assets The amount of assets to deposit
     * @return The amount of shares that would be minted
     */
    function previewDeposit(uint256 assets) external view returns (uint256);

    /**
     * @notice Deposits assets into the vault and mints shares to the receiver
     * @param assets The amount of assets to deposit
     * @param receiver The address that will receive the shares
     * @return The amount of shares minted
     */
    function deposit(uint256 assets, address receiver) external returns (uint256);

    /**
     * @notice Returns the maximum amount of shares that can be minted for a given user
     * @param receiver The address that would receive the shares
     * @return The maximum amount of shares that can be minted
     */
    function maxMint(address receiver) external view returns (uint256);

    /**
     * @notice Returns a preview of the assets needed for a given mint of shares
     * @param shares The amount of shares to mint
     * @return The amount of assets needed
     */
    function previewMint(uint256 shares) external view returns (uint256);

    /**
     * @notice Mints shares to the receiver by depositing assets
     * @param shares The amount of shares to mint
     * @param receiver The address that will receive the shares
     * @return The amount of assets deposited
     */
    function mint(uint256 shares, address receiver) external returns (uint256);

    /**
     * @notice Returns the maximum amount of assets that can be withdrawn by a given user
     * @param owner The address that would burn shares
     * @return The maximum amount of assets that can be withdrawn
     */
    function maxWithdraw(address owner) external view returns (uint256);

    /**
     * @notice Returns a preview of the shares needed for a withdrawal of assets
     * @param assets The amount of assets to withdraw
     * @return The amount of shares that would be burned
     */
    function previewWithdraw(uint256 assets) external view returns (uint256);

    /**
     * @notice Withdraws assets from the vault by burning shares
     * @param assets The amount of assets to withdraw
     * @param receiver The address that will receive the assets
     * @param owner The address that will burn shares
     * @return The amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256);

    /**
     * @notice Returns the maximum amount of shares that can be redeemed by a given user
     * @param owner The address that would burn shares
     * @return The maximum amount of shares that can be redeemed
     */
    function maxRedeem(address owner) external view returns (uint256);

    /**
     * @notice Returns a preview of the assets that would be received for a redemption of shares
     * @param shares The amount of shares to redeem
     * @return The amount of assets that would be received
     */
    function previewRedeem(uint256 shares) external view returns (uint256);

    /**
     * @notice Redeems shares for assets from the vault
     * @param shares The amount of shares to redeem
     * @param receiver The address that will receive the assets
     * @param owner The address that will burn shares
     * @return The amount of assets received
     */
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256);
} 