import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { EventsService } from './events.service';

interface ContractEvent extends ethers.Log {
  log: {
    transactionHash: string;
    blockNumber: number;
  };
}

@Injectable()
export class EventListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventListenerService.name);
  private provider: ethers.WebSocketProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit(): Promise<void> {
    const wsUrl = this.configService.get<string>('WS_URL');
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    if (!wsUrl || !contractAddress) {
      throw new Error(
        'Missing WS_URL or CONTRACT_ADDRESS in environment variables',
      );
    }

    try {
      this.provider = new ethers.WebSocketProvider(wsUrl);
      const network = await this.provider.getNetwork();
      this.logger.log(`[SYSTEM] Connected to ${network.name} network`);

      const ERC4626_ABI = [
        'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
        'event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
      ];

      this.contract = new ethers.Contract(
        contractAddress,
        ERC4626_ABI,
        this.provider,
      );
      this.setupEventListeners();

      this.logger.log(`[SYSTEM] Monitoring vault at ${contractAddress}`);
    } catch (error) {
      this.logger.error(
        `[ERROR] Initialization failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  private formatAmount(amount: bigint, decimals: number = 18): string {
    const value = ethers.formatUnits(amount, decimals);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(Number(value));
  }

  private setupEventListeners(): void {
    if (!this.contract) return;

    void this.contract.on(
      'Deposit',
      (
        caller: string,
        owner: string,
        assets: bigint,
        shares: bigint,
        event: ContractEvent,
      ) => {
        const timestamp = new Date().toISOString();
        const txHash = event.log?.transactionHash ?? 'pending';
        const blockNumber = event.log?.blockNumber ?? 0;

        this.logger.log(`
[DEPOSIT] ${timestamp}
├─ Transaction ID: ${txHash}
├─ Initiator: ${caller}
├─ Beneficiary: ${owner}
├─ Asset Amount: ${this.formatAmount(assets)} TRUST
├─ Share Amount: ${this.formatAmount(shares)} Vault Shares
└─ Block: ${blockNumber}
`);

        void this.eventsService
          .saveDeposit(
            caller,
            owner,
            assets.toString(),
            shares.toString(),
            blockNumber,
          )
          .catch((error) => {
            this.logger.error(
              `[ERROR] Failed to save deposit event: ${
                error instanceof Error ? error.message : String(error)
              }`,
            );
          });
      },
    );

    void this.contract.on(
      'Withdraw',
      (
        caller: string,
        receiver: string,
        owner: string,
        assets: bigint,
        shares: bigint,
        event: ContractEvent,
      ) => {
        const timestamp = new Date().toISOString();
        const txHash = event.log?.transactionHash ?? 'pending';
        const blockNumber = event.log?.blockNumber ?? 0;

        this.logger.log(`
[WITHDRAWAL] ${timestamp}
├─ Transaction ID: ${txHash}
├─ Initiator: ${caller}
├─ Owner: ${owner}
├─ Recipient: ${receiver}
├─ Asset Amount: ${this.formatAmount(assets)} TRUST
├─ Share Amount: ${this.formatAmount(shares)} Vault Shares
└─ Block: ${blockNumber}
`);

        void this.eventsService
          .saveWithdraw(
            caller,
            receiver,
            owner,
            assets.toString(),
            shares.toString(),
            blockNumber,
          )
          .catch((error) => {
            this.logger.error(
              `[ERROR] Failed to save withdrawal event: ${
                error instanceof Error ? error.message : String(error)
              }`,
            );
          });
      },
    );
  }

  onModuleDestroy(): void {
    void this.provider?.destroy();
  }
}
