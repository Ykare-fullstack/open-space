import '../../styles/Mollecules/PostGenerator.css'
import React, { useState, useContext } from 'react'

import { LoginContext } from '../../contexts/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//-------------------------------------------------------------------------------------------
//générateur de publication :
//10 images max
//description oligatoire
//catégorie initiale : diverse
function PostGenerator(props) {
    console.log(props.hasUpdated)
    const [post, setPost] = useState({
        description: '',
        pictures: [],
        category: 'diverse',
    })
    const [updatedPictures, setUpdatedPictures] = useState([])
    const [picturesToSend, setPicturesToSend] = useState([])
    const { userData } = useContext(LoginContext)
    //---------------------------------------------------------
    //fonction d'envoi du post crée via FormData
    function submitPost(e) {
        e.preventDefault()
        let token = sessionStorage.getItem('token')
        const url = 'http://localhost:3001/api/publication/' + userData.userId
        const formData = new FormData()

        console.log(post)

        if (picturesToSend) {
            for (const single_file of picturesToSend) {
                formData.append('file', single_file)
            }
        }
        formData.append('isprofile', false)
        formData.append('description', post.description)
        formData.append('category', post.category)

        let createPost = {
            method: 'POST',
            body: formData,
            headers: new Headers({
                authorization: token,
            }),
        }
        setUpdatedPictures([])
        setPicturesToSend([])
        setPost({
            description: '',
            pictures: [],
            category: '',
        })

        props.setHasUpdated(!props.hasUpdated)
        fetch(url, createPost)
            .then((response) => response.json())
            .then((res) => {
                console.log('post crée')
                if (res.sent) {
                    window.location.reload()
                }
            })
            .catch((error) => {
                console.log({ error })
            })
    }
    //---------------------------------------------------------
    //fonction de mise ajour de l'affichage en fonction des input utilisateur
    function updatePicturesDisplay(e) {
        e.preventDefault()
        var files = e.target.files
        files = e.target.files
        setPicturesToSend([...picturesToSend, ...e.target.files])
        function readAndPreview(file) {
            if (/\.(jpe?g|png)$/i.test(file.name)) {
                var reader = new FileReader()
                reader.onload = function (event) {
                    setUpdatedPictures((updatedPictures) => [
                        ...updatedPictures,
                        event.target.result,
                    ])
                }
                reader.readAsDataURL(file)
            }
        }
        if (files) {
            ;[].forEach.call(files, readAndPreview)
        }
    }
    return (
        <form id="postgenerator" className="postgenerator-frame">
            <h2>racontez-nous !</h2>
            {updatedPictures.length === 0 ? null : (
                <div className="postgenerator-picture-display-frame">
                    {updatedPictures.length === 0
                        ? null
                        : updatedPictures.map((picture, index) => (
                              <button
                                  className="postgenerator-picture-placeholder"
                                  key={index}
                                  onClick={(e) => {
                                      e.preventDefault()

                                      let arrayBuffer1 = picturesToSend.filter(
                                          (data, idx) => idx !== index
                                      )
                                      let arrayBuffer2 = updatedPictures.filter(
                                          (data, idx) => idx !== index
                                      )
                                      setPicturesToSend(arrayBuffer1)
                                      setUpdatedPictures(arrayBuffer2)
                                  }}
                              >
                                  <div className="postgenerator-picture-delete-veil">
                                      <FontAwesomeIcon
                                          icon="fa-solid fa-trash-alt"
                                          size="4x"
                                          className="send-icon"
                                      />
                                  </div>
                                  <img
                                      src={picture}
                                      alt="contenu du post"
                                      className="postgenerator-picture"
                                  />
                              </button>
                          ))}
                </div>
            )}

            <div className="postgenerator-inputs">
                <div className="postgenerator-file-selector">
                    {updatedPictures.length > 19 ? (
                        <label
                            htmlFor="file-selector"
                            id="file-selector-visible"
                        >
                            <p>20 images maximum en visualisation</p>
                            <FontAwesomeIcon
                                icon="fa-solid fa-circle-xmark"
                                size="3x"
                                color="rgba(210, 80, 90, 1)"
                            />
                        </label>
                    ) : (
                        <label
                            htmlFor="file-selector"
                            id="file-selector-visible"
                        >
                            <p>10 images maximum : </p>
                            <FontAwesomeIcon
                                icon="fa-solid fa-paperclip"
                                size="2x"
                            />
                            <p>png / jpg / jpeg</p>
                        </label>
                    )}

                    {updatedPictures.length > 19 ? (
                        <input
                            type="file"
                            id="file-selector"
                            accept="image/jpg, image/png, image/jpeg"
                            name="file"
                            disabled
                        />
                    ) : (
                        <input
                            type="file"
                            id="file-selector"
                            accept="image/jpg, image/png, image/jpeg"
                            name="file"
                            onChange={(e) => {
                                updatePicturesDisplay(e)
                            }}
                            multiple
                        />
                    )}
                </div>
                <div className="postgenerator-description-typer">
                    <label htmlFor="post-description" hidden>
                        {' '}
                        saisissez ici la description de votre publication
                    </label>
                    <textarea
                        id="post-description"
                        value={post.description === '' ? '' : post.description}
                        onChange={(e) =>
                            setPost({ ...post, description: e.target.value })
                        }
                        maxLength="500"
                    />
                </div>
                <div className="postgenerator-category-selector">
                    <label htmlFor="categories">
                        <p>Catégorie :</p>
                    </label>

                    <select
                        name="category"
                        id="categories"
                        onChange={(e) =>
                            setPost({ ...post, category: e.target.value })
                        }
                    >
                        <option value="diverse" className="category-option">
                            Divers
                        </option>
                        <option value="news" className="category-option">
                            Actualités
                        </option>
                        <option value="holidays" className="category-option">
                            Vacances
                        </option>
                        <option value="ideas" className="category-option">
                            idées
                        </option>
                        <option value="CE" className="category-option">
                            CE
                        </option>
                    </select>
                </div>
            </div>
            <div className="postgenerator-button-wrapper">
                {post.description === '' ? null : updatedPictures.length >
                  10 ? (
                    <button
                        type="submit"
                        disabled={true}
                        className="submit-button-wrong"
                    >
                        10 images par post maximum
                    </button>
                ) : (
                    <button
                        type="submit"
                        onClick={submitPost}
                        className="submit-post-button"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-paper-plane"
                            size="2x"
                            className="send-icon"
                        />
                    </button>
                )}
            </div>
        </form>
    )
}

export default PostGenerator
