import { useRef, useState, Fragment, createContext } from 'react'
import AppLayout from '../../components/AppLayout'
import { useRouter } from 'next/router'
import { useSesion } from '../../hooks/useSesion'
import { request } from 'graphql-request'
import useSWR from 'swr'
import GQLPlantilla from '../../graphql/plantilla'
import FormCrud from './FormCrud'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { ProgressBar } from 'primereact/progressbar'

const PersonaContext = createContext()

export default function Crud () {
  const toast = useRef(null)
  const router = useRouter()
  const emptyPersona = {
    nombre: '',
    telefono: null,
    id_grupo: null
  }
  const [submitted, setSubmitted] = useState(false)
  const [personaDialog, setPersonaDialog] = useState(false)
  const [persona, setPersona] = useState(emptyPersona)
  const [selectedPersonas, setSelectedPersonas] = useState(null)
  const [globalFilter, setGlobalFilter] = useState(null)
  const [deletePersonaDialog, setDeletePersonaDialog] = useState(false)
  const [deletePersonasDialog, setDeletePersonasDialog] = useState(false)

  const { token } = useSesion()
  const { data: dataGrupos } = useSWR(token ? [GQLPlantilla.GET_GRUPOS, {}, token] : null)
  const { data: dataPersonas, error, mutate } = useSWR(token ? [GQLPlantilla.GET_PERSONAS, {}, token] : null)

  const borrarPersona = (variables) => {
    return request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLPlantilla.DELETE_PERSONA, variables, { authorization: `Bearer ${token}` })
  }
  const borrarPersonas = (variables) => {
    return request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLPlantilla.DELETE_PERSONAS, variables, { authorization: `Bearer ${token}` })
  }

  const contextValues = {
    toast, dataGrupos, personaDialog, emptyPersona, persona, setPersona, setSubmitted, setPersonaDialog, mutate
  }

  const editPersona = (persona) => {
    setPersona({ ...persona })
    setPersonaDialog(true)
  }

  const confirmDeletePersona = (persona) => {
    setPersona(persona)
    setDeletePersonaDialog(true)
  }

  const openNew = () => {
    setPersona(emptyPersona)
    setSubmitted(false)
    setPersonaDialog(true)
  }
  const confirmDeleteSelected = () => {
    setDeletePersonasDialog(true)
  }

  const header = (
    <div className="table-header text-left">
      <h5 className="mx-0 my-1 text-center text-3xl font-bold text-indigo-900">Gestionar Personas</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search"/>
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..."/>
      </span>
    </div>
  )

  const hideDeletePersonaDialog = () => {
    setDeletePersonaDialog(false)
  }

  const hideDeletePersonasDialog = () => {
    setDeletePersonasDialog(false)
  }
  const deletePersona = () => {
    setSubmitted(true)
    borrarPersona({ id: persona.id })
      .then(() => {
        mutate()
        setSubmitted(false)
        setDeletePersonaDialog(false)
        toast.current.show({ severity: 'success', summary: '', detail: 'Persona eliminada exitosamente.', life: 3000 })
      })
      .catch(({ response: { errors } }) => {
        setSubmitted(false)
        const mensajes = errors.map(e => ({ severity: 'error', summary: '', detail: e.message, life: 3000 }))
        toast.current.show(mensajes)
      })
  }

  const deleteSelectedPersonas = () => {
    setSubmitted(true)
    borrarPersonas({ ids: selectedPersonas.map(p => p.id) })
      .then(() => {
        mutate()
        setSubmitted(false)
        setDeletePersonasDialog(false)
        setSelectedPersonas(null)
        toast.current.show({ severity: 'success', summary: '', detail: 'Personas eliminadas exitosamente.', life: 3000 })
      })
      .catch(({ response: { errors } }) => {
        setSubmitted(false)
        const mensajes = errors.map(e => ({ severity: 'error', summary: '', detail: e.message, life: 3000 }))
        toast.current.show(mensajes)
      })
  }
  const deletePersonaDialogFooter = (
    <Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePersonaDialog}/>
      <Button label="Sí" icon="pi pi-check" className="p-button-success" onClick={deletePersona}/>
    </Fragment>
  )
  const deletePersonasDialogFooter = (
    <Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePersonasDialog}/>
      <Button label="Sí" icon="pi pi-check" className="p-button-success" onClick={deleteSelectedPersonas}/>
    </Fragment>
  )

  const leftToolbarTemplate = () => {
    return (
      <Fragment>
        <Button label="Nueva" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew}/>
        <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPersonas || !selectedPersonas.length}/>
      </Fragment>
    )
  }

  const bodyTelefono = (row) => {
    return (
      <span>({row.telefono.substring(0, 4)}) {row.telefono.substring(4, 7)}-{row.telefono.substring(7)}</span>
    )
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPersona(rowData)}/>
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePersona(rowData)}/>
      </Fragment>
    )
  }

  if (!dataPersonas && !error) {
    return (
      <AppLayout verHeader={false}>
        <h6 className="text-3xl font-bold">Cargando...</h6>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Toast ref={toast} onShow={() => setTimeout(() => toast?.current?.clear(), 3000)}/>
      <div className="p-card text-center w-full lg:w-2/3">
        <Toolbar left={leftToolbarTemplate}/>
        <DataTable value={dataPersonas?.personas} selection={selectedPersonas} onSelectionChange={(e) => setSelectedPersonas(e.value)}
                   dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header}
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                   currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} personas" responsiveLayout="scroll">
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}/>
          <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }}/>
          <Column field="nombre" header="Nombre" sortable style={{ minWidth: '16rem' }}/>
          <Column field="telefono" header="Teléfono" sortable body={bodyTelefono}/>
          <Column field="grupo" header="Grupo" sortable style={{ minWidth: '8rem' }}/>
          <Column body={actionBodyTemplate} style={{ minWidth: '8rem' }}/>
        </DataTable>
        <div className="my-4">
          <Button label="Volver" onClick={() => router.back()}/>
        </div>
      </div>
      <PersonaContext.Provider value={contextValues}>
        <FormCrud/>
      </PersonaContext.Provider>
      <Dialog visible={deletePersonaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePersonaDialogFooter} onHide={hideDeletePersonaDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
          {persona && <span>¿Desea eliminar a <b>{persona.nombre}</b>?</span>}
        </div>
      </Dialog>
      <Dialog visible={deletePersonasDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePersonasDialogFooter} onHide={hideDeletePersonasDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
          {persona && <span>¿Desea eliminar a todas las personas seleccionadas?</span>}
        </div>
      </Dialog>
      <Dialog visible={submitted} className="w-96 h-10" showHeader={false} modal onHide={() => setSubmitted(false)}>
        <ProgressBar mode="indeterminate" className="mt-4" style={{ height: '6px' }}/>
      </Dialog>
    </AppLayout>
  )
}

export { PersonaContext }
