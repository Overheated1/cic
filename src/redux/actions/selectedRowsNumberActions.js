export const incrementRowCountAction = (tableId) => ({
    type: 'INCREMENT_ROW_COUNT',
    payload: { tableId },
});

export const decrementRowCountAction = (tableId) => ({
    type: 'DECREMENT_ROW_COUNT',
    payload: { tableId },
});

export const clearSelectionAction = (tableId) => ({
    type: 'CLEAR_SELECTION',
    payload: { tableId },
});


export const fullSelectionAction = (tableId,rowCount) => ({
    type: 'FULL_SELECTION',
    payload: { tableId,rowCount },
});