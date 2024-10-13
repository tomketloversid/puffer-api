const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS
const app = express();
const port = 3000;

// Menggunakan CORS agar API bisa diakses dari domain lain
app.use(cors());

// Middleware untuk mengizinkan JSON parsing dari body request
app.use(express.json());

app.post('/api/', async (req, res) => {
    const { wallet } = req.body; // Ambil wallet dari body request

    if (!wallet) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    try {
        // Buat request ke API Puffer Quest menggunakan Axios
        const response = await axios.get('https://quest-api.puffer.fi/puffer-quest/profile/user_info', {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'address': wallet,
                'origin': 'https://quest.puffer.fi',
                'referer': 'https://quest.puffer.fi/',
            }
        });

        const data = response.data;

        if (data.errno === 0) {
            const points = data.data.points;
            const eligible = points > 1001 ? 'Yes' : 'No';

            // Kirim respons ke client
            res.json({
                wallet,
                points,
                eligible
            });
        } else {
            res.status(500).json({ error: 'Error retrieving data from Puffer API.' });
        }

    } catch (error) {
        // Menangani kesalahan saat menghubungi API
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});

// Menjalankan server Express
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
