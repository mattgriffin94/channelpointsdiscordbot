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
        const log = await Log.addRecord({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        expect(log.userId).toEqual(testUserId);
        expect(log.betId).toEqual(testBetId);
        expect(log.option).toEqual(testLog.option);
        expect(log.amountBet).toEqual(testLog.amountBet);
        expect(log.amountWon).toEqual(testLog.amountWon);
        await Log.deleteRecord(testUserId, testBetId);
    });
});

describe('findByUserAndBetId', () => {
    it('finds a log by its userId and betId', async () => {
        const log = await Log.addRecord({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        const foundLog = await Log.getRecord(testUserId, testBetId);
        expect(foundLog.option).toEqual(log.option);
        expect(foundLog.amountBet).toEqual(log.amountBet);
        expect(foundLog.amountWon).toBeUndefined();
        await Log.deleteRecord(testUserId, testBetId);
    });
});

describe('update', () => {
    it('updates a log', async () => {
        await Log.addRecord({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        const updates = { amountWon: 500 };
        await Log.updateRecord(testUserId, testBetId, updates);
        const updatedLog = await Log.getRecord(testUserId, testBetId);
        expect(updatedLog.amountWon).toEqual(500);
        await Log.deleteRecord(testUserId, testBetId);
    });

});

describe('get records for bet', () => {
    it('gets all logs for a bet', async () => {
        await Log.addRecord({
            userId: testUserId,
            betId: testBetId,
            ...testLog,
        });
        await Log.addRecord({
            userId: '123',
            betId: testBetId,
            ...testLog,
        });
        const logs = await Log.getRecordsforBet(testBetId);
        expect(Object.keys(logs).length).toEqual(2);
        await Log.deleteRecord(testUserId, testBetId);
        await Log.deleteRecord('123', testBetId);
    });
});

test('gets all logs for a user', async () => {
    await Log.addRecord({
        userId: testUserId,
        betId: testBetId,
        ...testLog,
    });
    await Log.addRecord({
        userId: testUserId,
        betId: '123',
        ...testLog,
    });
    const logs = await Log.getRecordsforUser(testUserId);
    expect(Object.keys(logs).length).toEqual(2);
    await Log.deleteRecord(testUserId, testBetId);
    await Log.deleteRecord(testUserId, '123');
});