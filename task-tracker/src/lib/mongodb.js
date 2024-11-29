import mongoose from 'mongoose';
import 'dotenv/config';

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Bereits mit MongoDB verbunden.');
        return mongoose.connection.asPromise();
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Erfolgreich mit MongoDB verbunden.');
    } catch (error) {
        console.error('Fehler beim Verbinden mit MongoDB:', error.message);
        throw new Error('Verbindung zur MongoDB fehlgeschlagen.');
    }
};

export default connectToDatabase;