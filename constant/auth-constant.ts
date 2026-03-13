
export const INITIAL_STATE_LOGIN = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: []
    }
}

export const INITIAL_STATE_SIGNUP = {
    status: 'idle',
    errors: {
        name: [],
        email: [],
        password: [],
        confirm_password: [],
        _form: []
    }
}

export const INITIAL_USER = {
    id: "",
    name: "",
    email: "",
    avatar_url: ""
}
