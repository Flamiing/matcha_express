-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gender TEXT,
    sexual_preferences TEXT,
    biography TEXT,
    gps_location TEXT,
    fame_rating INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    token TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    image BYTEA,
    is_profile_picture BOOLEAN DEFAULT FALSE,
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tag_name TEXT UNIQUE NOT NULL
);

-- Create user_tags table
CREATE TABLE IF NOT EXISTS user_tags (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, tag_id)
);

-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
    liker_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    liked_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (liker_id, liked_id)
);

-- Create user_visits table
CREATE TABLE IF NOT EXISTS user_visits (
    visitor_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    visited_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    date TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (visitor_id, visited_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    receiver_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    message TEXT,
    date TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    date TIMESTAMP DEFAULT NOW()
);

-- Create fame_ratings table
CREATE TABLE IF NOT EXISTS fame_ratings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    rating INTEGER DEFAULT 0,
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reporter_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    reported_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    reason TEXT,
    date TIMESTAMP DEFAULT NOW()
);

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
    blocker_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    blocked_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (blocker_id, blocked_id)
);

-- Create geo_locations table
CREATE TABLE IF NOT EXISTS geo_locations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    neighborhood TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);