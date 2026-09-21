const { createClient } = require('@supabase/supabase-js');

// Vercel Dashboard ke Environment Variables se automatic load hoga
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
    // URL parameter se ?q={number} ko read karna
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ 
            status: "error", 
            message: "Missing search query. Format: /search?q={number}" 
        });
    }

    try {
        // Aapki table ka naam 'Mukesh-Api' hai aur column ka naam 'phoneNumber' hai
        // Supabase mein dashes (-) waale table name ko double quotes "" mein likhna safe hota hai
        const { data, error } = await supabase
            .from('"Mukesh-Api"') 
            .select('*')
            .eq('phoneNumber', q); // Yeh aapke CSV ka exact column name hai

        if (error) {
            return res.status(400).json({ status: "error", message: error.message });
        }

        // Agar data mil gaya toh direct JSON array send karna jo bot samajh sake
        return res.status(200).json({
            status: "success",
            results_count: data.length,
            data: data
        });

    } catch (err) {
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
