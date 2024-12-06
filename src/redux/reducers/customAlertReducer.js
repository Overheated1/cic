const initialState = {
    showAlert: false,
    alertText: '',
    alertDuration: 3000
};
  
export const customAlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_ALERT':
        return {
            ...state,
            showAlert: true,
            alertText: action.payload.text,
            alertDuration: action.payload.duration
        };
        default:
        return state;
    }
};
