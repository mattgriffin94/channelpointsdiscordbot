import { Log } from '../models';

const testUserId = '12345';
const testBetId = '54321';
const testLog = {
    option: 'A',
    amountBet: 1000,
    amountWon: null,
};

describe('create', () => {
    it('creates a new log', async () => {
        const log = await Log.create({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        expect(log.userId).toEqual(testUserId);
        expect(log.betId).toEqual(testBetId);
        expect(log.option).toEqual(testLog.option);
        expect(log.amountBet).toEqual(testLog.amountBet);
        expect(log.amountWon).toEqual(testLog.amountWon);
        await Log.delete(testUserId, testBetId);
    });
});

describe('findByUserAndBetId', () => {
    it('finds a log by its userId and betId', async () => {
        const log = await Log.create({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        const foundLog = await Log.findByUserAndBetId(testUserId, testBetId);
        expect(foundLog.option).toEqual(log.option);
        expect(foundLog.amountBet).toEqual(log.amountBet);
        expect(foundLog.amountWon).toBeUndefined();
        await Log.delete(testUserId, testBetId);
    });
});

describe('update', () => {
    it('updates a log', async () => {
        await Log.create({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        const updates = { amountWon: 500 };
        await Log.update(testUserId, testBetId, updates);
        const updatedLog = await Log.findByUserAndBetId(testUserId, testBetId);
        expect(updatedLog.amountWon).toEqual(500);
        await Log.delete(testUserId, testBetId);
    });
});
