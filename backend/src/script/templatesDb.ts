// src/script/schema.ts

const createRolesTable = `
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT REFERENCES roles(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255) UNIQUE,
  email_verified_at TIMESTAMP,
  password_reset_token VARCHAR(255) UNIQUE,
  password_reset_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUserTokensTable = `
CREATE TABLE IF NOT EXISTS user_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'verification', 'reset', 'auth'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id_type ON user_tokens(user_id, type);
`;

const createPicturesTable = `
CREATE TABLE IF NOT EXISTS pictures (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  picture_path VARCHAR(255) UNIQUE NOT NULL,
  is_profile_picture BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON pictures(user_id);
`;

const createUserProfilesTable = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  gender VARCHAR(20),
  sexual_preferences VARCHAR(50),
  biography TEXT,
  gps_location VARCHAR(255),
  profile_picture INT REFERENCES pictures(id),
  fame_rating INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON user_profiles(user_id);
`;

const createTagsTable = `
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50) UNIQUE NOT NULL
);
`;

const createUserTagsTable = `
CREATE TABLE IF NOT EXISTS user_tags (
  user_id INT REFERENCES users(id),
  tag_id INT REFERENCES tags(id),
  PRIMARY KEY (user_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_user_id_tag_id ON user_tags(user_id, tag_id);
`;

const createUserLikesTable = `
CREATE TABLE IF NOT EXISTS user_likes (
  liker_id INT REFERENCES users(id),
  liked_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (liker_id, liked_id)
);
CREATE INDEX IF NOT EXISTS idx_liker_id ON user_likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_liked_id ON user_likes(liked_id);
`;

const createUserVisitsTable = `
CREATE TABLE IF NOT EXISTS user_visits (
  visitor_id INT REFERENCES users(id),
  visited_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visitor_id, visited_id)
);
CREATE INDEX IF NOT EXISTS idx_visitor_id ON user_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visited_id ON user_visits(visited_id);
`;

const createMessagesTable = `
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_receiver_id ON messages(receiver_id);
`;

const createNotificationsTable = `
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON notifications(user_id);
`;

const createFameRatingsTable = `
CREATE TABLE IF NOT EXISTS fame_ratings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  rating INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON fame_ratings(user_id);
`;

const createReportsTable = `
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id INT REFERENCES users(id),
  reported_id INT REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reported_id ON reports(reported_id);
`;

const createBlockedUsersTable = `
CREATE TABLE IF NOT EXISTS blocked_users (
  blocker_id INT REFERENCES users(id),
  blocked_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (blocker_id, blocked_id)
);
CREATE INDEX IF NOT EXISTS idx_blocker_id ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_id ON blocked_users(blocked_id);
`;

const createSessionsTable = `
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON sessions(user_id);
`;

const createGeoLocationsTable = `
CREATE TABLE IF NOT EXISTS geo_locations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  neighborhood VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_id ON geo_locations(user_id);
`;

const listOfTables = [
    createRolesTable,
    createUsersTable,
    createPicturesTable,
    createUserProfilesTable,
    createUserTokensTable,
    createTagsTable,
    createUserTagsTable,
    createUserLikesTable,
    createUserVisitsTable,
    createMessagesTable,
    createNotificationsTable,
    createFameRatingsTable,
    createReportsTable,
    createBlockedUsersTable,
    createSessionsTable,
    createGeoLocationsTable,
];

export default listOfTables;
