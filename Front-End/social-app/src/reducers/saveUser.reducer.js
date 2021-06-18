const initialState = null;
const saveNewUser = (state = initialState, action) => {
    return {
        ...state,
        ...action.payload
    };
}

export default saveNewUser;