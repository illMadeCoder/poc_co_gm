export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    ai_response: (data: AiResponseData) => void;
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

export interface SendPromptData {
    id: string;
    prompt: string;
}

export interface AiResponseData {
    id: string;
    response: string | null;
}
