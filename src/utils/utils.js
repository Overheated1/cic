export const getCookie = (name) => {
const cookies = document.cookie.split(';');
for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
        return value;
    }
}
return null;
}