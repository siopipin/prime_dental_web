import history from '@history'
import { setDefaultSettings, setInitialSettings } from 'app/store/actions/fuse'
import _ from '@lodash'
import store from 'app/store'
import * as Actions from 'app/store/actions'
import firebaseService from 'app/services/firebaseService'
import jwtService from 'app/services/jwtService'

export const SET_USER_DATA = '[USER] SET DATA'
export const REMOVE_USER_DATA = '[USER] REMOVE DATA'
export const USER_LOGGED_OUT = '[USER] LOGGED OUT'

/**
 * Set User Data
 */
export function setUserDataPrime(user) {
  return (dispatch) => {
    /*
        Set User Settings
         */
    dispatch(setDefaultSettings(user.data.settings))

    /*
        Set User Data
         */
    dispatch({
      type: SET_USER_DATA,
      payload: user,
    })
  }
}

/**
 * Update User Settings
 */
export function updateUserSettingsPrime(settings) {
  return (dispatch, getState) => {
    const oldUser = getState().auth.user
    const user = _.merge({}, oldUser, { data: { settings } })

    updateUserDataPrime(user)

    return dispatch(setUserDataPrime(user))
  }
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcutsPrime(shortcuts) {
  return (dispatch, getState) => {
    const user = getState().auth.user
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    }

    updateUserDataPrime(newUser)

    return dispatch(setUserDataPrime(newUser))
  }
}

/**
 * Remove User Data
 */
export function removeUserDataPrimePrime() {
  return {
    type: REMOVE_USER_DATA,
  }
}

/**
 * Logout
 */
export function logoutUser() {
  return (dispatch, getState) => {
    const user = getState().auth.user

    if (!user.role || user.role.length === 0) {
      // is guest
      return null
    }

    history.push({
      pathname: '/',
    })

    switch (user.from) {
      case 'firebase': {
        firebaseService.signOut()
        break
      }
      default: {
        jwtService.logout()
      }
    }

    dispatch(setInitialSettings())

    dispatch({
      type: USER_LOGGED_OUT,
    })
  }
}

/**
 * Update User Data
 */
function updateUserDataPrime(user) {
  if (!user.role || user.role.length === 0) {
    // is guest
    return
  }

  switch (user.from) {
    case 'firebase': {
      firebaseService
        .updateUserData(user)
        .then(() => {
          store.dispatch(
            Actions.showMessage({ message: 'User data saved to firebase' }),
          )
        })
        .catch((error) => {
          store.dispatch(Actions.showMessage({ message: error.message }))
        })
      break
    }
    default: {
      jwtService
        .updateUserData(user)
        .then(() => {
          store.dispatch(
            Actions.showMessage({ message: 'User data saved with api' }),
          )
        })
        .catch((error) => {
          store.dispatch(Actions.showMessage({ message: error.message }))
        })
      break
    }
  }
}
