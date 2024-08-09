import { Knex } from 'knex';
import db from '../config/database';

const createUsersTable = async (trx: any) => {
	if (await db.schema.hasTable('users')) {
		return;
	}

	await db.schema
		.createTable('users', (table) => {
			table.increments('id').primary();
			table.string('username', 50).unique().notNullable();
			table.string('email', 100).unique().notNullable();
			table.string('password', 255).notNullable();
			table.string('first_name', 50).notNullable();
			table.string('last_name', 50).notNullable();
			table.boolean('is_verified').defaultTo(false);
			table.string('verification_token', 255).unique();
			table.timestamp('email_verified_at');
			table.string('password_reset_token', 255).unique();
			table.timestamp('password_reset_expires_at');
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.timestamp('updated_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createUserTokensTable = async (trx: any) => {
	if (await db.schema.hasTable('user_tokens')) {
		return;
	}

	await db.schema
		.createTable('user_tokens', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.string('token', 255).unique().notNullable();
			table.string('type', 50).notNullable(); // 'verification', 'reset', 'auth'
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.timestamp('expires_at');
		})
		.transacting(trx);
};

const createPicturesTable = async (trx: any) => {
	if (await db.schema.hasTable('pictures')) {
		return;
	}
	await db.schema
		.createTable('pictures', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.string('picture_path', 255).unique().notNullable();
			table.boolean('is_profile_picture').defaultTo(false);
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createUserProfilesTable = async (trx: any) => {
	if (await db.schema.hasTable('user_profiles')) {
		return;
	}

	await db.schema
		.createTable('user_profiles', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.string('gender', 20);
			table.string('sexual_preferences', 50);
			table.text('biography');
			table.string('gps_location', 255);
			table
				.integer('profile_picture')
				.references('id')
				.inTable('pictures');
			table.integer('fame_rating').defaultTo(0);
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.timestamp('updated_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createTagsTable = async (trx: any) => {
	if (await db.schema.hasTable('tags')) {
		return;
	}

	await db.schema
		.createTable('tags', (table) => {
			table.increments('id').primary();
			table.string('tag_name', 50).unique().notNullable();
		})
		.transacting(trx);
};

const createUserTagsTable = async (trx: any) => {
	if (await db.schema.hasTable('user_tags')) {
		return;
	}

	await db.schema
		.createTable('user_tags', (table) => {
			table.integer('user_id').references('id').inTable('users');
			table.integer('tag_id').references('id').inTable('tags');
			table.primary(['user_id', 'tag_id']);
		})
		.transacting(trx);
};

const createUserLikesTable = async (trx: any) => {
	if (await db.schema.hasTable('user_likes')) {
		return;
	}
	await db.schema
		.createTable('user_likes', (table) => {
			table.integer('liker_id').references('id').inTable('users');
			table.integer('liked_id').references('id').inTable('users');
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.primary(['liker_id', 'liked_id']);
		})
		.transacting(trx);
};

const createUserVisitsTable = async (trx: any) => {
	if (await db.schema.hasTable('user_visits')) {
		return;
	}

	await db.schema
		.createTable('user_visits', (table) => {
			table.integer('visitor_id').references('id').inTable('users');
			table.integer('visited_id').references('id').inTable('users');
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.primary(['visitor_id', 'visited_id']);
		})
		.transacting(trx);
};

const createMessagesTable = async (trx: any) => {
	if (await db.schema.hasTable('messages')) {
		return;
	}
	await db.schema
		.createTable('messages', (table) => {
			table.increments('id').primary();
			table.integer('sender_id').references('id').inTable('users');
			table.integer('receiver_id').references('id').inTable('users');
			table.text('message');
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createNotificationsTable = async (trx: any) => {
	if (await db.schema.hasTable('notifications')) {
		return;
	}
	await db.schema
		.createTable('notifications', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.string('type', 50).notNullable();
			table.boolean('is_read').defaultTo(false);
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createFameRatingsTable = async (trx: any) => {
	if (await db.schema.hasTable('fame_ratings')) {
		return;
	}
	await db.schema
		.createTable('fame_ratings', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.integer('rating').defaultTo(0);
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createReportsTable = async (trx: any) => {
	if (await db.schema.hasTable('reports')) {
		return;
	}
	await db.schema
		.createTable('reports', (table) => {
			table.increments('id').primary();
			table.integer('reporter_id').references('id').inTable('users');
			table.integer('reported_id').references('id').inTable('users');
			table.text('reason');
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createBlockedUsersTable = async (trx: any) => {
	if (await db.schema.hasTable('blocked_users')) {
		return;
	}
	await db.schema
		.createTable('blocked_users', (table) => {
			table.integer('blocker_id').references('id').inTable('users');
			table.integer('blocked_id').references('id').inTable('users');
			table.timestamp('created_at').defaultTo(db.fn.now());
			table.primary(['blocker_id', 'blocked_id']);
		})
		.transacting(trx);
};

const createSessionsTable = async (trx: any) => {
	if (await db.schema.hasTable('sessions')) {
		return;
	}

	await db.schema
		.createTable('sessions', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.string('session_token', 255).unique().notNullable();
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

const createGeoLocationsTable = async (trx: any) => {
	if (await db.schema.hasTable('geo_locations')) {
		return;
	}
	await db.schema
		.createTable('geo_locations', (table) => {
			table.increments('id').primary();
			table.integer('user_id').references('id').inTable('users');
			table.decimal('latitude', 9, 6).notNullable();
			table.decimal('longitude', 9, 6).notNullable();
			table.string('neighborhood', 255);
			table.timestamp('created_at').defaultTo(db.fn.now());
		})
		.transacting(trx);
};

// List of table creation functions
const listOfTableCreationFunctions = [
	createUsersTable,
	createUserTokensTable,
	createPicturesTable,
	createUserProfilesTable,
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

export default listOfTableCreationFunctions;
