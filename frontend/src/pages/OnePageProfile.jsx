import '../styles/Pages/OnePageProfile.css'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../contexts/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PostPreview from '../components/Atoms/PostPreview'
import InfoDisplayPictureContainer from '../components/Atoms/InfoDisplayPictureContainer'
import InfoDisplayDataContainer from '../components/Atoms/InfoDisplayDataContainer'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'
function OnePageProfile() {
    const navigate = useNavigate()
    const { userData, setLoginStatus } = useContext(LoginContext)

    const string = window.location.href
    const url = new URL(string)
    const userId = Number(url.pathname.split('/')[2])

    const token = sessionStorage.getItem('token')
    const urlGetInfo = 'http://localhost:3001/api/user/gu1/' + userId
    const urlGetPosts = 'http://localhost:3001/api/publication/gp2/' + userId
    const [postBuffer, setPostBuffer] = useState([])
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        description: '',
        profilepicture: '',
    })
    const getUserAndPosts = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    //fetch des informations utilisateur après le premier rendu
    useEffect(() => {
        fetch(urlGetInfo, getUserAndPosts)
            .then((response) => response.json())
            .then((user) => {
                console.log(user)
                setUser(user)
            })
            .then(() => {
                fetch(urlGetPosts, getUserAndPosts)
                    .then((response) => response.json())
                    .then((posts) => {
                        if (posts) {
                            setPostBuffer(posts)
                        }
                    })
            })
    }, [])
    function switchR(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/caregiver/'
        let authPayload = {
            promoted: userId,
            func: document.getElementById('switchR').value,
        }
        let switchR = {
            method: 'PUT',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(url, switchR)
    }
    //-------------------------------------------------------
    //fonction de suppression du compte
    function deleteAccount(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/user/'
        let authPayload = { userId: userId }
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
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="one-page-user-profile">
            <div className="one-page-user-display">
                <div className="one-page-profile-nav">
                    <GeneralNav />
                </div>
                <div className="account-info-sizer">
                    <div className="account-info-display-frame">
                        <InfoDisplayPictureContainer
                            data={user.profilepicture}
                        />
                        <InfoDisplayDataContainer data={user.firstname} />
                        <InfoDisplayDataContainer data={user.lastname} />
                        <InfoDisplayDataContainer data={user.description} />

                        {userData.role > 2 ? (
                            <React.Fragment>
                                <div className="one-page-profile-switch-selector">
                                    <select name="switchR" id="switchR">
                                        <option value="1">Classique</option>
                                        <option value="2">Modérateur</option>
                                        <option value="3">
                                            Administrateur
                                        </option>
                                    </select>
                                </div>
                                <React.Fragment>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        onClick={switchR}
                                    >
                                        modifier le role
                                    </button>
                                </React.Fragment>
                                <React.Fragment>
                                    <button
                                        type="submit"
                                        onClick={deleteAccount}
                                        className="delete-button"
                                        id="one-page-profile-delete"
                                    >
                                        <FontAwesomeIcon
                                            icon="fa-solid fa-trash-alt"
                                            size="3x"
                                        />
                                    </button>
                                </React.Fragment>
                            </React.Fragment>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="post-preview-display-frame">
                {postBuffer.length === 0
                    ? null
                    : postBuffer.map((post, index) => (
                          <PostPreview key={post.idpost} post={post} />
                      ))}
            </div>
        </div>
    )
}

export default OnePageProfile
