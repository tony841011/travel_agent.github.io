
import { DayItinerary, Flight } from './types';

export const FLIGHTS: Flight[] = [
  {
    id: 'f1',
    type: 'Outbound',
    airline: 'Peach Aviation (樂桃航空)',
    flightNo: 'MM024',
    from: 'TPE (桃園 T1)',
    to: 'KIX (關西 T2)',
    departureTime: '2026/02/27 10:30',
    arrivalTime: '2026/02/27 14:05',
    terminal: 'KIX Terminal 2'
  },
  {
    id: 'f2',
    type: 'Inbound',
    airline: 'EVA Air (長榮航空)',
    flightNo: 'BR129',
    from: 'KIX (關西 T1)',
    to: 'TPE (桃園 T2)',
    departureTime: '2026/03/03 17:45',
    arrivalTime: '2026/03/03 19:55',
    terminal: 'KIX Terminal 1'
  }
];

export const ITINERARY: DayItinerary[] = [
  {
    id: 1,
    date: '2026/02/27',
    location: 'Kyoto',
    title: '抵達京都：古都之夜',
    hotel: 'Hotel Forza Kyoto Shijo Kawaramachi',
    weather: {
      tempRange: '4°C - 11°C',
      condition: '多雲時晴 / 偏冷',
      clothing: '發熱衣 + 毛衣 + 防風大衣，手套與圍巾建議備用。',
      tips: ['關西機場風大，出關後請注意保暖', 'Haruka 車廂內暖氣強，建議洋蔥式穿法']
    },
    items: [
      {
        id: '1-1',
        title: '桃園國際機場 (TPE) -> 關西國際機場 (KIX)',
        description: '搭乘 MM024 樂桃航空',
        transportAfter: {
          mode: 'Haruka',
          detail: '關西機場 -> 京都車站',
          duration: '約 75 分鐘',
          note: '建議預訂最近班次之指定席，舒適度較高。'
        }
      },
      {
        id: '1-2',
        title: 'Hotel Forza Kyoto Shijo Kawaramachi Check-in',
        time: '15:00',
        description: '飯店地理位置優越，位於四條河原町。',
        transportAfter: {
          mode: 'Walk',
          detail: '飯店 -> 鴨川地區',
          duration: '5-10 分鐘'
        }
      },
      {
        id: '1-3',
        title: '鴨川、先斗町、花見小路',
        duration: '3 小時',
        description: '體驗京都晚上的氛圍，先斗町有許多特色餐廳。'
      }
    ]
  },
  {
    id: 2,
    date: '2026/02/28',
    location: 'Kyoto',
    title: '京都和服體驗與移宿大阪',
    hotel: '東急大阪卓悅大飯店',
    weather: {
      tempRange: '3°C - 10°C',
      condition: '晴朗 / 寒冷',
      clothing: '和服體驗可穿暖暖包，內搭低領發熱衣。',
      tips: ['京都步行較多，建議穿著舒適鞋款', '伏見稻禾攀爬需要體力']
    },
    items: [
      {
        id: '2-1',
        time: '09:00',
        title: '和服租借：璃光着物',
        duration: '1 小時',
        transportAfter: { mode: 'Walk', detail: '前往八阪神社', duration: '15 分鐘' }
      },
      {
        id: '2-2',
        time: '10:30',
        title: 'K.D 和服攝影 @ 八阪神社',
        duration: '1.5 小時',
        description: '在神社內進行專業攝影。'
      },
      {
        id: '2-3',
        title: '祈園、二年坂、三年坂、清水寺',
        duration: '3-4 小時',
        description: '經典京都散策路徑。'
      },
      {
        id: '2-4',
        title: '下鴨神社、伏見稻禾神社',
        duration: '2-3 小時',
        transportAfter: {
          mode: 'Train',
          detail: '京都車站 -> 大阪 (JR 特急或快速)',
          duration: '30-45 分鐘',
          note: '若是搭乘 JR 新快速只需 30 分鐘，班次頻繁。'
        }
      },
      {
        id: '2-5',
        title: '梅田地區：藍天大廈 & 藍瓶咖啡',
        duration: '2 小時',
        description: '欣賞大阪百萬夜景。'
      },
      {
        id: '2-6',
        title: '心齋橋、道頓堀 (Optional)',
        isOptional: true,
        description: '晚餐與逛街熱區。'
      }
    ]
  },
  {
    id: 3,
    date: '2026/03/01',
    location: 'Osaka',
    title: '大阪周遊卡：名勝與柯南巡禮',
    hotel: '東急大阪卓悅大飯店',
    weather: {
      tempRange: '5°C - 12°C',
      condition: '多雲',
      clothing: '長袖衛衣 + 夾克，戶外行程多，注意足部保暖。',
      tips: ['善用大阪周遊卡免費設施', '通天閣人潮眾多建議提早']
    },
    items: [
      {
        id: '3-1',
        title: '大阪城公園、警察本部、讀賣電視台',
        duration: '3 小時',
        description: '柯南迷必訪景點，警察本部外觀壯觀。',
        transportAfter: { mode: 'Subway', detail: '地鐵中央線轉御堂筋線', duration: '20 分鐘' }
      },
      {
        id: '3-2',
        title: '阿倍野 Harukas',
        duration: '1.5 小時',
        description: '日本第一高樓，周遊卡購買門票通常有優惠。'
      },
      {
        id: '3-3',
        title: '達摩串炸 & 通天閣(柯南) & 今宮戎神社(柯南)',
        duration: '3 小時',
        description: '體驗新世界風情，尋找柯南電影中的場景。'
      },
      {
        id: '3-4',
        title: '心齋橋、道頓堀、天保山大摩天輪、聖瑪麗亞號',
        isOptional: true,
        description: '若時間充裕可前往港灣區使用周遊卡。'
      }
    ]
  },
  {
    id: 4,
    date: '2026/03/02',
    location: 'Osaka',
    title: '環球影城冒險日',
    hotel: '東急大阪卓悅大飯店',
    weather: {
      tempRange: '4°C - 10°C',
      condition: '晴 / 強風',
      clothing: '防風保暖外套必備，建議圍巾。',
      tips: ['USJ 靠海風大，體感溫度較低', '建議提早 1 小時到門口排隊']
    },
    items: [
      {
        id: '4-1',
        title: '日本環球影城 (USJ)',
        duration: '整天',
        description: '任天堂世界、哈利波特等。',
        transportAfter: { mode: 'Subway', detail: 'JR 櫻島線 -> 市區', duration: '20 分鐘' }
      },
      {
        id: '4-2',
        title: '心齋橋、道頓堀最後採買 (Optional)',
        isOptional: true,
        description: '購買藥妝與伴手禮。'
      }
    ]
  },
  {
    id: 5,
    date: '2026/03/03',
    location: 'Osaka',
    title: '最後採買與回程',
    weather: {
      tempRange: '6°C - 13°C',
      condition: '晴時多雲',
      clothing: '方便行動的穿著，預留大衣位置收進行李箱。',
      tips: ['南海電鐵 Rapit 建議預約指定席', '機場提早 2.5 小時到達']
    },
    items: [
      {
        id: '5-1',
        title: '心齋橋、道頓堀補貨',
        duration: '2-3 小時',
        transportAfter: {
          mode: 'Rapit',
          detail: '難波站 -> 關西機場',
          duration: '38 分鐘',
          note: '請注意 Rapit 班次時間，需對號入座。'
        }
      },
      {
        id: '5-2',
        title: '關西國際機場 (KIX) -> 桃園國際機場 (TPE)',
        description: '搭乘 BR129 長榮航空',
        note: '回程行李較重，建議提早托運。'
      }
    ]
  }
];
