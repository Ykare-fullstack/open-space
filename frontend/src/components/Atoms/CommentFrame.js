import React, { useState, useContext, useEffect } from 'react'
import '../../styles/Atoms/CommentFrame.css'
import { LoginContext } from '../../contexts'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CommentFrame(props) {
    const [modifying, setModifying] = useState(false)
    const [updatedComment, setUpdatedComment] = useState(props.content)
    const { userData } = useContext(LoginContext)
    const token = sessionStorage.getItem('token')
    const url = 'http://localhost:3001/api/user/gu1/' + props.ownerId
    const [commentOwner, setCommentOwner] = useState({
        userId: 0,
        firstname: '',
        lastname: '',
        description: '',
        profilepicture: '',
    })
    const getUser = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    useEffect(() => {
        fetch(url, getUser)
            .then((response) => response.json())
            .then((owner) => {
                setCommentOwner(owner)
            })
    }, [])

    function toggleModification() {
        setModifying((modifying) => !modifying)
    }

    function updateComment() {
        const token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/comments/'
        const authPayload = {
            commentId: props.commentId,
            content: updatedComment,
            userId: props.ownerId,
        }
        const updateComment = {
            method: 'PUT',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(url, updateComment)
            .then(() => {
                setModifying(false)
                props.setHasUpdated(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function deleteComment() {
        const token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/comments/'
        const authPayload = {
            commentId: props.commentId,
            userId: props.ownerId,
        }

        const getPost = {
            method: 'DELETE',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(url, getPost)
            .then(() => {
                setModifying(false)
                props.setHasUpdated(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    if (props.ownerId === userData.userId || userData.role > 1) {
        return (
            <React.Fragment>
                {modifying ? (
                    <div className="update-comment-panel">
                        <textarea
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            defaultValue={props.content}
                            className="update-comment-content-input"
                            id="update-comment-text-input"
                        />
                        <label for="update-comment-text-input" hidden></label>
                        <div className="update-comment-button-wrapper">
                            <button
                                type="submit"
                                onClick={toggleModification}
                                className="toggle-modif-button"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-rotate-left"
                                    size="1x"
                                />
                            </button>

                            <button
                                type="submit"
                                onClick={updateComment}
                                className="toggle-modif-button"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-check"
                                    size="1x"
                                />
                            </button>
                            <button
                                type="submit"
                                onClick={deleteComment}
                                className="delete-button"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-trash-alt"
                                    size="1x"
                                />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="comment">
                        <div className={'comment-owner-frame'}>
                            <Link
                                to={`/OnePageProfile/` + props.ownerId}
                                className={'owner-info-frame'}
                            >
                                <img
                                    src={commentOwner.profilepicture}
                                    alt={`${commentOwner.firstname} ${commentOwner.lastname}`}
                                    className={'profile-picture-comment'}
                                />
                                <div id="popping-owner-name">
                                    <p>{`${commentOwner.firstname} ${commentOwner.lastname}`}</p>
                                </div>
                            </Link>
                            <div className={'comment-modif-button-wrapper'}>
                                <button
                                    type="submit"
                                    onClick={toggleModification}
                                    className="toggle-modif-button"
                                >
                                    <FontAwesomeIcon
                                        icon="fa-solid fa-pen-alt"
                                        size="1x"
                                    />
                                </button>
                            </div>
                        </div>
                        <p>{props.content}</p>
                    </div>
                )}
            </React.Fragment>
        )
    } else {
        return (
            <div className="comment">
                <div className={'comment-owner-frame'}>
                    <Link
                        to={`/OnePageProfile/` + props.ownerId}
                        className={'owner-info-frame'}
                    >
                        <img
                            src={commentOwner.profilepicture}
                            alt={`${commentOwner.firstname} ${commentOwner.lastname}`}
                            className={'profile-picture-comment'}
                        />
                        <div id="popping-owner-name">
                            <p>{`${commentOwner.firstname} ${commentOwner.lastname}`}</p>
                        </div>
                    </Link>
                </div>
                <p>{props.content}</p>
            </div>
        )
    }
}
export default CommentFrame
