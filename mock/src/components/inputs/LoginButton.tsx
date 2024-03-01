import { Dispatch, SetStateAction } from 'react';

/**
 * This the interface for our login button input
 */
interface loginProps {
  isLoggedIn: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

/**
 * This function handles all of the login button functionality.
 * 
 * @param props implements the loginProps interface
 * @returns new button based on previous state
 */
export function LoginButton(props: loginProps) {

  const authenticate = () => {
    const newValue = !props.isLoggedIn
    props.setIsLoggedIn(newValue)
    return newValue
  }

  if (props.isLoggedIn) {
    return (
      <button aria-label='Sign Out' onClick={authenticate}>Sign out</button>
    )
  } else {
    return (
      <button aria-label='Login' onClick={authenticate}>Login</button>
    )
  }
}