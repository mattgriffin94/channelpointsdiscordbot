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

    static async create(params: { discordId: string; username: string; points: number }) {
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

    static async findById(id: string) {
        const userSnapshot = await usersRef.child(id).once('value');
        return userSnapshot.val();
    }

    static async update(id: string, updates: { points: number }) {
        await usersRef.child(id).update(updates);
    }

    static async delete(id: string) {
        await usersRef.child(id).remove();
    }
}
