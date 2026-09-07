export interface Character {
  id: string;
  name: string;
  categories: string[];
  backstory: string;
  openingMessage: string;
  chatLink: string;
  heartsCount: number;
  createdAt: string;
  bankBalance?: number;
}

export interface Letter {
  id: string;
  author: string;
  content: string;
  theme: string;
  createdAt: string;
  adminReply?: string;
}

export interface SystemNotification {
  id: string;
  message: string;
  characterId?: string;
  createdAt: string;
}

export interface AppData {
  characters: Character[];
  letters: Letter[];
  notifications: SystemNotification[];
}

export interface PhoneContact {
  id: string;
  name: string;
  avatar: string;
}

export interface PhoneMessage {
  id: string;
  contactId: string;
  sender: "me" | "them";
  text: string;
  timestamp: number;
}

export interface BankTransaction {
  id: string;
  type: "in" | "out";
  amount: number;
  sender: string;
  message: string;
  timestamp: number;
}

export interface Lantern {
  id: string;
  message: string;
  color: string;
  top: string;
  duration: number;
  delay: number;
}

