import { SendPromptData, SuggestionObj } from "suggestionTypes";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  ai_response: (data: {
    id: string;
    response: any;
  }) => void;
  // ai_response: (data: SuggestionObj[]) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  send_prompt: (args: SendPromptData) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
