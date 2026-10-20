CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  steps INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE water_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sleep_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bedtime TIMESTAMP,
  wake_time TIMESTAMP,
  hours_slept NUMERIC(4,2),
  logged_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  daily_steps_target INTEGER DEFAULT 10000,
  daily_water_target_ml INTEGER DEFAULT 2000,
  daily_sleep_target_hours NUMERIC(4,2) DEFAULT 8,
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL DEFAULT 'walking',
  steps INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  distance_km NUMERIC(6,2),
  logged_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT activities_nonneg CHECK (steps >= 0 AND calories >= 0 AND active_minutes >= 0),
  CONSTRAINT activities_type_valid CHECK (activity_type IN ('walking', 'running', 'cycling', 'workout')),
  CONSTRAINT activities_distance_nonneg CHECK (distance_km IS NULL OR distance_km >= 0)
);

CREATE TABLE water_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sleep_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bedtime TIMESTAMP,
  wake_time TIMESTAMP,
  hours_slept NUMERIC(4,2),
  logged_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  daily_steps_target INTEGER DEFAULT 10000,
  daily_water_target_ml INTEGER DEFAULT 2000,
  daily_sleep_target_hours NUMERIC(4,2) DEFAULT 8,
  updated_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE activities ADD CONSTRAINT activities_nonneg
  CHECK (steps >= 0 AND calories >= 0 AND active_minutes >= 0) NOT VALID;
ALTER TABLE water_logs ADD CONSTRAINT water_positive
  CHECK (amount_ml > 0) NOT VALID;


SELECT data_type
FROM information_schema.columns
WHERE table_name = 'sleep_logs' AND column_name = 'logged_at';




