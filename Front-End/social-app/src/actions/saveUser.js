const saveUser = (newUser) => {
    return {
        type: "SAVEUSER",
        payload: newUser
    }
}


export default saveUser;