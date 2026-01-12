import Uppy from '@uppy/core'
import { UppyContextProvider } from '@uppy/react'
import Tus from '@uppy/tus'
import { useState } from 'react'
import { layout } from '@react-router/dev/routes'
import { Outlet } from 'react-router'
const createUppy = () => {
  return new Uppy().use(Tus, { endpoint: '/api/upload' })
}
const Layout = () => {
  const [uppy] = useState(createUppy)
  return (
    <>
      <div>layout</div>
    </>
  )
}
export default Layout
