import Link from 'next/link'
import { AppBar, Container, MenuItem, Toolbar } from '@mui/material'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Link href="/">
            <MenuItem>Home</MenuItem>
          </Link>

          <Link href="/offense">
            <MenuItem>Offense</MenuItem>
          </Link>

          <Link href="/time">
            <MenuItem>Time</MenuItem>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
