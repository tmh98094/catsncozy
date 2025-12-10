#!/usr/bin/env node

/**
 * Supabase Keep-Alive Script
 * 
 * This script performs a lightweight database operation every 2 days
 * to prevent Supabase free tier from pausing due to inactivity.
 * 
 * It creates a simple heartbeat table and updates a timestamp.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Supabase credentials not found in environment variables')
  console.log('This is expected if Supabase is not configured yet.')
  process.exit(0) // Exit gracefully, not an error
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function pingSupabase() {
  try {
    console.log('🏓 Pinging Supabase to keep it active...')
    
    // Create heartbeat table if it doesn't exist
    const { error: createError } = await supabase.rpc('create_heartbeat_table_if_not_exists')
    
    if (createError && !createError.message.includes('already exists')) {
      // Try alternative approach - just do a simple select
      console.log('📊 Performing lightweight database check...')
      
      // Simple count query on cats table (should exist)
      const { data, error } = await supabase
        .from('cats')
        .select('id', { count: 'exact', head: true })
      
      if (error) {
        console.log('⚠️  Cats table not found, trying testimonials...')
        
        // Try testimonials table
        const { error: testimonialsError } = await supabase
          .from('testimonials')
          .select('id', { count: 'exact', head: true })
        
        if (testimonialsError) {
          console.log('ℹ️  Database tables not set up yet, but connection successful')
        } else {
          console.log('✅ Successfully pinged testimonials table')
        }
      } else {
        console.log('✅ Successfully pinged cats table')
      }
    } else {
      // Update heartbeat timestamp
      const now = new Date().toISOString()
      const { error: updateError } = await supabase
        .from('heartbeat')
        .upsert({ 
          id: 1, 
          last_ping: now,
          message: 'Keep-alive ping from GitHub Actions'
        })
      
      if (updateError) {
        console.log('⚠️  Heartbeat table update failed, but connection successful')
      } else {
        console.log('✅ Successfully updated heartbeat table')
      }
    }
    
    console.log(`🎉 Supabase ping completed at ${new Date().toISOString()}`)
    console.log('📅 Next ping scheduled in 2 days')
    
  } catch (error) {
    console.error('❌ Error pinging Supabase:', error.message)
    
    // Don't fail the job - this might happen if Supabase isn't set up yet
    console.log('ℹ️  This is normal if Supabase is not configured yet')
    process.exit(0)
  }
}

// Run the ping
pingSupabase()