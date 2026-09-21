import { useState } from 'react'
import { Outlet } from 'react-router'

import { UppyContextProvider } from '@uppy/react'

import { createUppy } from '~/feature/upload/uppy'

const Layout = () => {
  const [uppy] = useState(createUppy)
  return (
    <UppyContextProvider uppy={uppy}>
      <Outlet />
    </UppyContextProvider>
  )
}

export default Layout
