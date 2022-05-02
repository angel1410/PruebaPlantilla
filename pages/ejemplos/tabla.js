import AppLayout from '../../components/AppLayout'
import { useRouter } from 'next/router'
import { useSesion } from '../../hooks/useSesion'
import useSWR from 'swr'
import GQLPlantilla from '../../graphql/plantilla'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

function Tabla () {
  const router = useRouter()
  const { token } = useSesion()
  const { data, error } = useSWR(token ? [GQLPlantilla.GET_PERSONAS, {}, token] : null)

  if (!data && !error) {
    return (
      <AppLayout verHeader={false}>
        <h6 className="text-3xl font-bold">Cargando...</h6>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <h6 className="text-3xl font-bold">Tabla de Personas</h6>
      <DataTable value={data?.personas} paginator responsiveLayout="stack"
                 paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                 currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}>
        <Column field="id" header="ID"/>
        <Column field="nombre" header="Nombre"/>
        <Column field="grupo" header="Grupo"/>
      </DataTable>
      <div className="mt-4">
        <Button label="Volver" onClick={() => router.back()}/>
      </div>
    </AppLayout>
  )
}

export default Tabla
