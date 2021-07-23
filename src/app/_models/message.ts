export interface Message {
    id: number;
    senderUsername: string;
    senderUrl: string;
    senderId: number;
    recipientUsername: string;
    recipientUrl: string;
    recipientId: number;
    content: string;
    messageRead?: Date;
    messageSent: Date;
    senderDeleted: boolean;
    recipientDeleted: boolean;
}