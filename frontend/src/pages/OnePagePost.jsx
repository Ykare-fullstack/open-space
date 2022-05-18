import '../styles/Pages/OnePagePost.css'
import React, { useContext, useState, useEffect } from 'react'
import { LoginContext } from '../contexts/index'
import PostPictureFrame from '../components/Atoms/PostPictureFrame'
import PostDescriptionFrame from '../components/Atoms/PostDescriptionFrame'
import PostCommentsFrame from '../components/Atoms/PostCommentsFrame'
import PostAppraisalFrame from '../components/Atoms/PostAppraisalFrame'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function OnePagePost() {
    const [post, setPost] = useState({
        pictures: [],
        description: '',
        idUser: 0,
        idPost: 0,
    })
    const navigate = useNavigate()
    const { userData } = useContext(LoginContext)
    const string = window.location.href
    const url = new URL(string)
    const postId = Number(url.pathname.split('/')[2])
    const token = sessionStorage.getItem('token')
    const postInfoRequest = {
        method: 'GET',
        headers: new Headers({ authorization: token }),
    }
    const urlpost = 'http://localhost:3001/api/publication/gp4/' + postId
    const urlappraisal = 'http://localhost:3001/api/appraisal/' + postId
    const urldelete = 'http://localhost:3001/api/publication/'
    const [owner, setOwner] = useState({
        ownerId: 0,
        firstname: '',
        lastname: '',
        description: '',
        profilepicture: '',
    })

    useEffect(() => {
        fetch(urlpost, postInfoRequest)
            .then((response) => response.json())
            .then((receivedPost) => {
                fetch(urlappraisal, postInfoRequest)
                    .then((response) => response.json())
                    .then((appraisal) => {
                        receivedPost.appraisal = appraisal
                        setPost(receivedPost)
                    })
                    .then(() => {
                        const urlowner =
                            'http://localhost:3001/api/user/gu1/' +
                            receivedPost.idUser
                        const getOwnerInfo = {
                            method: 'GET',
                            headers: new Headers({
                                authorization: token,
                            }),
                        }

                        fetch(urlowner, getOwnerInfo)
                            .then((response) => response.json())
                            .then((owner) => {
                                setOwner(owner)
                            })
                    })
            })
    }, [])

    function deletePost(e) {
        e.preventDefault()
        const authPayload = {
            postId: postId,
        }
        const deletePostrequest = {
            method: 'DELETE',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(urldelete, deletePostrequest).then(() => {
            console.log('post supprimé')
            navigate('/')
        })
    }
    console.log(owner)
    /* */
    return (
        <div className="one-page-post-wrapper">
            {post.idPost === 0 ? null : (
                <React.Fragment>
                    <div className="one-page-post-nav">
                        <GeneralNav />
                    </div>
                    <div className="one-page-post-frame">
                        <div className="one-page-post-top-banner">
                            <div className="one-page-post-owner-frame">
                                <Link
                                    to={`/OnePageProfile/` + owner.userId}
                                    className={'one-page-post-owner-link'}
                                >
                                    <img
                                        src={owner.profilepicture}
                                        alt={`${owner.firstname} ${owner.lastname}`}
                                        className={
                                            'one-page-post-owner-profile-picture'
                                        }
                                    />
                                    <div className="popping-post-owner-name">
                                        <p className="hidden-post-owner">{`${owner.firstname} ${owner.lastname}`}</p>
                                    </div>
                                </Link>
                            </div>
                            {post.idUser === userData.userId ||
                            userData.role > 1 ? (
                                <Link
                                    to={`/PostRepair/` + postId}
                                    className="edit-link"
                                >
                                    <FontAwesomeIcon
                                        icon="fa-solid fa-pen-alt"
                                        size="1x"
                                        id="icon-repair-post"
                                    />
                                    <div id="popping-modification">
                                        <p>Modifier</p>
                                    </div>
                                </Link>
                            ) : null}
                        </div>
                        <div className="one-page-post-picture-wrapper">
                            {post.pictures.length !== 0
                                ? post.pictures.map((picture) => (
                                      <PostPictureFrame
                                          key={picture.id}
                                          picture={picture}
                                      />
                                  ))
                                : null}
                        </div>
                        <PostDescriptionFrame description={post.description} />
                        <PostAppraisalFrame postId={postId} />
                        <PostCommentsFrame postId={postId} />

                        {post.idUser === userData.userId ||
                        userData.role > 1 ? (
                            <button
                                type="submit"
                                onClick={deletePost}
                                className="delete-button"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-trash-alt"
                                    size="4x"
                                />
                            </button>
                        ) : null}
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default OnePagePost
