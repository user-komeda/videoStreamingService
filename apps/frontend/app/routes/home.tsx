import { Welcome } from '~/feature/welcome/welcome'

export const meta = () => {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}
const Home = () => {
  return <Welcome />
}
export default Home
