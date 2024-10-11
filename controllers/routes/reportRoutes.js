const express = require('express');
const router = express.Router();

let reports = [];

router.post('/', (req, res) => {
    const { title, description, category } = req.body;
    const newReport = {
        id: reports.length + 1,
        title,
        description,
        category,
        status: 'aberta',
    };
    reports.push(newReport);
    res.status(201).json(newReport);
});

router.get('/', (req, res) => {
    res.json(reports);
});

module.exports = router;
