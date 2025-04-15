import * as signalR from "@microsoft/signalr";

class PaymentService {
  private connection: signalR.HubConnection;
  private isConnecting: boolean = false;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.beautify.asia/command-api/PaymentHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .withHubProtocol(new signalR.JsonHubProtocol())
      .build();
  }

  public async startConnection(): Promise<void> {
    try {
      // Check if connection is already started or in the process of starting
      if (this.connection.state === signalR.HubConnectionState.Connected) {
        console.log("Already connected to Payment Hub");
        return;
      }
      
      if (this.isConnecting) {
        console.log("Connection to Payment Hub is already in progress");
        return;
      }
      
      // If not in Disconnected state, stop it first
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        console.log(`Stopping connection in state: ${this.connection.state}`);
        await this.connection.stop();
      }
      
      this.isConnecting = true;
      await this.connection.start();
      this.isConnecting = false;
      console.log("Connected to Payment Hub");
    } catch (err) {
      this.isConnecting = false;
      console.error("Error connecting to Payment Hub:", err);
      throw err; // Let the component handle retry if needed
    }
  }

  public async stopConnection(): Promise<void> {
    try {
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        await this.connection.stop();
        console.log("Disconnected from Payment Hub");
      }
    } catch (err) {
      console.error("Error disconnecting from Payment Hub:", err);
    }
  }

  public async joinPaymentSession(transactionId: string): Promise<void> {
    // Ensure connection is active before joining
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      await this.startConnection();
    }
    
    try {
      await this.connection.invoke("JoinPaymentSession", transactionId);
      console.log(`Joined payment session: ${transactionId}`);
    } catch (err) {
      console.error(`Error joining payment session ${transactionId}:`, err);
      throw err;
    }
  }

  public async leavePaymentSession(transactionId: string): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeavePaymentSession", transactionId);
        console.log(`Left payment session: ${transactionId}`);
      } catch (err) {
        console.error(`Error leaving payment session ${transactionId}:`, err);
      }
    }
  }

  public async onCancelPaymentSession(transactionId: string): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("CancelPaymentSession", transactionId);
        console.log(`Cancelled payment session: ${transactionId}`);
      } catch (err) {
        console.error(`Error cancelling payment session ${transactionId}:`, err);
      }
    }
  }

  public onPaymentStatusReceived(callback: (status: boolean, details?: any) => void): void {
    // Remove existing listeners to avoid duplicates
    this.connection.off("ReceivePaymentStatus");
    this.connection.on("ReceivePaymentStatus", callback);
  }

  public onSubscriptionPriceChanged(callback: (isValid: boolean) => void): void {
    // Remove existing listeners to avoid duplicates
    this.connection.off("SubscriptionPriceChanged");
    this.connection.on("SubscriptionPriceChanged", callback);
  }

  public clearListeners(): void {
    this.connection.off("ReceivePaymentStatus");
    this.connection.off("SubscriptionPriceChanged");
  }

  public cleanup(): void {
    this.clearListeners();
    this.stopConnection();
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }
}

// Export as singleton instance
export default new PaymentService();