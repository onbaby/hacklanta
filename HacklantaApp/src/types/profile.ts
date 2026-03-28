export interface TopGame {
  name: string;
  icon: string | number;
  rank?: string;
  hours?: string;
  isFavorite?: boolean;
  servers?: string[];
  modes?: string[];
  platforms?: string[];
}

export interface PlaySchedule {
  activeDays: boolean[]; // M T W T F S S
  timeRange: string;
  timezone: string;
}

export interface HingePrompt {
  question: string;
  answer: string;
  image?: string | number;
}

export interface Anthem {
  songName: string;
  artistName: string;
  albumArt: string | number;
}

export interface Preferences {
  preferredGenders: string[];
  ageRange: [number, number];
  preferredEthnicities: string[];
}

export interface Profile {
  id: string;
  name: string;
  handle: string;
  age: number;
  birthday?: string;
  gender?: string;
  ethnicity?: string;
  photos: (string | number)[];
  platform: 'pc' | 'playstation' | 'xbox' | 'switch' | 'mobile';
  playStyles: string[];
  bio: string;
  region?: string;
  mic?: boolean;
  topGames: TopGame[];
  gameIcons: (string | number)[];
  isOnline: boolean;
  lastActive?: string;
  playSchedule?: PlaySchedule;
  vibePrompt?: string;
  vibeStatus?: string;
  vibeMedia?: {type: 'image' | 'video'; source: string | number}[];
  hingePrompt?: HingePrompt;
  anthem?: Anthem;
  preferences?: Preferences;
}
