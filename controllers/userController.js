const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res
                .status(401)
                .json({ message: 'Não autorizado, token inválido' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Erro ao cadastrar usuário' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: 'Erro de validação: ' + error.message });
        } else if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: 'Erro: Email já registrado.' });
        } else {
            return res
                .status(500)
                .json({ message: 'Erro ao conectar ao banco de dados' });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Erro ao processar a solicitação de login' });
    }
};

module.exports = {
    registerUser,
    protect,
};
