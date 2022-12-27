import admin from 'firebase-admin';
import * as serviceAccount from './config/serviceAccountKey.json';

const initializeFirebase = async () => {

    if (admin.apps.length > 0) return;
    try {
        await admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            databaseURL: 'https://discordbets-db9ee-default-rtdb.firebaseio.com/',
        });
    }
    catch (error) {
        console.log(error);
    }
};

export default initializeFirebase;