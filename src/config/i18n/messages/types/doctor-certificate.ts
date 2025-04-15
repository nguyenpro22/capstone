// Certificates.ts - Kiểu dữ liệu cho Certificates
export interface Certificates {
  certificates: string;
  certificatesDescription: string;
  expiresOn: string;
  expired: string;
  expiringSoon: string;
  valid: string;
  download: string;
  downloadStarted: string;
  certificateDownloading: string;
  noCertificates: string;
  noCertificatesDescription: string;
  errorFetchingCertificates: string;
  tryAgainLater: string;
}
