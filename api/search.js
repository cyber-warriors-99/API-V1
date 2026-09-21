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
        // Yahan se humne extra double quotes hata diye hain, ab direct naam likha hai
        const { data, error } = await supabase
            .from('Mukesh-Api') 
            .select('*')
            .eq('phoneNumber', q); 

        if (error) {
            return res.status(400).json({ status: "error", message: error.message });
        }

        return res.status(200).json({
            status: "success",
            results_count: data.length,
            data: data
        });

    } catch (err) {
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
