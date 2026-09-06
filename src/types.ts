export interface Character {
  id: string;
  name: string;
  categories: string[];
  backstory: string;
  openingMessage: string;
  chatLink: string;
  heartsCount: number;
  createdAt: string;
}

export interface Letter {
  id: string;
  author: string;
  content: string;
  theme: string; // 'pink' | 'blue' | 'green' | 'yellow' | 'purple'
  createdAt: string;
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
