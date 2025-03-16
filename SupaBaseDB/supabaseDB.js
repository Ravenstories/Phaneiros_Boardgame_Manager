import { createClient } from '@supabase/supabase-js';
require('dotenv').config();
// Replace with your Supabase project URL and API key (from Supabase dashboard)

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Example: Fetch all kingdoms
async function fetchKingdoms() {
    let { data, error } = await supabase.from('kingdoms').select('*');
    if (error) console.error(error);
    console.log(data);
}


const { createClient } = require('@supabase/supabase-js');


fetchKingdoms();
