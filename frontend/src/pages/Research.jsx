import '../styles/Pages/Research.css'
import React, { useState } from 'react'
import PostPreview from '../components/Atoms/PostPreview'
import UserPreview from '../components/Atoms/UserPreview'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Research() {
    const token = sessionStorage.getItem('token')

    const [postBuffer, setPostBuffer] = useState([])
    const [userBuffer, setUserBuffer] = useState([])
    const [postSearch, setPostSearch] = useState('')
    const [userSearch, setUserSearch] = useState('')

    const searchUserAndPost = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    function submitPostResearch() {
        setPostBuffer([])
        let curatedParams = postSearch.split(' ').join('&')
        console.log('after 1st split')
        console.log(curatedParams)
        const urlSearchPosts =
            'http://localhost:3001/api/publication/gp1/' + curatedParams
        fetch(urlSearchPosts, searchUserAndPost)
            .then((response) => response.json())
            .then((resultPosts) => {
                console.log(resultPosts)
                setPostBuffer(resultPosts)
            })
    }
    function submitUserResearch() {
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
                        />
                        <button
                            onClick={submitPostResearch}
                            className="submit-button"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-magnifying-glass"
                                size="3x"
                            />
                        </button>
                        <div className="post-research-display-frame">
                            {postBuffer.length === 0
                                ? null
                                : postBuffer.map((post) => (
                                      <PostPreview
                                          key={post.idpost}
                                          post={post}
                                      />
                                  ))}
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
                        />
                        <button
                            onClick={submitUserResearch}
                            className="submit-button"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-magnifying-glass"
                                size="3x"
                            />
                        </button>
                        <div className="user-research-display-frame">
                            {userBuffer.length === 0
                                ? null
                                : userBuffer.map((user) => (
                                      <UserPreview
                                          key={user.idusers}
                                          user={user}
                                      />
                                  ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Research
