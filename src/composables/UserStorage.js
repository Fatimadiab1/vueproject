export function useStorage() {
    const storeUserData = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const getUserData = () => {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    };

    const clearUserData = () => {
        localStorage.removeItem('user');
    };

    return {
        storeUserData,
        getUserData,
        clearUserData
    };
}
