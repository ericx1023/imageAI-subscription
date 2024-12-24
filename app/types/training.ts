export interface SignedUrlData {
    data: {
      signedUrl: string;
    };
    error: null | string;
  }
  
  export interface TrainingInput {
    urls: SignedUrlData[];
    userId: string;
    modelName: string;
  }
  
  export interface TrainingResponse {
    modelId: string;
    status: string;
  }
  
  export interface TrainingError {
    error: string;
    message: string;
    detail?: string | string[];
  }