import * as admin from 'firebase-admin';
import { Log } from './Log';
import { Bet } from './Bet';
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

    static async placeBet(id: string, betId: string, amount: number, option: string) {
        const user = await this.getUser(id);
        const bet = await Bet.getBet(betId);
        if (!user) {
            throw new Error('User does not exist');
        }
        if (!bet) {
            throw new Error('Bet does not exist');
        }
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        if (user.points < amount) {
            throw new Error('Insufficient points');
        }
        if (option !== 'A' && option !== 'B') {
            throw new Error('Option must be either A or B');
        }
        await this.addPoints(id, -amount);
        await Log.addRecord({ userId: id, betId, option, amountBet: amount });

        if (option === 'A') {
            const update = { pointsA: bet.pointsA + amount, pointsB: bet.pointsB };
            await Bet.updateBet(betId, update);
        }
        else {
            const update = { pointsA: bet.pointsA, pointsB: bet.pointsB + amount };
            await Bet.updateBet(betId, update);
        }
    }

    static async getLeaderboard() {
        const usersSnapshot = await usersRef.orderByChild('points').limitToLast(10).once('value');
        const leaderboard: { discordId: string; username: string; points: number }[] = [];
        usersSnapshot.forEach((userSnapshot) => {
            leaderboard.push({
                discordId: userSnapshot.val().discordId,
                username: userSnapshot.val().username,
                points: userSnapshot.val().points,
            });
        });
        return leaderboard.reverse();
    }


}
