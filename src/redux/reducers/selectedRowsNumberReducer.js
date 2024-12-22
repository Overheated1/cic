const initialState = {};

export const selectedRowsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT_ROW_COUNT':
            const { tableId } = action.payload;
            return {
                ...state,
                [tableId]: (state[tableId] || 0) + 1,
            };

        case 'DECREMENT_ROW_COUNT':
            const { tableId: decrementTableId } = action.payload;
            return {
                ...state,
                [decrementTableId]: Math.max(0, (state[decrementTableId] || 0) - 1), 
            };

        case 'CLEAR_SELECTION':
            const { tableId: clearTableId } = action.payload;
            return {
                ...state,
                [clearTableId]: 0, 
            };
        case 'FULL_SELECTION':
            const { tableId: fullTableId,rowCount } = action.payload;
            return {
                ...state,
                [fullTableId]: rowCount, 
            };
    
        default:
            return state;
    }
};