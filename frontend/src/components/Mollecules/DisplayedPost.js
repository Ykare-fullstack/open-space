import '../../styles/Mollecules/DisplayedPost.css'
import React, { useContext, useEffect, useState } from 'react'
import PostPictureFrame from '../Atoms/PostPictureFrame'
import PostDescriptionFrame from '../Atoms/PostDescriptionFrame'
import PostCommentsFrame from '../Atoms/PostCommentsFrame'

import PostAppraisalFrame from '../Atoms/PostAppraisalFrame'
import { LoginContext } from '../../contexts/index'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function DisplayedPost(props) {
    const postId = props.post.idPost
    const ownerId = props.post.idOwner

    const token = sessionStorage.getItem('token')
    const { userData } = useContext(LoginContext)
    const [owner, setOwner] = useState({
        ownerId: 0,
        firstname: '',
        lastname: '',
        description: '',
        profilepicture: '',
    })
    const url = 'http://localhost:3001/api/user/gu1/' + ownerId
    const getOwnerInfo = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    useEffect(() => {
        fetch(url, getOwnerInfo)
            .then((response) => response.json())
            .then((owner) => {
                setOwner(owner)
            })
    }, [])

    return (
        <div className="post-frame">
            {owner.ownerId === 0 ? (
                <div className="displayedpost-loading-post">
                    <FontAwesomeIcon
                        icon="fa-solid fa-spinner"
                        size="4x"
                        spin
                    />
                </div>
            ) : (
                <React.Fragment>
                    <div className="post-top-hidden">
                        <div className="post-owner-frame">
                            <Link
                                to={`/OnePageProfile/` + ownerId}
                                className={'post-owner-link'}
                            >
                                <img
                                    src={owner.profilepicture}
                                    alt="lien vers le profil :"
                                    className={'post-owner-profile-picture'}
                                />
                                <div className="popping-post-owner-name">
                                    <p className="hidden-post-owner">{`${owner.firstname} ${owner.lastname}`}</p>
                                </div>
                            </Link>
                        </div>
                        {userData.userId === ownerId || userData.role > 1 ? (
                            <div className="edit-icon-frame">
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
                            </div>
                        ) : null}
                    </div>
                    <div className="post-info-and-link">
                        <Link
                            to={`/OnePagePost/${postId}`}
                            className="post-link"
                        >
                            {props.post.pictures.length !== 0 ? (
                                <PostPictureFrame
                                    picture={props.post.pictures[0]}
                                    postId={postId}
                                />
                            ) : null}

                            <PostDescriptionFrame
                                description={props.post.description}
                            />
                        </Link>
                    </div>
                    <div className="post-user-interaction-frame">
                        <PostAppraisalFrame postId={postId} />
                        <PostCommentsFrame postId={postId} />
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}
export default DisplayedPost
