import AppLayout from '../../components/AppLayout'
import Link from 'next/link'
import { Fieldset } from 'primereact/fieldset'

function Index () {
  return (
    <AppLayout>
      <Fieldset legend="Sólo llenar tabla desde Base de Datos" className="w-full md:w-2/3 2xl:w-1/2 mb-4">
        <Link href="/ejemplos/tabla">
          <a className="text-2xl"><i className="pi pi-code text-blue-600 text-2xl font-bold mr-2"/>Ir al ejemplo</a>
        </Link>
      </Fieldset>
      <Fieldset legend="Sólo guardar formulario en Base de Datos" className="w-full md:w-2/3 2xl:w-1/2">
        <Link href="/ejemplos/guardar">
          <a className="text-2xl"><i className="pi pi-code text-blue-600 text-2xl font-bold mr-2"/>Ir al ejemplo</a>
        </Link>
      </Fieldset>
      <Fieldset legend="CRUD" className="w-full md:w-2/3 2xl:w-1/2 mt-4">
        <Link href="/ejemplos/crud">
          <a className="text-2xl"><i className="pi pi-code text-blue-600 text-2xl font-bold mr-2"/>Ir al ejemplo</a>
        </Link>
      </Fieldset>

    </AppLayout>
  )
}

export default Index
