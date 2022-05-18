import '../styles/Pages/Login.css'
import React from 'react'
import { NavLink } from 'react-router-dom'
import IdentificationForm from '../components/Mollecules/IdentificationForm'

//Page de login avec lien vers Signup
//les champs de saisie sont dans <IdentificationForm />

function Login() {
    return (
        <div className="login-page-frame">
            <div className="login-frame">
                <IdentificationForm />

                <p className="signup-link">
                    Si vous ne possédez pas encore de compte Open-Space, vous
                    pouvez :
                </p>
                <NavLink to="/signup">créer un compte</NavLink>
            </div>
        </div>
    )
}
export default Login
