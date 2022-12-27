import { Bet } from '../models';

const testBet = {
    description: 'Who will win the Super Bowl?',
    optionA: 'New England Patriots',
    optionB: 'Seattle Seahawks',
};

describe('create', () => {
    it('creates a new bet', async () => {
        const bet = await Bet.addBet(testBet);
        expect(bet.description).toEqual(testBet.description);
        expect(bet.optionA).toEqual(testBet.optionA);
        expect(bet.optionB).toEqual(testBet.optionB);
        expect(bet.status).toEqual('In Progress');
        expect(bet.winner).toBeNull();
        await Bet.deleteBet(bet.id);
    });
});

describe('findById', () => {
    it('finds a bet by its id', async () => {
        const bet = await Bet.addBet(testBet);
        const foundBet = await Bet.getBet(bet.id);
        expect(foundBet.description).toEqual(bet.description);
        expect(foundBet.optionA).toEqual(bet.optionA);
        expect(foundBet.optionB).toEqual(bet.optionB);
        expect(foundBet.status).toEqual(bet.status);
        expect(foundBet.winner).toBeUndefined();
        await Bet.deleteBet(bet.id);
    });
});

describe('update', () => {
    it('updates a bet', async () => {
        const bet = await Bet.addBet(testBet);
        const updates = { status: 'Closed', winner: 'New England Patriots' };
        await Bet.updateBet(bet.id, updates);
        const updatedBet = await Bet.getBet(bet.id);
        expect(updatedBet.status).toEqual('Closed');
        expect(updatedBet.winner).toEqual('New England Patriots');
        await Bet.deleteBet(bet.id);
    });
});

describe('get active bets', () => {
    it('gets all active bets', async () => {
        const bet1 = await Bet.addBet(testBet);
        const bet2 = await Bet.addBet({
            description: 'Who will win the NBA Finals?',
            optionA: 'Golden State Warriors',
            optionB: 'Cleveland Cavaliers',
        });
        const activeBets = await Bet.getActiveBets();
        const activeBetIds = Object.keys(activeBets);
        expect(activeBetIds).toHaveLength(2);
        await Bet.deleteBet(bet1.id);
        await Bet.deleteBet(bet2.id);
    });
});
