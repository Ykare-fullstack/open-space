import React, { useState, useContext } from 'react'
import '../../styles/Atoms/PostCommentInputFrame.css'
import { LoginContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function PostCommentInputFrame(props) {
    const [newComment, setNewComment] = useState('')
    const { userData } = useContext(LoginContext)
    const token = sessionStorage.getItem('token')
    const textearea = document.getElementById('comment-input')
    //----------------------------------------------
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
            />
            <button type="submit" onClick={sendNewComment} id="comment-submit">
                <FontAwesomeIcon icon="fa-solid fa-paper-plane" size="1x" />
            </button>
        </div>
    )
}

export default PostCommentInputFrame
