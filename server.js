const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/index');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Terjadi kesalahan internal pada server', 
        error: err.message 
    });
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Koneksi database berhasil dilakukan');
        app.listen(PORT, () => {
            console.log('Server berjalan pada port: ' + PORT);
            console.log('Akses aplikasi melalui: http://localhost:' + PORT);
        });
    })
    .catch((error) => {
        console.error('Koneksi database gagal:', error);
});