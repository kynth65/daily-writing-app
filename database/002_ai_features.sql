-- Migration: AI Features (Sentiment Analysis & Reflections)
-- Description: Adds sentiment tracking to entries and AI-generated reflections

-- Add sentiment and emotion tracking to entries table
ALTER TABLE entries
ADD COLUMN sentiment VARCHAR(20),
ADD COLUMN emotion VARCHAR(50),
ADD COLUMN mood_score DECIMAL(3,2) CHECK (mood_score >= -1 AND mood_score <= 1);

COMMENT ON COLUMN entries.sentiment IS 'Overall sentiment: positive, neutral, negative';
COMMENT ON COLUMN entries.emotion IS 'Detected primary emotion: joy, sadness, anxiety, calm, etc.';
COMMENT ON COLUMN entries.mood_score IS 'Numerical mood score from -1 (very negative) to 1 (very positive)';

-- Create reflections table for AI-generated insights
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reflection_type VARCHAR(20) NOT NULL CHECK (reflection_type IN ('weekly', 'monthly', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  entry_count INTEGER NOT NULL DEFAULT 0,
  themes JSONB DEFAULT '[]'::jsonb,
  insights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE reflections IS 'AI-generated reflections and insights from user entries';
COMMENT ON COLUMN reflections.themes IS 'Array of identified themes in entries';
COMMENT ON COLUMN reflections.insights IS 'Array of key insights and observations';

-- Create index on user_id and created_at for efficient querying
CREATE INDEX idx_reflections_user_created ON reflections(user_id, created_at DESC);
CREATE INDEX idx_reflections_period ON reflections(user_id, period_end DESC);

-- Add updated_at trigger for reflections
CREATE TRIGGER set_reflections_updated_at
  BEFORE UPDATE ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on reflections
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reflections
CREATE POLICY "Users can view their own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections"
  ON reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON reflections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
  ON reflections FOR DELETE
  USING (auth.uid() = user_id);

-- Add premium subscription fields to user_settings
ALTER TABLE user_settings
ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled', 'expired')),
ADD COLUMN subscription_ends_at TIMESTAMPTZ;

COMMENT ON COLUMN user_settings.is_premium IS 'Whether user has active premium subscription';
COMMENT ON COLUMN user_settings.subscription_status IS 'Current subscription status';
COMMENT ON COLUMN user_settings.subscription_ends_at IS 'When premium subscription expires';

-- Create view for recent mood trends (last 30 days)
CREATE OR REPLACE VIEW mood_trends AS
SELECT
  user_id,
  date,
  AVG(mood_score) as avg_mood,
  COUNT(*) as entry_count,
  ARRAY_AGG(DISTINCT emotion) FILTER (WHERE emotion IS NOT NULL) as emotions
FROM entries
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
  AND mood_score IS NOT NULL
GROUP BY user_id, date
ORDER BY date DESC;

COMMENT ON VIEW mood_trends IS 'Aggregated mood trends over the last 30 days';

-- Grant access to authenticated users
GRANT SELECT ON mood_trends TO authenticated;
