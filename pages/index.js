import { useEffect, useRef, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useRouter } from 'next/router'
import { request } from 'graphql-request'
import GQLLogin from '../graphql/login'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import CryptoJS from 'crypto-js'

export default function Index () {
  const router = useRouter()
  const toast = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  const login = (variables) => {
    return request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLLogin.LOGIN, variables)
  }

  useEffect(() => {
    const input = {
      usuario: 'plantilla'
    }
    login({ input }).then(({ login }) => {
      const loginJson = JSON.parse(CryptoJS.AES.decrypt(login, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8))
      const { login: { token } } = loginJson

      if (token) {
        setSubmitting(false)
        toast.current.show({ severity: 'success', summary: 'Info', detail: 'Acceso permitido', life: 3000 })
        sessionStorage.clear()
        sessionStorage.setItem('token', token)
        // router.push('/home')
      } else {
        setSubmitting(false)
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Acceso denegado', life: 2000 })
        sessionStorage.clear()
        // router.reload()
      }
    })
  }, [])

  if (submitting) {
    return (
    <AppLayout verHeader={false}>
      <h6>Cargando</h6>
    </AppLayout>
    )
  }

  return (
    <AppLayout verHeader={true}>
      <Toast ref={toast}/>
      <Button label="Ver Ejemplos" onClick={() => router.push('/ejemplos')}/>
    </AppLayout>
  )
}
