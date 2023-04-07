import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode"
import { useContext } from 'react'
import { UserContext } from '../../UserContext';
import User from '../user'
import Notification from '../notification';
import axios from 'axios';

function Popups(){

    const url = 'http://localhost:3000'


    const { user, setUser, setLog, notifications, setNotifications, allUsers, setAllUsers, likes, statusNotification, setStatusNotification, postOptions, commentOptions, setPosts, profilePosts, setProfilePosts } = useContext(UserContext)

    let data = new Date();
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    let dataAtual = dia + '/' + mes + '/' + ano;

    const closePopup = (element) => {
        document.getElementById('popups').style.display = "none"
        document.getElementById(element).style.display = "none"
    }
    
    const openPopup = (element) => {
        document.getElementById('popups').style.display = "flex"
        document.getElementById(element).style.display = "block"
    }

    const getUsers = () => {
        axios.get(`${url}/users`).then((res) => {
            setAllUsers(res.data)

            if(user.email != ''){
                res.data.forEach(element => {
                        if(element.email === user.email){
                            setUser(prevUser => ({
                                ...prevUser,
                                userId: element.id
                            }))
                        }
                });
            }
        })  
    }

    let haveUser = ''

    const setInfos = (userInfo) => {

        let idUser = ''

        allUsers.forEach(element => {
            if(element.email === userInfo.email){
                idUser = element.id
            }
        });

        setUser({
            name: userInfo.name,
            firstName: userInfo.given_name,
            email: userInfo.email,
            img: userInfo.picture,
            userId: idUser
        })

        setLog('logado')

        haveUser = ''

        allUsers.forEach(element => {
            if(element.email === userInfo.email){
                haveUser = 'have'
            }
        });

        if(haveUser != 'have'){
            axios.post(`${url}/users`,
        {
			"name" : userInfo.name,
			"email" : userInfo.email,
            "img" : userInfo.picture,
            "notify": [],
            "endpoints": []
        }).then(() => {
            getUsers()
            closePopup('login-div')
        })
        } else {
            closePopup('login-div')
        }
    }

    const postar = (e) => {
        e.preventDefault()

        if (document.getElementById('post-textarea').value != '') {

            axios.post(`${url}/posts`,
            {
                post : document.getElementById('post-textarea').value,
                data : dataAtual,
                name : user.name,
                img : user.img,
                userId: user.userId,
                comments: [],
                likes: []

            }).then((res) => {
                axios.get(`${url}/users/${res.data.userId}`).then((res2) => {
                    axios.put(`${url}/users/${res.data.userId}`,{
                        name : res2.data.name,
                        email : res2.data.email,
                        img : res2.data.img,
                        notify: res2.data.notify,
                        endpoints: [
                            `${url}/posts/${res.data.id}`,
                            ...res2.data.endpoints
                        ]
                    }).then(()=>{
                        getPosts()
                    })
                })
                closePopup('postar-popup')
                document.getElementById('post-textarea').value = ''
            })
        }
    }

    const getPosts = () => {

        if (document.location.pathname == '/') {
            axios.get(`${url}/posts`).then((res) => setPosts(res.data.reverse()))
        }
        
        if (document.location.pathname.startsWith('/profile')){
            axios.get(`${url}/users/${user.userId}`).then((res) => {
                axios.all(res.data.endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setProfilePosts(res))
            })
        }
    }

    const updateNotify = () => {

    if (statusNotification > 0) {

        axios.get(`${url}/users/${user.userId}`).then((res) => {

            const newArray = res.data.notify.map(obj => ({ ...obj, status: 'yes' }))
            
            axios.put(`${url}/users/${user.userId}`,{
                notify: newArray,
                name: res.data.name,
                endpoints: res.data.endpoints,
                email: res.data.email,
                img: res.data.img,
                id: res.data.id
            }).then(() => {
                getNotify()
                setStatusNotification([])
            })
            getNotify()
        })
    }
    }

    const edit = (e) => {

        let inputValue = document.getElementById('edit-textarea').value

        e.preventDefault()

        if (inputValue != '') {
            
            axios.get(`${url}/posts/${postOptions.id}`).then((res) => {

                axios.put(`${url}/posts/${postOptions.id}`, {
                    comments: res.data.comments,
                    data: res.data.data,
                    img: res.data.img,
                    likes: res.data.likes,
                    name: res.data.name,
                    userId: res.data.userId,
                    post: inputValue
                }).then(() => {
                    closePopup('editar-popup')
                    getPosts()
                })
            })
        }

    }

    const removePost = () => {
        axios.delete(`${url}/posts/${postOptions.id}`).then(() => {
            removePostNotify()
        })
    }

    const removeEndpoint = () => {

        axios.get(`${url}/users/${postOptions.userId}`).then((res) => {

            let newEndpoints = res.data.endpoints.filter(endpoint => endpoint !== `${url}/posts/${postOptions.id}`)

            axios.put(`${url}/users/${postOptions.userId}`, {
                endpoints: newEndpoints,
                notify: res.data.notify,
                name: res.data.name,
                email: res.data.email,
                img: res.data.img,
                id: res.data.id
            }).then(()=>{
                closePopup('options-div')
                getPosts()

            })
        })
    }

    const getNotify = () => {

        if (user.name != '') {
            axios.get(`${url}/users/${user.userId}`).then((res) => {
                if(res.data.notify != undefined){

                    setStatusNotification(0)

                    res.data.notify.forEach(element => {
                        if (element.status === 'no') {
                            setStatusNotification((prevState) => prevState + 1);
                          }
                    });

                    setNotifications(res.data.notify)
                }
            })
        }    
    }

    const removePostNotify = () => {
        axios.get(`${url}/users/${user.userId}`).then((res) => {
            axios.put(`${url}/users/${user.userId}`, {
                notify: res.data.notify.filter(i => !(i.idPost === postOptions.id)),
                endpoints: res.data.endpoints,
                name: res.data.name,
                email: res.data.email,
                img: res.data.img,
                id: res.data.id
            }).then(() => {
                removeEndpoint()
                getNotify()
            })
        })
    }

    const removeComment = () => {
        axios.get(`${url}/posts/${commentOptions.postId}`).then((res) => {
            axios.put(`${url}/posts/${commentOptions.postId}`,{
                
                comments: res.data.comments.filter(i => !(i.userId === user.userId && i.comment === commentOptions.comment)),
                likes: res.data.likes,
                data: res.data.data,
                id: res.data.id,
                img: res.data.img,
                name: res.data.name,
                post: res.data.post,
                userId: res.data.userId
            }).then(() => {
                getPosts()
                closePopup('options-comment-div')
                removeNotify(commentOptions.userPostId, commentOptions.postId, 'comentou em')
            })
        })
    }

    const removeNotify = (postUserId, postId, typeNotification) => {
     
        if(postUserId != user.userId){
            axios.get(`${url}/users/${postUserId}`).then((res) => {
                axios.put(`${url}/users/${postUserId}`, {
                    notify: res.data.notify.filter(i => !(i.userId === user.userId && i.type === typeNotification && i.idPost === postId)),
                    name: res.data.name,
                    endpoints: res.data.endpoints,
                    email: res.data.email,
                    img: res.data.img,
                    id: res.data.id
                })
            })
        }
    }


    return(
    <div id="popups" className="popups">

        <div id="login-div" className="popups-div">
            <h1>Entrar</h1>
            <GoogleLogin
            onSuccess={credentialResponse => {
                let userInfo = jwt_decode(credentialResponse.credential)
                setInfos(userInfo)
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            />
            <button onClick={() => closePopup('login-div')}>Fechar</button>
        </div>

        <div className="postar-popup" id="postar-popup">
            <div className="header-postar">
                <span></span>
                <h2>Criar Publicação</h2>
                <div onClick={() => closePopup('postar-popup')}>
                <svg width="80px" height="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#ffffff"/>
                    </svg>
                </div>
            </div>
            <div className="postar-popup-user">
                <img src={user.img} alt="" />
                <div>
                    <p>{user.name}</p>
                    <p>{dataAtual}</p>
                </div>
            </div>
            <form onSubmit={postar}>
                <div id="text-area">
                <textarea spellCheck = "false" placeholder={`No que você está pensando, ` + user.firstName + "?"} name="" id="post-textarea"></textarea>
                </div>
                
                <button>Publicar</button>
            </form>
        </div>

        <div id="sair-div">
            <h2>Você deseja saír?</h2>
            <div>
                <button onClick={() => {
                    setLog('deslogado')
                    setUser({
                        name: '',
                        firstName: '',
                        email: '',
                        img: '',
                        userId: ''
                    })

                    setNotifications([])
                    closePopup('sair-div')
                    
                    }}>Sim</button>
                <button onClick={() => {
                    closePopup('sair-div')}}>Não</button>
            </div>
        </div>

        <div id="usuarios-div">
                
                <div className="header-usuarios">
                <span></span>
                <h2>Usuários</h2>
                <div onClick={() => closePopup('usuarios-div')}>
                <svg width="80px" height="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#ffffff"/>
                    </svg>
                </div>
            </div>
                <div id="usuarios-div-2">
                {allUsers.map((user, index) => (
                    <User
                        key={index}
                        name={user.name}
                        img={user.img}/>
                ))}
                </div>
        </div>

        <div id="curtidas-div">
                
                <div className="header-usuarios">
                <span></span>
                <h2>Curtidas</h2>
                <div onClick={() => closePopup('curtidas-div')}>
                <svg width="80px" height="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#ffffff"/>
                </svg>
                </div>
            </div>
                <div id="usuarios-div-2">
                {likes.map((like, index) => (
                    <User
                    key={index}
                    name={like.name}
                    img={like.img}/>
                ))}
                </div>
        </div>

        <div id="notification-div">
            <div className="header-notification header-usuarios">
                    <span></span>
                    <h2>Notificações</h2>
                    <div onClick={() => {closePopup('notification-div'); updateNotify()}}>
                    <svg width="80px" height="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#ffffff"/>
                    </svg>
                    </div>
            </div>
            <div className="notifications-div">

                {notifications.length === 0 && 
                    <div className="not-notifications">
                        <p>Você ainda não possui notificações</p>
                    </div>
                }

                {notifications.map((notification, index) => (


                    <Notification
                        key={index}
                        class={notification.status === 'no' && 'no-notification'}
                        name={notification.userName}
                        type={notification.type}
                        img={notification.userImg}
                    />
                ))}
            </div>
        </div>

        <div id="options-div">
            <h2>Opções da Publicação</h2>
            <button onClick={() => {
                openPopup('editar-popup')
                document.getElementById('options-div').style.display = 'none'
                }}>Editar Conteúdo</button>
            <button onClick={() => {removePost()}}>Remover Publicação</button>
            <button onClick={() => {closePopup('options-div')}}>Fechar</button>
        </div>

        <div id="options-comment-div">
            <h2>Opções do Comentário</h2>
            <button onClick={() => {removeComment()}}>Remover Comentário</button>
            <button onClick={() => {closePopup('options-comment-div')}}>Fechar</button>
        </div>

        <div className="postar-popup" id="editar-popup">
            <div className="header-postar">
                <span></span>
                <h2>Editar Publicação</h2>
                <div onClick={() => {closePopup('editar-popup')}}>
                <svg width="80px" height="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#ffffff"/>
                    </svg>
                </div>
            </div>
            <form onSubmit={edit}>
                <div id="text-area">
                <textarea spellCheck = "false" placeholder={`No que você está pensando, ` + user.firstName + "?"} name="" id="edit-textarea"></textarea>
                </div>
                
                <button>Confirmar</button>
            </form>
        </div>

    </div>
    )
}

export default Popups