import '../styles/Pages/PostRepair.css'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { LoginContext } from '../contexts/index'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'

// page de modification de publication contenant :
// - une section de navigation lien vers: compte, cette page, les groupes et le tri de post par catégories
// - l'affichage des photos du post modifiable (ajout/suppression)
// - l'affichage de la descriptioon de la publication modifiable
//-------------------------------------------------------------------------------------------
function PostRepair() {
    const isLoading = useRef(true)
    //post : buffer de récupération des informations de la publication via l'API
    //       sert aussi à l'affichage
    const [post, setPost] = useState({
        pictures: [],
        description: '',
        idUser: 0,
        idPost: 0,
        comments: [],
    })
    // uploadedPictures : array of files à envoyer à l'API
    const [uploadedPictures, setUploadedPictures] = useState([])
    const { userData } = useContext(LoginContext)
    const navigate = useNavigate()

    const string = window.location.href
    const url = new URL(string)
    const postId = Number(url.pathname.split('/')[2])
    const token = sessionStorage.getItem('token')
    const formData = new FormData()
    const postInfoRequest = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }

    const urlpost = 'http://localhost:3001/api/publication/gp4/' + postId

    useEffect(() => {
        isLoading.current = true
        fetch(urlpost, postInfoRequest)
            .then((response) => response.json())
            .then((receivedPost) => {
                setPost({ ...receivedPost })
            })
            .then(() => (isLoading.current = false))
    }, [])
    //----------------------------------------------------------
    //fonction de modification du post (envoi vers API)
    function updatePost() {
        const urlupdate = 'http://localhost:3001/api/publication/' + post.idUser
        if (uploadedPictures.length !== 0) {
            uploadedPictures.forEach((single_file) => {
                formData.append('file', single_file)
            })
            /*for (const single_file of uploadedPictures) {
                formData.append('file', single_file)
            }*/
        }
        formData.append('userId', userData.userId)
        formData.append('description', post.description)
        formData.append('postId', postId)
        let remainingpictures = []
        post.pictures.forEach((picture) => {
            if (picture.idpost) remainingpictures.push(picture.id)
        })

        formData.append('remainingpictures', JSON.stringify(remainingpictures))

        const postUpdateRequest = {
            method: 'PUT',
            body: formData,
            headers: new Headers({
                authorization: token,
            }),
        }
        fetch(urlupdate, postUpdateRequest).then(() => {
            navigate('/')
        })
    }
    //----------------------------------------------------------
    //fonction de suppression du post (envoi vers API)
    function deletePost(e) {
        e.preventDefault()
        const urldelete = 'http://localhost:3001/api/publication/'
        const authPayload = {
            postId: postId,
            userId: userData.userId,
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
    //----------------------------------------------------------
    //fonction de modification de l'affichage en fonction des photos téléchargées ou supprimées par l'utilisateur
    function updateDisplay(e) {
        e.preventDefault()
        setUploadedPictures([...uploadedPictures, ...e.target.files])
        let picturesBuffer = []

        var files = e.target.files

        if (files) {
            let eta = files.length
            console.log(eta)
            for (const file of files) {
                if (/\.(jpe?g|png)$/i.test(file.name)) {
                    var reader = new FileReader()
                    reader.onload = function (event) {
                        picturesBuffer.push({
                            url: event.target.result,
                            id: file.name,
                        })
                        setPost({
                            ...post,
                            pictures: [...post.pictures, ...picturesBuffer],
                        })
                    }
                    reader.readAsDataURL(file)
                }
                eta--
                if (eta === 0) {
                    console.log('end')
                }
            }
        }
    }
    console.log('post :')
    console.log(post)
    console.log('uploaded:')
    console.log(uploadedPictures)
    console.log(isLoading.current)
    return (
        <div className="post-repair-main-wrapper">
            <div className="post-repair-nav">
                <GeneralNav />
            </div>
            <div className="postrepair-modification-panel">
                <h2>Vous souhaitez modifier votre publication ?</h2>
                <div className="postrepair-modification-panel-infos">
                    <p>Cliquez sur les images pour les supprimer et sur le</p>
                    <FontAwesomeIcon
                        icon="fa-solid fa-paperclip"
                        size="1x"
                        className="paperclip-info-icon"
                        aria-label="trombonne"
                    />
                    <p>pour en ajouter (10 photos max)</p>
                </div>
                <div className="postrepair-picture-modification-frame">
                    {post.pictures.length === 0
                        ? null
                        : post.pictures.map((picture, index) => (
                              <button
                                  className="postrepair-picture-placeholder"
                                  key={index}
                                  aria-label="cliquez pour supprimer l'image"
                                  onClick={(e) => {
                                      e.preventDefault()

                                      let picturesBuffer1 =
                                          post.pictures.filter(
                                              (data, idx) => idx !== index
                                          )
                                      setPost({
                                          ...post,
                                          pictures: picturesBuffer1,
                                      })
                                      if (!picture.idpost) {
                                          var picturesBuffer2 =
                                              uploadedPictures.filter(function (
                                                  el
                                              ) {
                                                  return el.name !== picture.id
                                              })

                                          console.log(picturesBuffer2)
                                          setUploadedPictures(picturesBuffer2)
                                      }
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
                                      src={picture.url}
                                      alt="contenu du post"
                                  />
                              </button>
                          ))}
                    {post.pictures.length >= 10 || isLoading.current ? null : (
                        <label
                            htmlFor="file-selector"
                            aria-label="zone de sélection des photos du post"
                            className="postrepair-picture-placeholder postrepair-file-input"
                        >
                            <input
                                type="file"
                                id="file-selector"
                                accept="image/jpg, image/png, image/jpeg"
                                className="postrepair-picture-placeholder-invisible"
                                name="file"
                                multiple
                                onChange={(e) => {
                                    updateDisplay(e)
                                }}
                                aria-label="zone de sélection des photos du post"
                            />

                            <FontAwesomeIcon
                                icon="fa-solid fa-paperclip"
                                size="3x"
                                className="post-repair-icon-paperclip"
                            />
                        </label>
                    )}
                </div>
                <div className="postrepair-description-modification-frame">
                    <textarea
                        maxLength="500"
                        value={post.description}
                        onChange={(e) => {
                            setPost({ ...post, description: e.target.value })
                        }}
                        id="postrepair-description-input"
                        aria-label="zone de sélection de la description du post"
                    />
                </div>
                <div className="postrepair-submit-buttons-frame">
                    {post.idUser === userData.userId || userData.userId > 2 ? (
                        <button
                            type="submit"
                            onClick={deletePost}
                            className="delete-button"
                            id="post-repair-delete-button"
                            aria-label="bouton de suppression du post"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-trash-alt"
                                size="1x"
                            />
                        </button>
                    ) : null}
                    {post.pictures.length > 10 ? (
                        <button
                            type="submit"
                            disabled={true}
                            className="submit-button-wrong"
                        >
                            10 images par post maximum
                        </button>
                    ) : post.description === '' ? (
                        <button
                            type="submit"
                            disabled={true}
                            className="submit-button-wrong"
                        >
                            Description vide
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={updatePost}
                            className="toggle-modif-button"
                            id="postrepair-submit-button"
                            aria-label="mise à jour de la publication avec les informations saisies dnas les champs précédents"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-check"
                                size="1x"
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostRepair
