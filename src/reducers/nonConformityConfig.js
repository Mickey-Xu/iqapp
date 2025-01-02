const initialState = {};

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case "SET_ENTITIES": {
            const { nonConformityConfig } = payload;
            return nonConformityConfig ? { ...state, ...nonConformityConfig } : state;
        }
        default:
            return state;
    }
};
