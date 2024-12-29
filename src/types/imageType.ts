// Type Definitions for Responses
interface Image {
  image: string;
}

interface ImageRespondError {
  message: string;
  status: number;
}

interface ImageRespondSuccess {
  message: string;
  uri: string;
  public_id: string;
  status: number;
}
