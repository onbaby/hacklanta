import {Profile} from '../types/profile';

// Local rank icons
const RANK_ICONS = {
  valorant: require('../assets/ranks/valorant_rank.png'),
  overwatch: require('../assets/ranks/overwatch_rank.png'),
  csgo: require('../assets/ranks/csgo_rank.png'),
};

// Game icon assets
const GAME_ICONS = {
  roblox:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Roblox_logo_2022.svg/200px-Roblox_logo_2022.svg.png',
  overwatch:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/200px-Overwatch_circle_logo.svg.png',
  fortnite:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Fortnite_%28Chapter_5%29_logo.svg/200px-Fortnite_%28Chapter_5%29_logo.svg.png',
  valorant:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/200px-Valorant_logo_-_pink_color_version.svg.png',
  csgo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/CS2_Logo.svg/200px-CS2_Logo.svg.png',
  apex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apex_legends_cover.jpg/200px-Apex_legends_cover.jpg',
  lol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/200px-LoL_icon.svg.png',
  minecraft:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Minecraft_Logo.svg/200px-Minecraft_Logo.svg.png',
};

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sadiq Rasheed',
    handle: '@onbaby',
    age: 22,
    birthday: '2003-11-15',
    gender: 'Male',
    ethnicity: 'Black',
    photos: [
      require('../assets/sadiq.png'),
      require('../assets/sadiq2.jpg'),
      require('../assets/sadiq3.jpg'),
    ],
    platform: 'pc',
    playStyles: ['Competitive', 'Night-Owl', 'Trash Talker'],
    bio: "looking for someone to run ranked with and maybe get food after. i don't rage quit but i will mute you",
    region: 'NA East',
    mic: true,
    topGames: [
      {name: 'VALORANT', icon: require('../assets/ranks/valorant_diamond2.webp'), rank: 'Diamond 2', hours: '1000+', isFavorite: true, servers: ['NA East', 'NA West'], modes: ['Competitive', 'Unrated'], platforms: ['PC']},
      {name: 'OVERWATCH', icon: RANK_ICONS.overwatch, rank: 'Diamond 2', hours: '1000+', isFavorite: false, servers: ['Americas'], modes: ['Competitive', 'Quick Play'], platforms: ['PC']},
      {name: 'CS:GO', icon: RANK_ICONS.csgo, rank: 'Global Elite', hours: '1000+', isFavorite: false, servers: ['NA'], modes: ['Competitive', 'Wingman'], platforms: ['PC']},
    ],
    gameIcons: [
      require('../assets/gameicons/roblox.png'),
      require('../assets/gameicons/overwatch.png'),
      require('../assets/gameicons/fortnite.png'),
    ],
    isOnline: true,
    playSchedule: {
      activeDays: [false, false, true, true, true, true, true],
      timeRange: '9pm - 2am',
      timezone: 'EST',
    },
    vibePrompt: "I'm weirdly attracted to",
    vibeStatus: 'people who read actual books',
    vibeMedia: [
      {type: 'video', source: require('../assets/sadiq_selfie.mov')},
      {type: 'image', source: require('../assets/sadiq_friends.jpg')},
    ],
    hingePrompt: {
      question: "We'll get along if",
      answer: "you're down to do nothing together and it's not awkward",
    },
    anthem: {
      songName: 'Defeat Here',
      artistName: 'Yuki Kanesaka',
      albumArt: require('../assets/album_art.jpg'),
    },
    preferences: {
      preferredGenders: ['Female'],
      ageRange: [18, 28],
      preferredEthnicities: [],
    },
  },
  {
    id: '2',
    name: 'Yonna Ray',
    handle: '@yonnaray',
    age: 24,
    birthday: '2001-06-22',
    gender: 'Female',
    ethnicity: 'Black',
    photos: [
      require('../assets/yonna1.jpg'),
      require('../assets/yonna2.jpg'),
    ],
    platform: 'pc',
    playStyles: ['Casual', 'Team Player', 'Early Bird'],
    bio: 'support main who actually peels for the team. looking for someone who appreciates a good callout',
    region: 'NA West',
    mic: true,
    topGames: [
      {name: 'OVERWATCH', icon: require('../assets/ranks/overwatch_master.png'), rank: 'Master', hours: '2000+', isFavorite: true, servers: ['Americas'], modes: ['Competitive', 'Quick Play'], platforms: ['PC', 'Console']},
      {name: 'VALORANT', icon: RANK_ICONS.valorant, rank: 'Ascendant 1', hours: '800+', isFavorite: false, servers: ['NA West'], modes: ['Competitive'], platforms: ['PC']},
      {name: 'FORTNITE', icon: require('../assets/ranks/fortnite_rank.png'), rank: 'Champion', hours: '500+', isFavorite: false, servers: ['NA West'], modes: ['Battle Royale', 'Zero Build'], platforms: ['PC', 'Console']},
    ],
    gameIcons: [
      require('../assets/gameicons/overwatch_badge.png'),
      require('../assets/gameicons/valorant_dark.png'),
      require('../assets/gameicons/fortnite_badge.png'),
    ],
    isOnline: true,
    playSchedule: {
      activeDays: [true, false, true, false, false, false, true],
      timeRange: '6pm - 11pm',
      timezone: 'PST',
    },
    vibeStatus: "you actually comm in game and don't tilt after one loss",
    hingePrompt: {
      question: 'My honest guilty pleasure is',
      answer: 'eating pizza at 2am after a ranked loss and pretending it fixes everything',
      image: require('../assets/yonna_pizza.jpg'),
    },
    anthem: {
      songName: 'Glimpse of Us',
      artistName: 'Joji',
      albumArt: require('../assets/glimpse_of_us.png'),
    },
    preferences: {
      preferredGenders: ['Male'],
      ageRange: [20, 30],
      preferredEthnicities: [],
    },
  },
];

