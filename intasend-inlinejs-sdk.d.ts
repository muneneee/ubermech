declare module 'intasend-inlinejs-sdk';

// Define types for IntaSend options and event details (if known)
interface IntaSendOptions {
  publicAPIKey: string;
  live: boolean;
}

interface IntaSendCompleteEvent {
  transaction: any; // Replace with actual type if known
}

interface IntaSendFailedEvent {
  error: any; // Replace with actual type if known
}

declare global {
  interface Window {
    IntaSend: (options: IntaSendOptions) => IntaSend; // Replace with actual constructor signature if known
  }
}