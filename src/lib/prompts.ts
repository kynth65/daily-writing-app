export interface WritingPrompt {
  id: number
  category: 'reflection' | 'creativity' | 'gratitude' | 'goals' | 'memories'
  prompt: string
}

export const writingPrompts: WritingPrompt[] = [
  // Reflection
  { id: 1, category: 'reflection', prompt: 'What was the most meaningful moment of your day today?' },
  { id: 2, category: 'reflection', prompt: 'What challenged you today, and how did you respond?' },
  { id: 3, category: 'reflection', prompt: 'What did you learn about yourself this week?' },
  { id: 4, category: 'reflection', prompt: 'How have you grown in the past month?' },
  { id: 5, category: 'reflection', prompt: 'What emotions dominated your day, and why?' },

  // Gratitude
  { id: 6, category: 'gratitude', prompt: 'List three things you\'re grateful for today and why.' },
  { id: 7, category: 'gratitude', prompt: 'Who made a positive impact on your life recently?' },
  { id: 8, category: 'gratitude', prompt: 'What simple pleasure brought you joy today?' },
  { id: 9, category: 'gratitude', prompt: 'What opportunities are you thankful for right now?' },
  { id: 10, category: 'gratitude', prompt: 'What aspects of your daily routine do you appreciate most?' },

  // Creativity
  { id: 11, category: 'creativity', prompt: 'If you could live anywhere in the world, where would it be and why?' },
  { id: 12, category: 'creativity', prompt: 'Describe your perfect day from start to finish.' },
  { id: 13, category: 'creativity', prompt: 'If you could have dinner with anyone, who would it be and what would you ask them?' },
  { id: 14, category: 'creativity', prompt: 'Write about a place that holds special meaning to you.' },
  { id: 15, category: 'creativity', prompt: 'Imagine your life 10 years from now. What does it look like?' },

  // Goals
  { id: 16, category: 'goals', prompt: 'What are your top three priorities this month?' },
  { id: 17, category: 'goals', prompt: 'What habit would you like to develop, and why?' },
  { id: 18, category: 'goals', prompt: 'What progress have you made towards your goals this week?' },
  { id: 19, category: 'goals', prompt: 'What\'s one thing you want to accomplish before the year ends?' },
  { id: 20, category: 'goals', prompt: 'What steps can you take tomorrow to move closer to your dreams?' },

  // Memories
  { id: 21, category: 'memories', prompt: 'Write about a childhood memory that still makes you smile.' },
  { id: 22, category: 'memories', prompt: 'Describe a time when you overcame a significant challenge.' },
  { id: 23, category: 'memories', prompt: 'What\'s your favorite memory from the past year?' },
  { id: 24, category: 'memories', prompt: 'Write about someone who influenced your life in a meaningful way.' },
  { id: 25, category: 'memories', prompt: 'What\'s a lesson you learned the hard way?' },

  // Additional prompts
  { id: 26, category: 'reflection', prompt: 'What are you avoiding right now, and why?' },
  { id: 27, category: 'reflection', prompt: 'How do you handle stress and pressure?' },
  { id: 28, category: 'gratitude', prompt: 'What skills or talents are you grateful to have?' },
  { id: 29, category: 'creativity', prompt: 'If you could master any skill instantly, what would it be?' },
  { id: 30, category: 'goals', prompt: 'What does success mean to you personally?' },
]

/**
 * Get a prompt for a specific date
 * Uses the day of the year to ensure consistency
 */
export function getPromptForDate(date: Date): WritingPrompt {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const promptIndex = dayOfYear % writingPrompts.length
  return writingPrompts[promptIndex]
}

/**
 * Get today's prompt
 */
export function getTodayPrompt(): WritingPrompt {
  return getPromptForDate(new Date())
}

/**
 * Get a random prompt
 */
export function getRandomPrompt(): WritingPrompt {
  const randomIndex = Math.floor(Math.random() * writingPrompts.length)
  return writingPrompts[randomIndex]
}

/**
 * Get prompts by category
 */
export function getPromptsByCategory(
  category: WritingPrompt['category']
): WritingPrompt[] {
  return writingPrompts.filter((p) => p.category === category)
}
