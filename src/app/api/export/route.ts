import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database'

type Entry = Database['public']['Tables']['entries']['Row']

export async function GET(request: Request) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get format from query params (json, csv, or markdown)
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'

  try {
    // Fetch all entries for the user, ordered by date
    const { data: entries, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    // Format the data based on requested format
    let content: string
    let contentType: string
    let filename: string

    switch (format.toLowerCase()) {
      case 'csv':
        content = convertToCSV(entries)
        contentType = 'text/csv'
        filename = `daily-writing-entries-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'markdown':
      case 'md':
        content = convertToMarkdown(entries)
        contentType = 'text/markdown'
        filename = `daily-writing-entries-${new Date().toISOString().split('T')[0]}.md`
        break

      case 'json':
      default:
        content = JSON.stringify(entries, null, 2)
        contentType = 'application/json'
        filename = `daily-writing-entries-${new Date().toISOString().split('T')[0]}.json`
        break
    }

    // Return the file as a download
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export entries' }, { status: 500 })
  }
}

// Helper function to convert entries to CSV format
function convertToCSV(entries: Entry[]): string {
  if (entries.length === 0) {
    return 'No entries to export'
  }

  const headers = ['Date', 'Word Count', 'Content', 'Created At', 'Updated At']
  const rows = entries.map(entry => [
    entry.date,
    entry.word_count.toString(),
    `"${entry.content.replace(/"/g, '""')}"`, // Escape quotes in content
    entry.created_at,
    entry.updated_at,
  ])

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
}

// Helper function to convert entries to Markdown format
function convertToMarkdown(entries: Entry[]): string {
  if (entries.length === 0) {
    return '# Daily Writing Entries\n\nNo entries to export.'
  }

  const title = '# Daily Writing Entries\n\n'
  const exportDate = `*Exported on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}*\n\n`
  const totalEntries = `**Total Entries:** ${entries.length}\n\n`
  const totalWords = `**Total Words:** ${entries.reduce((sum, e) => sum + e.word_count, 0).toLocaleString()}\n\n`
  const divider = '---\n\n'

  const entriesContent = entries.map(entry => {
    const date = new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })

    return `## ${date}\n\n` +
           `**Word Count:** ${entry.word_count.toLocaleString()}\n\n` +
           `${entry.content}\n\n` +
           `---\n\n`
  }).join('')

  return title + exportDate + totalEntries + totalWords + divider + entriesContent
}
