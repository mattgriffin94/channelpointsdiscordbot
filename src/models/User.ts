import * as admin from 'firebase-admin';
import initializeFirebase from '../dbInit';

initializeFirebase();

const database = admin.database();
const usersRef = database.ref('/users');

export class User {
    id: string;
    discordId: string;
    username: string;
    points: number;

    constructor(params: { id: string; discordId: string; username: string; points: number }) {
        this.id = params.id;
        this.discordId = params.discordId;
        this.username = params.username;
        this.points = params.points;
    }

    static async addUser(params: { discordId: string; username: string; points: number }) {
        const userKey = usersRef.push().key as string;
        const user = new User({
            id: userKey,
            discordId: params.discordId,
            username: params.username,
            points: params.points,
        });
        await usersRef.child(userKey).set(user);
        return user;
    }

    static async getUser(id: string) {
        const userSnapshot = await usersRef.child(id).once('value');
        return userSnapshot.val();
    }

    static async updateUser(id: string, updates: { points: number }) {
        await usersRef.child(id).update(updates);
    }

    static async deleteUser(id: string) {
        await usersRef.child(id).remove();
    }

    static async addPoints(id: string, points: number) {
        const user = await this.getUser(id);
        if (user) {
            await this.updateUser(id, { points: user.points + points });
        }
    }

}
