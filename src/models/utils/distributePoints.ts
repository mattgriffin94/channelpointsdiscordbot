import { Log } from '../Log';

function distributePoints(logs: Log[], betId: string, totalPoints: number) {
    // Calculate the total amount bet by all users
    const totalAmountBet = logs.reduce((acc, log) => acc + log.amountBet, 0);

    // Distribute the points to each user based on their relative share of the total amount bet
    const updatedLogs = logs.map(log => {
        log.amountWon = Math.round((log.amountBet / totalAmountBet) * totalPoints);
        return log;
    });

    return updatedLogs;
}

export { distributePoints };