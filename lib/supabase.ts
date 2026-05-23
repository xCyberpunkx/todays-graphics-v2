import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Warning: Missing Supabase environment variables. Supabase client calls will fail at runtime.')
}

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : new Proxy({} as any, {
      get(target, prop) {
        if (prop === 'then') return undefined
        throw new Error('Supabase client was called but missing Supabase environment variables')
      }
    })

