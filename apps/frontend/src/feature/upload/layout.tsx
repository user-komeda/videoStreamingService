import { useState } from 'react'

import Uppy from '@uppy/core'
import { UppyContextProvider } from '@uppy/react'
import Tus from '@uppy/tus'
import { Outlet } from 'react-router'
const createUppy = () => {
  return new Uppy({ debug: true, autoProceed: true }).use(Tus, {
    endpoint: 'http://localhost:8080/files/',
  })
}
const Layout = () => {
  const [uppy] = useState(createUppy)
  return (
    <UppyContextProvider uppy={uppy}>
      <Outlet />
    </UppyContextProvider>
  )
}
export default Layout
