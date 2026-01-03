class UserDto {
	static #preferencesToObject(preferences) {
		if (!preferences) return undefined;
		if (preferences instanceof Map) return Object.fromEntries(preferences);
		if (typeof preferences === 'object') return preferences;
		return undefined;
	}

	static minimal(user) {
		return {
			id: user?._id,
			name: user?.name,
			email: user?.email,
			preferences: UserDto.#preferencesToObject(user?.preferences),
		};
	}

	static detailed(user) {
		return {
			id: user?._id,
			name: user?.name,
			email: user?.email,
			preferences: UserDto.#preferencesToObject(user?.preferences),
			currency: user?.currency || user?.defaultCurrency,
		};
	}

	static preferences(user) {
		const preferences = user?.preferences;
		const languagePreference =
			preferences?.get?.('language') ?? preferences?.language;

		return {
			languagePreference,
			currency: user?.currency || user?.defaultCurrency,
		};
	}
}

module.exports = UserDto;
