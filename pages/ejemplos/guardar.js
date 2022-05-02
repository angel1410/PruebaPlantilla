import { useRef, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { useRouter } from 'next/router'
import { request } from 'graphql-request'
import useSWR from 'swr'
import GQLPlantilla from '../../graphql/plantilla'
import { useSesion } from '../../hooks/useSesion'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

export default function Guardar () {
  const router = useRouter()
  const toast = useRef(null)
  const [persona, setPersona] = useState({
    nombre: '',
    telefono: null,
    id_grupo: null
  })
  const [submitting, setSubmitting] = useState(false)

  const { token } = useSesion()
  const { data } = useSWR(token ? [GQLPlantilla.GET_GRUPOS, {}, token] : null)

  const guardarPersona = (variables) => {
    return request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLPlantilla.SAVE_PERSONA, variables, { authorization: `Bearer ${token}` })
  }

  const guardar = (e) => {
    e.preventDefault()
    const { nombre, telefono, id_grupo } = persona
    if (!nombre || !telefono || !id_grupo) {
      toast.current.show({ severity: 'warn', summary: '', detail: 'Debe completar el formulario.', life: 3000 })
      return
    }
    setSubmitting(true)
    guardarPersona({ input: persona })
      .then(() => {
        setSubmitting(false)
        toast.current.show({ severity: 'success', summary: '', detail: 'Persona guardada exitosamente.', life: 3000 })
        setPersona({
          nombre: '',
          telefono: null,
          id_grupo: null
        })
        document.querySelector('#nombre').classList.remove('p-filled')
      })
      .catch(({ response: { errors } }) => {
        setSubmitting(false)
        const mensajes = errors.map(e => ({ severity: 'error', summary: '', detail: e.message, life: 3000 }))
        toast.current.show(mensajes)
      })
  }

  return (
    <AppLayout>
      <Toast ref={toast} onShow={() => setTimeout(() => toast?.current?.clear(), 3000)}/>
      <div className="p-card px-8 py-4 shadow-2xl">
        <h6 className="text-center mb-2 text-2xl font-bold">Guardar Persona</h6>
        <div className="grid gap-y-4">
          <div className="p-inputgroup">
            <div className="p-inputgroup-addon">
              <i className="pi pi-user text-xl"/>
            </div>
            <div className="p-float-label">
              <InputText id="nombre" autoComplete="off" value={persona.nombre}
                         onChange={({ target: { value } }) => setPersona(ps => ({ ...ps, nombre: value }))}/>
              <label htmlFor="nombre">Nombre</label>
            </div>
          </div>
          <div className="p-inputgroup">
            <div className="p-inputgroup-addon">
              <i className="pi pi-phone text-xl"/>
            </div>
            <div className="p-float-label">
              <InputMask id="telefono" mask="(9999) 999-9999" value={persona.telefono}
                         onChange={({ target: { value } }) => setPersona(ps => ({ ...ps, telefono: value }))}/>
              <label htmlFor="telefono">Teléfono</label>
            </div>
          </div>
          <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-users text-xl"/>
              </span>
            <span className="p-float-label">
                <Dropdown id="grupo" value={persona.id_grupo} options={data?.grupos} optionLabel="grupo" optionValue="id"
                          onChange={({ value }) => setPersona(ps => ({ ...ps, id_grupo: value }))}/>
                <label htmlFor="grupo">Grupo</label>
              </span>
          </div>

          <Button label="Guardar" onClick={guardar} disabled={submitting}/>
          <Button label="Volver" onClick={() => router.back()}/>
        </div>
      </div>
    </AppLayout>
  )
}
