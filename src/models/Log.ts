import * as admin from 'firebase-admin';
import initializeFirebase from '../dbInit';

initializeFirebase();

const database = admin.database();
const logsRef = database.ref('/log');

export class Log {
    id: string;
    userId: string;
    betId: string;
    option: string;
    amountBet: number;
    amountWon: number | null;

    constructor(
        params: {
            id: string;
            userId: string;
            betId: string;
            option: string;
            amountBet: number;
            amountWon: number | null;
        },
    ) {
        this.id = params.id;
        this.userId = params.userId;
        this.betId = params.betId;
        this.option = params.option;
        this.amountBet = params.amountBet;
        this.amountWon = params.amountWon;
    }

    static async create(params: { userId: string; betId: string; option: string; amountBet: number }) {
        const logKey = logsRef.push().key as string;
        const log = new Log({
            id: logKey,
            userId: params.userId,
            betId: params.betId,
            option: params.option,
            amountBet: params.amountBet,
            amountWon: null,
        });
        await logsRef.child(`${params.userId}/${params.betId}`).set(log);
        return log;
    }

    static async findByUserAndBetId(userId: string, betId: string) {
        const logSnapshot = await logsRef.child(`${userId}/${betId}`).once('value');
        return logSnapshot.val();
    }

    static async update(userId: string, betId: string, updates: { amountWon: number }) {
        const log = await this.findByUserAndBetId(userId, betId);
        const logKey = Object.keys(log)[0];
        await logsRef.child(`${userId}/${betId}`).update(updates);
    }

    static async delete(userId: string, betId: string) {
        const log = await this.findByUserAndBetId(userId, betId);
        const logKey = Object.keys(log)[0];
        await logsRef.child(`${userId}/${betId}`).remove();
    }
}
