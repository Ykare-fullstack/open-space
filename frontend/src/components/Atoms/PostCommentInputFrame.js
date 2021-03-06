import React, { useState, useContext } from 'react'
import '../../styles/Atoms/PostCommentInputFrame.css'
import { LoginContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//composant de saisie de nouveau commentaire
function PostCommentInputFrame(props) {
    const [newComment, setNewComment] = useState('')
    const { userData } = useContext(LoginContext)
    const token = sessionStorage.getItem('token')
    const textearea = document.getElementById('comment-input')
    //----------------------------------------------
    //fonction d'envoi du nouveau commentaire
    function sendNewComment(e) {
        e.preventDefault()

        const url = 'http://localhost:3001/api/comments/'
        let authPayload = {
            postId: props.postId,
            content: newComment,
            userId: Number(userData.userId),
        }

        let createComment = {
            method: 'POST',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }

        fetch(url, createComment)
            .then(() => {
                console.log('commentaire ajouté')
                textearea.value = ''
                props.setHasUpdated(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <div className="comment-input-frame">
            <textarea
                onChange={(e) => setNewComment(e.target.value)}
                id="comment-input"
                aria-label="zone de saisie de nouveaux commmentaire"
                maxLength="400"
            />
            {newComment === '' ? (
                <button
                    type="submit"
                    id="comment-submit-disabled"
                    aria-label="envoyer le commmentaire saisi"
                    disabled
                >
                    <FontAwesomeIcon icon="fa-solid fa-paper-plane" size="1x" />
                </button>
            ) : (
                <button
                    type="submit"
                    onClick={sendNewComment}
                    id="comment-submit"
                    aria-label="envoyer le commmentaire saisi"
                >
                    <FontAwesomeIcon icon="fa-solid fa-paper-plane" size="1x" />
                </button>
            )}
        </div>
    )
}

export default PostCommentInputFrame
