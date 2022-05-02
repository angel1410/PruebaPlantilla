import { Fragment, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Header.module.css'
/* import logo from '../public/Intranet2.0/LogoHeader.png'
import titulo from '../public/Intranet2.0/TituloHeader.png' */
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'

export default function Header ({ verMenu }) {
  const router = useRouter()
  const menu = useRef(null)
  const { cache } = useSWRConfig()
  const hoy = new Date()
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const Salir = (e) => {
    e.preventDefault()
    sessionStorage.clear()
    sessionStorage.setItem('token', null)
    cache.clear()
    router.push('/')
  }

  return (
    <header id="header-principal" className={styles.header}>
      <div className="w-full text-right">
        <span className="text-white mr-3 font-bold text-xs md:text-base">{`${dias[hoy.getDay()]} ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`}</span>
      </div>

      <div className="w-10 md:w-5 mx-auto text-center">
        <div className="inline-block w-2">
          {/* <Image src={logo} layout="responsive" alt="Logo"/> */}
        </div>
        <div className="inline-block w-8">
          {/* <Image src={titulo} layout="responsive" alt="Titulo" priority={true}/> */}
        </div>
      </div>
    </header>
  )
}
