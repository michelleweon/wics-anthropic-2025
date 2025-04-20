import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://daltymobbfjbfqgjaetq.supabase.co'  // your actual project URL
const supabaseAnonKey = 'YOUR_PUBLIC_ANON_KEY'  // find this in Supabase → Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
