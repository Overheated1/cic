export const showAlert = (text, duration) => ({
    type: 'SHOW_ALERT',
    payload: { text, duration }
});