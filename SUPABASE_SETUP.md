# Supabase Setup for Technical Talent Hunt

Run the following SQL in your Supabase SQL Editor to create the necessary tables and policies.

## 1. Create Questions Table

```sql
-- Create the questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_answer INTEGER NOT NULL, -- Index (0-3)
  is_active BOOLEAN DEFAULT false,
  team TEXT NOT NULL, -- 'Team A', 'Team B', etc.
  level INTEGER NOT NULL -- 1, 2, 3...
);

-- Enable Realtime for the questions table
ALTER PUBLICATION supabase_realtime ADD TABLE questions;

-- Create an index for faster lookups of active questions
CREATE INDEX idx_questions_active ON questions (is_active) WHERE is_active = true;
```

## 2. Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read ONLY active questions
CREATE POLICY "Allow read active questions" ON questions
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow admin (authenticated) to manage all questions
-- Note: For a real app, you'd use Supabase Auth to restrict this.
-- For now, we'll assume the admin uses the Supabase dashboard or a secret key.
CREATE POLICY "Allow admin full access" ON questions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Sample Data Migration (Optional)

You can use the following SQL to insert some initial questions:

```sql
INSERT INTO questions (question, options, correct_answer, team, level, is_active) VALUES
('What is the full form of CPU?', '["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Control Unit"]', 1, 'Team A', 1, false),
('Who is the father of C language?', '["James Gosling", "Bjarne Stroustrup", "Dennis Ritchie", "Guido van Rossum"]', 2, 'Team A', 2, false);
```
