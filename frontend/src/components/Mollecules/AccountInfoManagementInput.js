// MOLLECULE
import '../../styles/Mollecules/AccountInfoManagementInput.css'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contexts/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//fonction de gestion des infos utilisateurs, comprend :
//  - un module de suppression de compte
//  - un module de modification de la photo de profil
//  - un module de modification de la description de l'utilisateur
//-------------------------------------------------------------------------------------------
function AccountInfoManagementInput(props) {
    let navigate = useNavigate()
    const { userData, setUserData, setLoginStatus } = useContext(LoginContext)
    const [updatedPicture, setUpdatedPicture] = useState()
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordValueVerif, setPasswordValueVerif] = useState('')

    function isDescriptionValid(value) {
        return /^[a-zA-Z0-9àäâéèêëïîöôûüç'"?!()&=@ .-]+$/.test(value)
    }

    //---------------------------------------------------------
    //fonction de suppression de compte, reinit le sessionStorage (DELETE)
    function deleteAccount(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/user/'
        let authPayload = { userId: userData.userId }
        let deleteUser = {
            method: 'DELETE',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(url, deleteUser)
            .then(() => {
                sessionStorage.clear()
                setLoginStatus(false)
                navigate('/login')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //---------------------------------------------------------
    //fonction de modification de la description utilisateur (PUT)
    function submitBioModif(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/user/bio/'
        let authPayload = {
            userId: userData.userId,
            description: userData.description,
        }
        console.log(userData.description)
        let updateUser = {
            method: 'PUT',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }

        fetch(url, updateUser)
            .then(() => {
                console.log('description modifiée')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //---------------------------------------------------------
    //fonction de modification de la photo de profil utilisateur (PUT)
    //format mit sous format formData et envoyé à l'api (traitement via Multer)
    //userId envoyé via params pour vérification jwt
    //on modifie le userData avec la nouvelle adresse de l'image
    function submitPictureModif(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/user/picture/' + userData.userId
        const formData = new FormData()
        formData.append('file', updatedPicture[0])
        formData.append('isprofile', true)

        let updateUser = {
            method: 'PUT',
            body: formData,
            headers: new Headers({
                authorization: token,
            }),
        }

        fetch(url, updateUser)
            .then((response) => response.json())
            .then((res) => {
                setUserData({ ...userData, profilepicture: res.fileadress })
                console.log('fetch effectué')
            })
            .catch((error) => {
                console.log({ error })
            })
    }
    //---------------------------------------------------------
    //fonction de modification du mot de passe
    function submitPassModif(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/user/pass/'
        let authPayload = {
            userId: userData.userId,
            pass: passwordValue,
        }
        let updateUser = {
            method: 'PUT',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }

        fetch(url, updateUser)
            .then(() => {
                console.log('mot de passe modifiée')
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //---------------------------------------------------------
    //fonction de vérification du mot de passe via regex
    function isPasswordValid(value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
    }

    //*options accessible via vérification du mot de passe*
    //modification de la bio de l'utilisateur
    //modification de la photo de profil de l'utilisateur
    //modification du mot de passe de l'utilisateur
    return (
        <div className="account-info-management-input">
            <button
                type="submit"
                onClick={() => props.setShowing(!props.showing)}
                className="submit-button"
            >
                retour
            </button>
            <div className="account-info-management-input-miniframe">
                <textarea
                    maxLength="500"
                    value={
                        userData.description == null
                            ? 'Saisissez votre nouvelle bio ici'
                            : userData.description
                    }
                    onChange={(e) => {
                        setUserData({
                            ...userData,
                            description: e.target.value,
                        })
                    }}
                    id="description-input"
                    aria-label="zone de saisie de votre nouvelle bio"
                />
                {document.activeElement &&
                document.activeElement.id === 'description-input' ? (
                    <p>
                        caractères autorisés : alphanumériques, (@ #!()[]{}
                        -_,.:;'"&*=+)` ainsi que tous les symboles monnétaires
                    </p>
                ) : null}
                {isDescriptionValid(userData.description) ? (
                    <button
                        type="submit"
                        onClick={submitBioModif}
                        className="submit-button"
                        ria-label="valider saisie de votre nouvelle bio"
                    >
                        Confirmer
                    </button>
                ) : (
                    <button className="submit-button-wrong" disabled={true}>
                        erreur de saisie
                    </button>
                )}
            </div>
            <div className="account-info-management-input-miniframe">
                <label htmlFor="file-selector" id="file-selector-visible">
                    <p>Envie d'une nouvelle tête ?</p>
                    <FontAwesomeIcon icon="fa-solid fa-paperclip" size="2x" />
                </label>
                <input
                    type="file"
                    id="file-selector"
                    accept="image/jpg, image/png, image/jpeg"
                    name="file"
                    onChange={(e) => setUpdatedPicture(e.target.files)}
                    aria-label="selection de photo de profil"
                />
                <button
                    type="submit"
                    onClick={submitPictureModif}
                    className="submit-button"
                    aria-label="envoyer votre nouvelle photo de profil"
                >
                    Confirmer
                </button>
            </div>
            <div className="account-info-management-input-miniframe">
                <p>
                    Afin de modifier votre mot de passe veuillez saisir le
                    nouveau mot de passe{' '}
                </p>
                <input
                    type="password"
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="password-input"
                    id="password"
                    aria-label="zone de saisie de votre nouveau mot de passe"
                    maxLength="40"
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
                <p>Confirmation de saisie du nouveau mot de passe</p>
                <input
                    type="password"
                    onChange={(e) => setPasswordValueVerif(e.target.value)}
                    className="password-input"
                    id="password-verif"
                    aria-label="zone de répétition de votre nouveau mot de passe"
                    maxLength="40"
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
                {isPasswordValid(passwordValue) &&
                passwordValue === passwordValueVerif ? (
                    <button
                        type="submit"
                        onClick={submitPassModif}
                        className="submit-button"
                    >
                        Modifier le mot de passe
                    </button>
                ) : (
                    <button disabled={true} className="submit-button-wrong">
                        invalide
                    </button>
                )}
            </div>
            <button
                type="submit"
                onClick={deleteAccount}
                className="delete-button"
            >
                Supprimer le compte
            </button>
        </div>
    )
}

export default AccountInfoManagementInput
