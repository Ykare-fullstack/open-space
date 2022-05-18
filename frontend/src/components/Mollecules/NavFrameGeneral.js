import React, { useContext } from 'react'
import '../../styles/Mollecules/NavFrame.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contexts/index'

//redirection vers la section/page désirée
function GeneralNav() {
    const { setLoginStatus } = useContext(LoginContext)
    const navigate = useNavigate()
    function logout() {
        let token = sessionStorage.getItem('token')
        let url = 'http://localhost:3001/api/checkedin/'
        let checkout = {
            method: 'DELETE',
            headers: new Headers({
                authorization: token,
            }),
        }
        fetch(url, checkout)
            .then(() => {
                sessionStorage.clear()
                setLoginStatus(false)
                navigate('/login')
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <nav className="nav-frame">
            <button onClick={logout} className="navlink-button">
                <h2>
                    logout
                    <FontAwesomeIcon
                        icon="fa-solid fa-arrow-right-from-bracket"
                        className="navigation-icon"
                    />
                </h2>
            </button>
            <button
                className="navlink-button"
                onClick={() => {
                    navigate('/Account')
                }}
            >
                <h2>
                    Compte
                    <FontAwesomeIcon
                        icon="fa-solid fa-file-arrow-up"
                        className="navigation-icon"
                    />
                </h2>
            </button>
            <button
                className="navlink-button"
                onClick={() => {
                    navigate('/')
                }}
            >
                <h2>
                    Accueil
                    <FontAwesomeIcon
                        icon="fa-solid fa-coffee"
                        className="navigation-icon"
                    />
                </h2>
            </button>
            <button
                className="navlink-button"
                onClick={() => {
                    navigate('/Research')
                }}
            >
                <h2>
                    Recherche
                    <FontAwesomeIcon
                        icon="fa-solid fa-magnifying-glass"
                        className="navigation-icon"
                    />
                </h2>
            </button>
        </nav>
    )
}

export default GeneralNav
