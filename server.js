require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const { protect } = require('./controllers/userController');

connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/users', require('./controllers/routes/userRoutes'));
app.use('/api/reports', protect, require('./controllers/routes/reportRoutes'));

app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Denúncias!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Ocorreu um erro no servidor!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
