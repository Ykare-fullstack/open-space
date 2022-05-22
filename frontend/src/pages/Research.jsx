import '../styles/Pages/Research.css'
import React, { useState, useRef } from 'react'
import PostPreview from '../components/Atoms/PostPreview'
import UserPreview from '../components/Atoms/UserPreview'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// page de modification de publication contenant :
// - une section de navigation lien vers: compte, cette page, les groupes et le tri de post par catégories
// - l'affichage des photos du post modifiable (ajout/suppression)
// - l'affichage de la descriptioon de la publication modifiable
//-------------------------------------------------------------------------------------------
function Research() {
    const token = sessionStorage.getItem('token')
    const [postBuffer, setPostBuffer] = useState([])
    const [userBuffer, setUserBuffer] = useState([])
    const [postSearch, setPostSearch] = useState('')
    const [userSearch, setUserSearch] = useState('')
    const firstRenderPost = useRef(true)
    const firstRenderUser = useRef(true)

    const searchUserAndPost = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    function submitPostResearch() {
        firstRenderPost.current = false
        setPostBuffer([])
        let curatedParams = postSearch.split(' ').join('&')
        console.log('after 1st split')
        console.log(curatedParams)
        const urlSearchPosts =
            'http://localhost:3001/api/publication/gp1/' + curatedParams
        fetch(urlSearchPosts, searchUserAndPost)
            .then((response) => response.json())
            .then((resultPosts) => {
                if (resultPosts) {
                    setPostBuffer(resultPosts)
                }
            })
    }
    function submitUserResearch() {
        firstRenderUser.current = false
        setUserBuffer([])
        let curatedParams = userSearch.split(' ').join('&')
        const urlSearchUsers =
            'http://localhost:3001/api/user/gu2/' + curatedParams
        fetch(urlSearchUsers, searchUserAndPost)
            .then((response) => response.json())
            .then((resultUsers) => {
                console.log(resultUsers)
                setUserBuffer(resultUsers)
            })
    }

    return (
        <div className="research-page-body">
            <div className="research-nav">
                <GeneralNav />
            </div>
            <div className="research-frame-wrapper">
                <div className="research-frame">
                    <h2>Que cherchez vous ?</h2>
                    <div className="post-search-frame">
                        <h3>Recherche de publication :</h3>
                        <textarea
                            maxLength="500"
                            onChange={(e) => {
                                setPostSearch(`${e.target.value}`)
                            }}
                            aria-label="zone de saisie pour recherche de post"
                        />
                        <button
                            onClick={submitPostResearch}
                            className="submit-button"
                            aria-label="valider votre saisie"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-magnifying-glass"
                                size="3x"
                            />
                        </button>
                        <div className="post-research-display-frame">
                            {firstRenderPost.current ? null : postBuffer.length ===
                              0 ? (
                                <p>pas de résultats </p>
                            ) : (
                                postBuffer.map((post) => (
                                    <PostPreview
                                        key={post.idpost}
                                        post={post}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="user-search-frame">
                        <h3>Recherche d'utilisateur :</h3>
                        <textarea
                            maxLength="500"
                            onChange={(e) => {
                                setUserSearch(`${e.target.value}`)
                                console.log(userSearch)
                            }}
                            aria-label="zone de saisie pour recherche d'utilisateur"
                        />
                        <button
                            onClick={submitUserResearch}
                            className="submit-button"
                            aria-label="valider votre saisie"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-magnifying-glass"
                                size="3x"
                            />
                        </button>
                        <div className="user-research-display-frame">
                            {firstRenderUser.current ? null : userBuffer.length ===
                              0 ? (
                                <p>pas de résultats </p>
                            ) : (
                                userBuffer.map((user) => (
                                    <UserPreview
                                        key={user.idusers}
                                        user={user}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Research
