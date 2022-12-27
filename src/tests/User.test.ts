import { User, Bet, Log } from '../models';

const testUser = {
    discordId: '12345',
    username: 'testuser',
    points: 1000,
};

describe('create', () => {
    it('creates a new user', async () => {
        const user = await User.addUser(testUser);
        expect(user.discordId).toEqual(testUser.discordId);
        expect(user.username).toEqual(testUser.username);
        expect(user.points).toEqual(testUser.points);
        await User.deleteUser(user.id);
    });
});

describe('findById', () => {
    it('finds a user by their id', async () => {
        const user = await User.addUser(testUser);
        const foundUser = await User.getUser(user.id);
        expect(foundUser.discordId).toEqual(user.discordId);
        expect(foundUser.username).toEqual(user.username);
        expect(foundUser.points).toEqual(user.points);
        await User.deleteUser(user.id);
    });
});

describe('update', () => {
    it('updates a user', async () => {
        const user = await User.addUser(testUser);
        const updates = { points: 500 };
        await User.updateUser(user.id, updates);
        const updatedUser = await User.getUser(user.id);
        expect(updatedUser.points).toEqual(500);
        await User.deleteUser(user.id);
    });
});

describe(' Add points to a user\'s balance ', () => {
    it('adds points to a user', async () => {
        const user = await User.addUser(testUser);
        await User.addPoints(user.id, 500);
        const updatedUser = await User.getUser(user.id);
        expect(updatedUser.points).toEqual(1500);
        await User.deleteUser(user.id);
    });
});

describe(' Place a bet ', () => {
    it ('places a bet', async () => {
        const user = await User.addUser(testUser);
        const bet = await Bet.addBet({
            description: 'test description',
            optionA: 'option 1',
            optionB: 'option 2',
        });
        await User.placeBet(user.id, bet.id, 100, 'A');
        const updatedUser = await User.getUser(user.id);
        const updatedBet = await Bet.getBet(bet.id);
        expect(updatedUser.points).toEqual(900);
        expect(updatedBet.pointsA).toEqual(100);
        await User.deleteUser(user.id);
        await Bet.deleteBet(bet.id);
        await Log.deleteRecord(user.id, bet.id);
    });
});

describe('test leaderboard', () => {
    it('gets the leaderboard', async () => {
        const user1 = await User.addUser(testUser);
        const user2 = await User.addUser({
            discordId: '123456',
            username: 'testuser2',
            points: 500,
        });
        const user3 = await User.addUser({
            discordId: '1234567',
            username: 'testuser3',
            points: 2000,
        });
        const leaderboard = await User.getLeaderboard();
        expect(leaderboard[0].discordId).toEqual(user3.discordId);
        expect(leaderboard[1].discordId).toEqual(user1.discordId);
        expect(leaderboard[2].discordId).toEqual(user2.discordId);
        await User.deleteUser(user1.id);
        await User.deleteUser(user2.id);
        await User.deleteUser(user3.id);
    });
});