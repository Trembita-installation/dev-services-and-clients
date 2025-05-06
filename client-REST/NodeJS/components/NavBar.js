// components/NavBar.js

// Імпортуємо компоненти з бібліотек
import Link from 'next/link'
import { Container, Nav, Navbar } from 'react-bootstrap'

// Компонент навігаційного меню
const NavBar = ({ selectedPerson }) => {
	return (
		// Верхнє меню навігації
		<Navbar bg='dark' variant='dark' expand='lg'>
			<Container>
				<Navbar.Brand href='/'>Электронний реєстр</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='mr-auto'>
						<Link className='nav-link' href={'/'}>
							Головна
						</Link>
						<Link className='nav-link' href={'/add-person'}>
							Додати особу до реєстру
						</Link>
						<Link className='nav-link' href={'/find-person'}>
							Знайти особу в реєстрі
						</Link>
						{selectedPerson && (
							<Link className='nav-link' href={'/read-person'}>
								Профіль особи: {selectedPerson.name} {selectedPerson.surname}
							</Link>
						)}
						<Link className='nav-link' href={'/download-asic'}>
							Завантажити ASiC
						</Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
// Експортуємо компонент навігаційного меню
export default NavBar
