import * as admin from 'firebase-admin';
import initializeFirebase from '../dbInit';

initializeFirebase();

const database = admin.database();
const betsRef = database.ref('/bets');

export class Bet {
    id: string;
    description: string;
    optionA: string;
    optionB: string;
    status: string;
    winner: string | null;

    constructor(params: {
        id: string;
        description: string;
        optionA: string;
        optionB: string;
        status: string;
        winner: string | null;
    }) {
        this.id = params.id;
        this.description = params.description;
        this.optionA = params.optionA;
        this.optionB = params.optionB;
        this.status = params.status;
        this.winner = params.winner;
    }

    static async addBet(params: { description: string; optionA: string; optionB: string }) {
        const betKey = betsRef.push().key as string;
        const bet = new Bet({
            id: betKey,
            description: params.description,
            optionA: params.optionA,
            optionB: params.optionB,
            status: 'In Progress',
            winner: null,
        });
        await betsRef.child(betKey).set(bet);
        return bet;
    }

    static async getBet(id: string) {
        const betSnapshot = await betsRef.child(id).once('value');
        return betSnapshot.val();
    }

    static async getActiveBets() {
        const betSnapshot = await betsRef.orderByChild('status').equalTo('In Progress').once('value');
        return betSnapshot.val();
    }

    static async updateBet(id: string, updates: { status: string; winner: string | null }) {
        await betsRef.child(id).update(updates);
    }

    static async deleteBet(id: string) {
        await betsRef.child(id).remove();
    }
}
