import { useLocation } from 'react-router-dom'

export function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    // Handle undefined pathname
    if (!pathname || !nav) {
      return false
    }

    const pathArray = pathname.split('/').filter(item => item !== '')
    const navArray = nav.split('/').filter(item => item !== '')

    if (pathArray.length === 0 && navArray.length === 0) {
      return true
    }

    return pathArray[0] === navArray[0]
  }

  return { checkActiveNav }
}

export default useCheckActiveNav
