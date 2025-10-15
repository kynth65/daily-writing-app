import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If no settings exist, create default settings
    if (error && error.code === 'PGRST116') {
      const { data: newSettings, error: insertError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          dark_mode: false,
          reminder_enabled: false,
          reminder_time: null
        })
        .select()
        .single()

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to create settings' },
          { status: 500 }
        )
      }

      return NextResponse.json(newSettings)
    }

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { dark_mode, reminder_enabled, reminder_time } = body

    // Validate input
    if (typeof dark_mode !== 'undefined' && typeof dark_mode !== 'boolean') {
      return NextResponse.json(
        { error: 'dark_mode must be a boolean' },
        { status: 400 }
      )
    }

    if (typeof reminder_enabled !== 'undefined' && typeof reminder_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'reminder_enabled must be a boolean' },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: {
      dark_mode?: boolean
      reminder_enabled?: boolean
      reminder_time?: string | null
    } = {}
    if (typeof dark_mode !== 'undefined') updateData.dark_mode = dark_mode
    if (typeof reminder_enabled !== 'undefined') updateData.reminder_enabled = reminder_enabled
    if (typeof reminder_time !== 'undefined') updateData.reminder_time = reminder_time

    // Update settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      // If settings don't exist, create them
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            dark_mode: dark_mode ?? false,
            reminder_enabled: reminder_enabled ?? false,
            reminder_time: reminder_time ?? null
          })
          .select()
          .single()

        if (insertError) {
          return NextResponse.json(
            { error: 'Failed to create settings' },
            { status: 500 }
          )
        }

        return NextResponse.json(newSettings)
      }

      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
