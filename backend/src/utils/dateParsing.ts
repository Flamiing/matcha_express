// src/utils/dateParsing.ts

/**
 * Convert a duration string to milliseconds.
 * Supported formats:
 * - '7d' (7 days)
 * - '1h' (1 hour)
 * - '30m' (30 minutes)
 * - '15s' (15 seconds)
 *
 * To use this function, you must provide a duration string in the format of a
 * number followed by a unit.
 * The unit can be the following: 'd' (days), 'h' (hours), 'm' (minutes), 's' (seconds).
 * e.g. '7d' for 7 days, '1h' for 1 hour, '30m' for 30 minutes, '15s' for 15 seconds.
 * usage: expires_at = new Date(Date.now() + parseDuration(process.env.VERIFICATION_TOKEN_EXPIRY || '1d'))
 */
export const parseDuration = (duration: string): number => {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) {
        throw new Error('Invalid duration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 'd':
            return value * 24 * 60 * 60 * 1000; // days to milliseconds
        case 'h':
            return value * 60 * 60 * 1000; // hours to milliseconds
        case 'm':
            return value * 60 * 1000; // minutes to milliseconds
        case 's':
            return value * 1000; // seconds to milliseconds
        default:
            throw new Error('Invalid duration unit');
    }
};
