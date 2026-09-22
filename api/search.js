const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ 
            status: "error", 
            message: "Missing search query. Format: /search?q={number}" 
        });
    }

    try {
        // STEP 1: Pehle hum database se saara data fetch karenge
        const { data: allData, error } = await supabase
            .from('Mukesh-api') 
            .select('*'); 

        if (error) {
            return res.status(400).json({ status: "error", message: error.message });
        }

        // STEP 2: Ab hum JavaScript ke throug har ek record ke andar check karenge 
        // ki user ka search kiya hua number kahin bhi match ho raha hai ya nahi.
        // Isse column name chota-bada hone ka error 100% solve ho jata hai.
        const filteredData = allData.filter(row => {
            return Object.values(row).some(value => 
                String(value).toLowerCase().includes(String(q).toLowerCase())
            );
        });

        // STEP 3: Response return karein
        return res.status(200).json({
            status: "success",
            results_count: filteredData.length,
            data: filteredData
        });

    } catch (err) {
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
