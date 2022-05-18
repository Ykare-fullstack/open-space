import '../../styles/Mollecules/SignupForm.css'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

//formulaire de création de compte : Post les infos utilisateurs saisies à l'api pour vérification d'identité
//en cas de succès on enregistre le nouvel utilisateur dans la BDD et on renvoi vers la page de Login

//-------------------------------------------------------------------------------------------
function SignupForm() {
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordValueVerif, setPasswordValueVerif] = useState('')
    const [firstnameValue, setFirstnameValue] = useState('')
    const [lastnameValue, setLastnameValue] = useState('')

    let navigate = useNavigate()

    function isEmailValid(value) {
        //eslint-disable-next-line
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
        )
    }
    function isPasswordValid(value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
    }
    function isFirstnameValid(value) {
        return /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(
            value
        )
    }
    function isLastnameValid(value) {
        return /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(
            value
        )
    }

    //-----------------------------------------------------
    //fonction d'envoi des informations du nouveau compte à la BDD
    const submitUser = (e) => {
        e.preventDefault()
        const url = 'http://localhost:3001/api/user/signup'
        //set du payload avec les infos utilisateurs saisies
        let payload = {
            email: emailValue,
            password: passwordValue,
            firstname: firstnameValue,
            lastname: lastnameValue,
        }
        console.log(payload)

        //préparation de la requête
        let postUser = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: new Headers({ 'content-type': 'application/JSON' }),
        }

        //requête
        fetch(url, postUser)
            .then(() => {
                console.log('utilisateur envoyé au serveur API')
                navigate('/login')
            })
            .catch(() => {
                console.log('erreur')
            })
    }

    return (
        <div className="signup-form-frame">
            <h2>
                Veuillez remplir les champs suivants afin de créer un compte sur
                Open-Space
            </h2>

            <form className="signup-form-input-frame">
                <p>Adresse email</p>
                <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => {
                        setEmailValue(e.target.value)
                        console.log(isEmailValid(e.target.value))
                    }}
                    className="identification-textarea"
                />

                <p>Mot de passe</p>
                <input
                    id="password"
                    type="password"
                    value={passwordValue}
                    onChange={(e) => {
                        setPasswordValue(e.target.value)
                        console.log(isPasswordValid(e.target.value))
                    }}
                    className="identification-textarea"
                />
                {document.activeElement &&
                document.activeElement.id === 'password' ? (
                    <div>
                        <p>requiert :</p>
                        {
                            <p
                                className={
                                    passwordValue.match(/(?=^.{8,}$)/)
                                        ? 'matching'
                                        : 'not-matching'
                                }
                            >
                                8 caractères
                            </p>
                        }
                        {
                            <p
                                className={
                                    passwordValue.match(/(?=.*[A-Z]).*$/)
                                        ? 'matching'
                                        : 'not-matching'
                                }
                            >
                                une majuscule
                            </p>
                        }
                        {
                            <p
                                className={
                                    passwordValue.match(/(?=.*[a-z]).*$/)
                                        ? 'matching'
                                        : 'not-matching'
                                }
                            >
                                une minuscule
                            </p>
                        }
                        {
                            <p
                                className={
                                    passwordValue.match(/(?=.*\d).*$/)
                                        ? 'matching'
                                        : 'not-matching'
                                }
                            >
                                un nombre
                            </p>
                        }
                    </div>
                ) : null}

                <p>Saisir le mot de passe à nouveau</p>
                <input
                    type="password"
                    id="password-verif"
                    value={passwordValueVerif}
                    onChange={(e) => setPasswordValueVerif(e.target.value)}
                    className="identification-textarea"
                />
                {document.activeElement &&
                document.activeElement.id === 'password-verif' ? (
                    <div>
                        {passwordValueVerif === passwordValue ? (
                            <p className="matching">correspond</p>
                        ) : (
                            <p className="not-matching">ne correspond pas</p>
                        )}
                    </div>
                ) : null}
                <p>Prénom</p>
                <input
                    value={firstnameValue}
                    onChange={(e) => setFirstnameValue(e.target.value)}
                    className="identification-textarea"
                />

                <p>Nom de famille</p>
                <input
                    value={lastnameValue}
                    onChange={(e) => setLastnameValue(e.target.value)}
                    className="identification-textarea"
                />
                {isEmailValid(emailValue) &&
                isFirstnameValid(firstnameValue) &&
                isLastnameValid(lastnameValue) &&
                isPasswordValid(passwordValue) &&
                passwordValue === passwordValueVerif ? (
                    <button
                        onClick={submitUser}
                        className="submit-button"
                        id="signup-submit-button"
                    >
                        Envoyer
                    </button>
                ) : (
                    <button
                        disabled={true}
                        className="submit-button-wrong"
                        id="signup-submit-button"
                    >
                        Envoyer
                    </button>
                )}
            </form>
            <NavLink to="/login">retourner à la page de login</NavLink>
        </div>
    )
}

export default SignupForm
