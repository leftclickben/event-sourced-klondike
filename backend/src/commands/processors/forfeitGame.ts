import { CommandProcessor, ForfeitGameCommand } from '../types';
import { GameEventType, GameForfeitedEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events';
import { validateGameExists, validateGameNotFinished, validateParameters } from '../validation';

export const forfeitGame: CommandProcessor<ForfeitGameCommand, GameForfeitedEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    return await saveEvent<GameEventType.gameForfeited, GameForfeitedEvent>(
      GameEventType.gameForfeited,
      { gameId });
  };
