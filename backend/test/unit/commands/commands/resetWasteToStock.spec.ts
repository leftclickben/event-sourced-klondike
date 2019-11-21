import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as loadEventsModule from '../../../../src/events/load';
import * as saveEventsModule from '../../../../src/events/save';
import * as validationModule from '../../../../src/commands/validation';
import * as tableStateModule from '../../../../src/state/table';
import { GameEvent, GameEventType } from '../../../../src/events/types';
import { createSampleGameplayEvent } from '../../../fixtures/events';
import { fail } from 'assert';
import { Suit, Value } from '../../../../src/game/types';
import { resetWasteToStock } from '../../../../src/commands/processors/resetWasteToStock';

describe('The "reset waste to stock" command', () => {
  describe('Given the event store is loading and saving events correctly', () => {
    describe('Given the game is in progress', () => {
      const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.wasteResetToStock);

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves(savedEvent);
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
      });

      describe('Given the waste is not empty and the stock is empty', () => {
        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateEmptyStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            waste: [{ suit: Suit.clubs, value: Value.jack, faceUp: true }],
            stock: []
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
          validateEmptyStub = stub(validationModule, 'validateEmpty');
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateEmptyStub.restore();
        });

        describe('When invoked', () => {
          let result: GameEvent;

          beforeEach(async () => {
            result = await resetWasteToStock({ gameId: 'game-42' });
          });

          it('Validates parameters', () => {
            expect(validateParametersStub.calledOnce).to.equal(true);
          });

          it('Loads events for the game', () => {
            expect(loadEventsStub.calledOnce).to.equal(true);
            expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
          });

          it('Validates the game exists', () => {
            expect(validateGameExistsStub.calledOnce).to.equal(true);
          });

          it('Validates the game is not finished', () => {
            expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
          });

          it('Builds the table state', () => {
            expect(buildTableStateStub.calledOnce).to.equal(true);
          });

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.clubs, value: Value.jack, faceUp: true }
            ]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Validates the stock is empty', () => {
            expect(validateEmptyStub.callCount).to.equal(1);
            expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
          });

          it('Saves the new event', () => {
            expect(saveEventStub.calledOnce).to.equal(true);
            expect(saveEventStub.firstCall.args).to.deep.equal([
              'wasteResetToStock',
              { gameId: 'game-42' }
            ]);
          });

          it('Returns the saved event', () => {
            expect(result).to.equal(savedEvent);
          });
        });
      });

      describe('Given the waste is empty', () => {
        const validationError = Error('Waste empty');

        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateEmptyStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            waste: [],
            stock: []
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty').throws(validationError);
          validateEmptyStub = stub(validationModule, 'validateEmpty');
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateEmptyStub.restore();
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await resetWasteToStock({ gameId: 'game-42' });
              fail('Test failed because command should throw an error');
            } catch (e) {
              caughtError = e;
            }
          });

          it('Validates parameters', () => {
            expect(validateParametersStub.calledOnce).to.equal(true);
          });

          it('Loads events for the game', () => {
            expect(loadEventsStub.calledOnce).to.equal(true);
            expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
          });

          it('Validates the game exists', () => {
            expect(validateGameExistsStub.calledOnce).to.equal(true);
          });

          it('Validates the game is not finished', () => {
            expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
          });

          it('Builds the table state', () => {
            expect(buildTableStateStub.calledOnce).to.equal(true);
          });

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Does not validate the stock is empty', () => {
            expect(validateEmptyStub.called).to.equal(false);
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(validationError);
          });
        });
      });

      describe('Given the stock is not empty', () => {
        const validationError = Error('Stock is not empty');

        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateEmptyStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            waste: [],
            stock: [{ suit: Suit.diamonds, value: Value.three, faceUp: false }]
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
          validateEmptyStub = stub(validationModule, 'validateEmpty').throws(validationError);
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateEmptyStub.restore();
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await resetWasteToStock({ gameId: 'game-42' });
              fail('Test failed because command should throw an error');
            } catch (e) {
              caughtError = e;
            }
          });

          it('Validates parameters', () => {
            expect(validateParametersStub.calledOnce).to.equal(true);
          });

          it('Loads events for the game', () => {
            expect(loadEventsStub.calledOnce).to.equal(true);
            expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
          });

          it('Validates the game exists', () => {
            expect(validateGameExistsStub.calledOnce).to.equal(true);
          });

          it('Validates the game is not finished', () => {
            expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
          });

          it('Builds the table state', () => {
            expect(buildTableStateStub.calledOnce).to.equal(true);
          });

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Validates the stock is empty', () => {
            expect(validateEmptyStub.callCount).to.equal(1);
            expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.diamonds, value: Value.three, faceUp: false }
            ]);
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(validationError);
          });
        });
      });
    });

    describe('Given the game does not exist', () => {
      const validationError = Error('Game does not exist');

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;
      let buildTableStateStub: SinonStub;
      let validateNonEmptyStub: SinonStub;
      let validateEmptyStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists').throws(validationError);
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
        validateEmptyStub = stub(validationModule, 'validateEmpty');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateNonEmptyStub.restore();
        validateEmptyStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await resetWasteToStock({ gameId: 'game-42' });
            fail('Test failed because command should throw an error');
          } catch (e) {
            caughtError = e;
          }
        });

        it('Validates parameters', () => {
          expect(validateParametersStub.calledOnce).to.equal(true);
        });

        it('Loads events for the game', () => {
          expect(loadEventsStub.calledOnce).to.equal(true);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });

        it('Validates the game exists', () => {
          expect(validateGameExistsStub.calledOnce).to.equal(true);
        });

        it('Does not validate the game is not finished', () => {
          expect(validateGameNotFinishedStub.called).to.equal(false);
        });

        it('Does not build the table state', () => {
          expect(buildTableStateStub.called).to.equal(false);
        });

        it('Does not validate the waste', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the stock', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(validationError);
        });
      });
    });

    describe('Given the game is already finished', () => {
      const validationError = Error('Game is already finished');

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;
      let buildTableStateStub: SinonStub;
      let validateNonEmptyStub: SinonStub;
      let validateEmptyStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished').throws(validationError);
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
        validateEmptyStub = stub(validationModule, 'validateEmpty');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateNonEmptyStub.restore();
        validateEmptyStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await resetWasteToStock({ gameId: 'game-42' });
            fail('Test failed because command should throw an error');
          } catch (e) {
            caughtError = e;
          }
        });

        it('Validates parameters', () => {
          expect(validateParametersStub.calledOnce).to.equal(true);
        });

        it('Loads events for the game', () => {
          expect(loadEventsStub.calledOnce).to.equal(true);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });

        it('Validates the game exists', () => {
          expect(validateGameExistsStub.calledOnce).to.equal(true);
        });

        it('Validates the game is not finished', () => {
          expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
        });

        it('Does not build the table state', () => {
          expect(buildTableStateStub.called).to.equal(false);
        });

        it('Does not validate the waste', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the stock', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(validationError);
        });
      });
    });
  });

  describe('Given the event store throws when loading events', () => {
    const eventStoreError = Error('Database error: Failed to load events');

    let loadEventsStub: SinonStub;
    let saveEventStub: SinonStub;
    let validateParametersStub: SinonStub;
    let validateGameExistsStub: SinonStub;
    let validateGameNotFinishedStub: SinonStub;
    let buildTableStateStub: SinonStub;
    let validateNonEmptyStub: SinonStub;
    let validateEmptyStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(eventStoreError);
      saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState');
      validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
      validateEmptyStub = stub(validationModule, 'validateEmpty');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateNonEmptyStub.restore();
      validateEmptyStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await resetWasteToStock({ gameId: 'game-42' });
          fail('Test failed because command should throw an error');
        } catch (e) {
          caughtError = e;
        }
      });

      it('Validates parameters', () => {
        expect(validateParametersStub.calledOnce).to.equal(true);
      });

      it('Loads events for the game', () => {
        expect(loadEventsStub.calledOnce).to.equal(true);
        expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
      });

      it('Does not validate the game exists', () => {
        expect(validateGameExistsStub.called).to.equal(false);
      });

      it('Does not validate the game is not finished', () => {
        expect(validateGameNotFinishedStub.called).to.equal(false);
      });

      it('Does not build the table state', () => {
        expect(buildTableStateStub.called).to.equal(false);
      });

      it('Does not validate the waste', () => {
        expect(validateNonEmptyStub.called).to.equal(false);
      });

      it('Does not validate the stock', () => {
        expect(validateEmptyStub.called).to.equal(false);
      });

      it('Does not save an event', () => {
        expect(saveEventStub.called).to.equal(false);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(eventStoreError);
      });
    });
  });

  describe('Given the event store throws when saving an event', () => {
    const eventStoreError = Error('Database error: Failed to save event');

    let loadEventsStub: SinonStub;
    let saveEventStub: SinonStub;
    let validateParametersStub: SinonStub;
    let validateGameExistsStub: SinonStub;
    let validateGameNotFinishedStub: SinonStub;
    let buildTableStateStub: SinonStub;
    let validateNonEmptyStub: SinonStub;
    let validateEmptyStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
      saveEventStub = stub(saveEventsModule, 'saveEvent').rejects(eventStoreError);
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
        waste: [{ suit: Suit.clubs, value: Value.jack, faceUp: true }],
        stock: []
      } as any);
      validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
      validateEmptyStub = stub(validationModule, 'validateEmpty');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateNonEmptyStub.restore();
      validateEmptyStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await resetWasteToStock({ gameId: 'game-42' });
          fail('Test failed because command should throw an error');
        } catch (e) {
          caughtError = e;
        }
      });

      it('Validates parameters', () => {
        expect(validateParametersStub.calledOnce).to.equal(true);
      });

      it('Loads events for the game', () => {
        expect(loadEventsStub.calledOnce).to.equal(true);
        expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
      });

      it('Validates the game exists', () => {
        expect(validateGameExistsStub.calledOnce).to.equal(true);
      });

      it('Validates the game is not finished', () => {
        expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
      });

      it('Builds the table state', () => {
        expect(buildTableStateStub.calledOnce).to.equal(true);
      });

      it('Validates the waste is not empty', () => {
        expect(validateNonEmptyStub.callCount).to.equal(1);
        expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
          { suit: Suit.clubs, value: Value.jack, faceUp: true }
        ]);
        expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
      });

      it('Validates the stock is empty', () => {
        expect(validateEmptyStub.callCount).to.equal(1);
        expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([]);
        expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
      });

      it('Saves an event', () => {
        expect(saveEventStub.calledOnce).to.equal(true);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(eventStoreError);
      });
    });
  });
});
