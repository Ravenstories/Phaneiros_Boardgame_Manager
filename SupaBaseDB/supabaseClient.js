import { createClient } from '@supabase/supabase-js';
require('dotenv').config();
// Replace with your Supabase project URL and API key (from Supabase dashboard)

let schema = 'public';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, { schema: schema });


/*
async function fetchFromDB(key) {
    let { data, error } = await supabase.from(key).select('*');
    if (error) console.error(error);
    console.log(data);
}


const { createClient } = require('@supabase/supabase-js');


fetchFromDB("kingdoms");
*/