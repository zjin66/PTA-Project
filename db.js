const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://jerry0229lucky:Jz@2021Lucky@clusterforpta.zba12.mongodb.net/?retryWrites=true&w=majority&appName=ClusterForPTA', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;