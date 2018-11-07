export const types = {
  LOGIN: {
    REQUEST: "LOGIN.REQUEST",
    SUCCESS: "LOGIN.SUCCESS",
    FAILURE: "LOGIN.FAILURE"
  },
  LOGOUT: {
    REQUEST: "LOGOUT.REQUEST",
    SUCCESS: "LOGOUT.SUCCESS",
    FAILURE: "LOGOUT.FAILURE"
  },
  SYNC_USER: "SYNC_USER"
};

export const login = loginCredentials => ({
  type: types.LOGIN.REQUEST,
  payload: loginCredentials
});

export const loginSuccess = credential => ({
  type: types.LOGIN.SUCCESS,
  credential
});

export const loginFailure = error => ({
  type: types.LOGIN.FAILURE,
  payload: error
});

export const logout = () => ({
  type: types.LOGOUT.REQUEST
});

export const logoutSuccess = () => ({
  type: types.LOGOUT.SUCCESS
});

export const logoutFailure = error => ({
  type: types.LOGOUT.FAILURE,
  payload: error
});

export const syncUser = user => ({
  type: types.SYNC_USER,
  payload: user
});

const initialState = {
  loading: false,
  loggedIn: false,
  user: null,
  password: null,
  loginErrorMessage: ""
};

export const getIsLoggedIn = state => state.firebaseLoginState.loggedIn;
export const getLoginErrorMessage = state =>
  state.firebaseLoginState.loginErrorMessage;

export default function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN.REQUEST:
      return {
        ...state,
        loading: true,
        email: action.payload.email,
        password: action.payload.password,
        loginErrorMessage: ""
      };
    case types.LOGOUT.REQUEST:
      return {
        ...state,
        loginErrorMessage: "",
        loading: true
      };
    case types.LOGIN.SUCCESS:
      return {
        ...state,
        loginErrorMessage: "",
        loading: false,
        loggedIn: true
      };
    case types.LOGIN.FAILURE:
      return {
        ...state,
        loading: false,
        loginErrorMessage: action.payload
      };
    case types.LOGOUT.SUCCESS:
      return {
        ...state,
        loginErrorMessage: "",
        loading: false,
        loggedIn: false
      };
    case types.LOGOUT.FAILURE:
      return {
        ...state,
        loading: false,
        loginErrorMessage: action.payload.error
      };
    case types.SYNC_USER:
      return {
        ...state,
        loggedIn: action.payload !== null,
        user: action.payload
      };
    default:
      return state;
  }
}
