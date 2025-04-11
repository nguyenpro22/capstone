import * as signalR from "@microsoft/signalr";

interface PaymentStatus {
  transactionId: string;
  status: boolean;
  amount?: number;
  timestamp?: string;
  message?: string;
}

class PaymentService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.beautify.asia/command-api/PaymentHub", {
        // withCredentials: true, // Optional, if you need cookies/credentials
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      }) // Replace with backend URL
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .withHubProtocol(new signalR.JsonHubProtocol())
      .build();
  }

  public async startConnection(): Promise<void> {
    try {
      await this.connection.start();
      console.log("Connected to Payment Hub");
    } catch (err) {
      console.error("Error connecting to Payment Hub:", err);
      setTimeout(() => this.startConnection(), 5000); // Retry connection
    }
  }

  public async joinPaymentSession(transactionId: string): Promise<void> {
    await this.connection.invoke("JoinPaymentSession", transactionId);
  }

  public async leavePaymentSession(transactionId: string): Promise<void> {
    await this.connection.invoke("LeavePaymentSession", transactionId);
  }

  public onPaymentStatusReceived(callback: (status: boolean) => void): void {
    this.connection.on("ReceivePaymentStatus", callback);
  }
  public async onCancelPaymentSession(transactionId: string): Promise<void> {
    await this.connection.invoke("CancelPaymentSession", transactionId);
  }
}

// Export as singleton instance
export default new PaymentService();