import { ExpectedEventDetails, GameEventType, GameId, TestConfiguration } from '../types';
import {
  GameCreatedEvent,
  GameForfeitedEvent,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent
} from '../../../backend/src/events/types';
import { createGameNoMovesMade, gameCreatedStock, gameCreatedTableau } from '../fixtures/events';

export const createTestConfigurations = (apiBaseUrl: string): Record<GameId, TestConfiguration> => ({
  // BASE CASE: Load a game that has only been created, and forfeit it.
  newGameToForfeit: {
    getInitialEvents: createGameNoMovesMade,
    inputTape: [
      'forfeit'
    ],
    expectedOutputTape: [
      'Continuing explicitly requested game newGameToForfeit\n',
      ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/newGameToForfeit\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP GET: {\n  "gameId": "newGameToForfeit",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
      '\u001b[2J\n ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n ║                                       ║ \n ║   Score: 0      Status: In Progress   ║ \n ║                                       ║ \n ║                  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n ║                                       ║ \n ║   ♦ 5  ░░░  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n ║        ♥ 4  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n ║                  ♦ K  ░░░  ░░░  ░░░   ║ \n ║                       ♦ A  ░░░  ░░░   ║ \n ║                            ♠ 5  ░░░   ║ \n ║                                 ♦ 3   ║ \n ║                                       ║ \n ║                            ▒▒▒  ░░░   ║ \n ║                                       ║ \n ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // forfeit
      ...process.env.API_VERBOSE ? [`HTTP DELETE ${apiBaseUrl}/game/newGameToForfeit\n`] : [],
      '\u001b[2J\n ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n ║                                       ║ \n ║   Score: 0          Status: Quitter   ║ \n ║                                       ║ \n ║                  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n ║                                       ║ \n ║   ♦ 5  ░░░  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n ║        ♥ 4  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n ║                  ♦ K  ░░░  ░░░  ░░░   ║ \n ║                       ♦ A  ░░░  ░░░   ║ \n ║                            ♠ 5  ░░░   ║ \n ║                                 ♦ 3   ║ \n ║                                       ║ \n ║                            ▒▒▒  ░░░   ║ \n ║                                       ║ \n ╚═══════════════════════════════════════╝ \n',
      'Thanks for playing!\n'
    ],
    expectedErrorTape: [],
    expectedEvents: [
      {
        eventType: GameEventType.gameCreated,
        tableau: gameCreatedTableau,
        stock: gameCreatedStock
      } as ExpectedEventDetails<GameCreatedEvent>,
      {
        eventType: GameEventType.gameForfeited
      } as ExpectedEventDetails<GameForfeitedEvent>
    ]
  }
});
