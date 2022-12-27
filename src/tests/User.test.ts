import { User } from '../models';

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