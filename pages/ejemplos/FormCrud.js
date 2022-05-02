import { Fragment, useContext } from 'react'
import { PersonaContext } from './crud'
import { request } from 'graphql-request'
import { useSesion } from '../../hooks/useSesion'
import GQLPlantilla from '../../graphql/plantilla'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

function FormCrud () {
  const { toast, dataGrupos, personaDialog, emptyPersona, persona, setPersona, setSubmitted, setPersonaDialog, mutate } = useContext(PersonaContext)

  const { token } = useSesion()
  const guardarPersona = (variables) => {
    return request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLPlantilla.SAVE_PERSONA, variables, { authorization: `Bearer ${token}` })
  }

  const hideDialog = () => {
    setSubmitted(false)
    setPersonaDialog(false)
  }

  const savePersona = (e) => {
    e.preventDefault()
    const { nombre, telefono, id_grupo } = persona
    if (!nombre || !telefono || !id_grupo) {
      toast.current.show({ severity: 'warn', summary: '', detail: 'Debe completar el formulario.', life: 3000 })
      return
    }
    setSubmitted(true)
    delete persona.grupo
    guardarPersona({ input: persona })
      .then(() => {
        mutate()
        setSubmitted(false)
        toast.current.show({ severity: 'success', summary: '', detail: 'Persona guardada exitosamente.', life: 3000 })
        setPersona(emptyPersona)
        setPersonaDialog(false)
      })
      .catch(({ response: { errors } }) => {
        setSubmitted(false)
        const mensajes = errors.map(e => ({ severity: 'error', summary: '', detail: e.message, life: 3000 }))
        toast.current.show(mensajes)
      })
  }

  const personaDialogFooter = (
    <Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
      <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={savePersona}/>
    </Fragment>
  )

  return (
    <Dialog visible={personaDialog} style={{ width: '25rem' }} header="Datos de Persona" modal className="p-fluid" footer={personaDialogFooter} onHide={hideDialog}>
      <div className="grid gap-y-4 mt-4">
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
                       onChange={({ target: { value } }) => setPersona(ps => ({ ...ps, telefono: value || persona.telefono }))}/>
            <label htmlFor="telefono">Teléfono</label>
          </div>
        </div>
        <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-users text-xl"/>
        </span>
          <span className="p-float-label">
          <Dropdown id="grupo" value={persona.id_grupo} options={dataGrupos?.grupos} optionLabel="grupo" optionValue="id"
                    onChange={({ value }) => setPersona(ps => ({ ...ps, id_grupo: value }))}/>
          <label htmlFor="grupo">Grupo</label>
        </span>
        </div>
      </div>
    </Dialog>
  )
}

export default FormCrud
