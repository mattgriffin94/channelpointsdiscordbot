import * as admin from 'firebase-admin';
import { Log } from './Log';
import { User } from './User';
import initializeFirebase from '../dbInit';
import { distributePoints } from './utils/distributePoints';

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
    pointsA: number;
    pointsB: number;

    constructor(params: {
        id: string;
        description: string;
        optionA: string;
        optionB: string;
        status: string;
        winner: string | null;
        pointsA: number;
        pointsB: number;
    }) {
        this.id = params.id;
        this.description = params.description;
        this.optionA = params.optionA;
        this.optionB = params.optionB;
        this.status = params.status;
        this.winner = params.winner;
        this.pointsA = params.pointsA;
        this.pointsB = params.pointsB;
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
            pointsA: 0,
            pointsB: 0,
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

    static async updateBet(id: string,
        updates: { pointsA: number; pointsB: number }) {
        await betsRef.child(id).update(updates);
    }

    static async deleteBet(id: string) {
        await betsRef.child(id).remove();
    }

    static async closeBet(id: string, winningOption: string) {
        if (winningOption !== 'A' && winningOption !== 'B') {
            throw new Error('Invalid winning option');
        }

        const bet = await Bet.getBet(id);

        if (bet.status !== 'In Progress') {
            throw new Error('Bet is not in progress');
        }

        await betsRef.child(id).update({ status: 'Closed', winner: winningOption });

        const totalPoints = bet.pointsA + bet.pointsB;

        const logs = await Log.getRecordsforBet(id);

        // get logs that chose winning option
        const winningLogs = logs.filter((log: Log) => log.option === winningOption);

        // distribute points to winning logs
        const logsWithPoints = distributePoints(winningLogs, id, totalPoints);

        // update logs and users with points
        const updatePoints = logsWithPoints.map(async (log: Log) => {
            await Log.updateRecord(log.userId, log.betId, { amountWon: log.amountWon as number });
            return User.addPoints(log.userId, log.amountWon as number);
        });
        await Promise.all(updatePoints);

    }

}
