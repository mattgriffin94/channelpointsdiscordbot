import { Bet, User, Log } from '../models';

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
        const updates = { pointsA: 10, pointsB: 10 };
        await Bet.updateBet(bet.id, updates);
        const updatedBet = await Bet.getBet(bet.id);
        expect(updatedBet.pointsA).toEqual(10);
        expect(updatedBet.pointsB).toEqual(10);
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

describe('Closing bet works correctly', () => {
    it('closes a bet', async () => {
        const bet = await Bet.addBet(testBet);
        await Bet.closeBet(bet.id, 'A');
        const closedBet = await Bet.getBet(bet.id);
        expect(closedBet.status).toEqual('Closed');
        expect(closedBet.winner).toEqual('A');
        await Bet.deleteBet(bet.id);
    });
});

describe('Closing a bet distributes points correctly', () => {
    it('distributed points correctly', async () => {
        const user1 = await User.addUser({
            discordId: '123456789',
            username: 'testUser1',
            points: 1000,
        });
        const user2 = await User.addUser({
            discordId: '987654321',
            username: 'testUser2',
            points: 1000,
        });
        const user3 = await User.addUser({
            discordId: '123478965',
            username: 'testUser3',
            points: 1000,
        });
        const bet = await Bet.addBet(testBet);
        await User.placeBet(user1.id, bet.id, 500, 'A');
        await User.placeBet(user2.id, bet.id, 100, 'B');
        await User.placeBet(user3.id, bet.id, 500, 'A');
        const updatedBet = await Bet.getBet(bet.id);
        expect(updatedBet.pointsA).toEqual(1000);
        expect(updatedBet.pointsB).toEqual(100);
        await Bet.closeBet(bet.id, 'A');
        const updatedUser1 = await User.getUser(user1.id);
        const updatedUser2 = await User.getUser(user2.id);
        const updatedUser3 = await User.getUser(user3.id);
        expect(updatedUser1.points).toEqual(1050);
        expect(updatedUser2.points).toEqual(900);
        expect(updatedUser3.points).toEqual(1050);
        await User.deleteUser(user1.id);
        await User.deleteUser(user2.id);
        await User.deleteUser(user3.id);
        await Bet.deleteBet(bet.id);
        await Log.deleteRecord(user1.id, bet.id);
        await Log.deleteRecord(user2.id, bet.id);
        await Log.deleteRecord(user3.id, bet.id);
    });
});