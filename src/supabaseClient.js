import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://daltymobbfjbfqgjaetq.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_PUBLIC_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
