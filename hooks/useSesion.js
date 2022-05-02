import { useEffect, useState } from 'react'
import useSWR from 'swr'
import GQLLogin from '../graphql/login'
import CryptoJS from 'crypto-js'

export const useSesion = () => {
  const [token, setToken] = useState(null)
  const { data, error } = useSWR((token) ? [GQLLogin.USER, {}, token] : null)

  useEffect(() => {
    setToken(sessionStorage.getItem('token'))
  }, [])

  useEffect(() => {
    if (data?.user) {
      const userJson = JSON.parse(CryptoJS.AES.decrypt(data.user, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8))
      sessionStorage.setItem('token', userJson.token)
      setToken(userJson.token)
    }
  }, [data])

  return {
    error,
    token
  }
}
