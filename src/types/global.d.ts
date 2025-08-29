// Global type declarations

// Web APIs that might not be available in all browsers
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;
  var Activity: any;
}

export {};