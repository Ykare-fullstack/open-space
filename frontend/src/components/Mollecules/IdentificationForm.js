import '../../styles/Mollecules/IdentificationForm.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { LoginContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//formulaire d'identification : Post les infos utilisateurs saisies à l'api pour vérification d'identité
//en cas de succès on passe les infos utilisateurs publiques au contexte ainsi que le statut Login à "true"

//-------------------------------------------------------------------------------------------
function IdentificationForm() {
    // note : usage de useState pour le stockage des valeurs saisies par l'utilisateur)
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const { setLoginStatus, setUserData } = useContext(LoginContext)
    const [access, setAccess] = useState(true)
    const [loading, setLoading] = useState(false)
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

    //-----------------------------------------------------
    //fonction de test des infos de l'utilisateur via API
    function logintest(e) {
        setLoading(true)
        e.preventDefault()
        let url = 'http://localhost:3001/api/user/login'
        //set du payload avec les infos utilisateurs saisies
        let authPayload = {
            email: emailValue,
            password: passwordValue,
        }
        //préparation de la requête
        let postUser = {
            method: 'POST',
            body: JSON.stringify(authPayload),
            headers: new Headers({ 'content-type': 'application/JSON' }),
        }
        //requête
        fetch(url, postUser)
            .catch((err) => {
                console.log(err)
                navigate('/login')
            })
            .then((response) => response.json())
            .then((res) => {
                if (res.access === true) {
                    setLoginStatus(true)
                    setUserData({
                        userId: Number(res.userId),
                        role: res.role,
                        firstname: res.firstname,
                        lastname: res.lastname,
                        description: res.description,
                        profilepicture: res.profilepicture,
                    })
                    const token = res.token
                    //on supprimme l'ancien token et on le remplace par un nouveau dans le sessionStorage
                    sessionStorage.removeItem('token')
                    sessionStorage.setItem('token', token)
                    //redirection vers la page principale

                    url = 'http://localhost:3001/api/checkedin/'
                    let checkin = {
                        method: 'POST',
                        headers: new Headers({
                            authorization: token,
                        }),
                    }
                    fetch(url, checkin)
                        .then((response) => response.json())
                        .then(() => {
                            navigate('/')
                        })
                } else {
                    setAccess(false)
                    setLoading(false)
                }
            })
    }
    //-----------------------------------------------------

    return (
        <div className="identification-form-frame">
            <p>Email</p>
            <input
                onChange={(e) => setEmailValue(e.target.value)}
                className="identification-textarea"
            />

            <p>Mot de passe</p>
            <input
                type="password"
                onChange={(e) => setPasswordValue(e.target.value)}
                className="identification-textarea"
            />
            {isEmailValid(emailValue) && isPasswordValid(passwordValue) ? (
                <button
                    onClick={logintest}
                    className="submit-button"
                    id="login-submit-button"
                >
                    {loading ? (
                        <FontAwesomeIcon
                            icon="fa-solid fa-spinner"
                            size="3x"
                            spin
                            color="rgba(10, 30, 70, 1)"
                            id="login-submit-button-icon"
                        />
                    ) : (
                        'Envoyer'
                    )}
                </button>
            ) : (
                <button
                    disabled={true}
                    className="submit-button-wrong"
                    id="login-submit-button"
                >
                    Envoyer
                </button>
            )}
            {access ? null : (
                <div className="alert-unauthorized">
                    <p>Erreur de mot de passe ou d'adresse email</p>
                </div>
            )}
        </div>
    )
}

export default IdentificationForm
