import bcrypt from 'bcrypt';

export const comparePasswords = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

export const passwordChangedAfter = (JWTTimestamp, passwordChangedAt) => {
    if (passwordChangedAt) {
        const changesTimestamp = parseInt(passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changesTimestamp;
    }
    return false;
}