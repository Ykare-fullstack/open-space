import '../styles/Pages/Signup.css'
import React from 'react'

import SignupForm from '../components/Mollecules/SignupForm'

//Page de Signup avec lien vers Login
//les champs de saisie sont dans <SignupForm />

function Signup() {
    return (
        <div className="signup-page-wrapper">
            <SignupForm />
        </div>
    )
}
export default Signup
