import * as UserActionsPrime from './user.actions'
import jwtService from 'app/services/jwtService'

export const REGISTER_ERROR = 'REGISTER_ERROR'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'

export function submitRegisterPrime({ displayName, password, email }) {
  return (dispatch) =>
    jwtService
      .createUser({
        displayName,
        password,
        email,
      })
      .then((user) => {
        dispatch(UserActionsPrime.setUserDataPrime(user))
        return dispatch({
          type: REGISTER_SUCCESS,
        })
      })
      .catch((error) => {
        return dispatch({
          type: REGISTER_ERROR,
          payload: error,
        })
      })
}
