import { useEffect, useContext } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import { UserContext } from '../../UserContext';

function Header(props){

    const url = 'http://localhost:3000'

    const { user, statusNotification, setPosts, setStatusNotification, log, setLog, setNotifications } = useContext(UserContext)

    const openPopup = (element) => {
        document.getElementById('popups').style.display = "flex"
        document.getElementById(element).style.display = "block"
    }

    const getPosts = () => {
        axios.get(`${url}/posts`).then((res) => setPosts(res.data.reverse()))
    }

    useEffect(()=>{
        if(user.name == ''){
            setLog('deslogado')
        } else {
            setLog('logado')
        }
        
        getPosts()
    }, [])

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

    useEffect(()=>{
        getNotify()
    }, [user])

    const verifySearchIcon = (e) => {
        if(e.length > 0){
            document.getElementById("search-button").style.visibility = "visible"
            document.getElementById("search-button").style.opacity = "100%"
        }
        if(e.length === 0){
            document.getElementById("search-button").style.opacity = "0"
            document.getElementById("search-button").style.visibility = "hidden"
        }
    }

    const search = (e) => {
        e.preventDefault()
        console.log("sada") 
    }

    return(
        <header>
            <nav className="fixed-header">
                    <div id="home-div">
                        <svg width="800px" id="home" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 20V11H3L12 5L21 11H17.5V20H14.5V16.5C14.5 15.6716 13.8284 15 13 15H11C10.1716 15 9.5 15.6716 9.5 16.5V20H6.5Z"  />
                        </svg>
                    </div>
                    <div id="users-3-div">
                        <svg id="users-3"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0zm544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z"/></svg>
                    </div>
                    <div id="linkedin-3-div">
                            <svg id="linkedin-3" width="20px" height="20px" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 8.219v15.563c0 1.469 1.156 2.625 2.625 2.625h15.563c0.719 0 1.406-0.344 1.844-0.781 0.469-0.469 0.781-1.063 0.781-1.844v-15.563c0-1.469-1.156-2.625-2.625-2.625h-15.563c-0.781 0-1.375 0.313-1.844 0.781-0.438 0.438-0.781 1.125-0.781 1.844zM2.813 10.281c0-1 0.813-1.875 1.813-1.875 1.031 0 1.875 0.875 1.875 1.875 0 1.031-0.844 1.844-1.875 1.844-1 0-1.813-0.813-1.813-1.844zM7.844 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.656c0.375 0 0.375 0.438 0.375 0.719 0.75-0.75 1.719-0.938 2.719-0.938 2.438 0 4 1.156 4 3.719v6.438c0 0.219-0.188 0.406-0.375 0.406h-2.75c-0.219 0-0.375-0.219-0.375-0.406v-5.813c0-0.969-0.281-1.5-1.375-1.5-1.375 0-1.719 0.906-1.719 2.125v5.188c0 0.219-0.219 0.406-0.438 0.406h-2.719c-0.156 0-0.375-0.219-0.375-0.406zM2.875 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.719c0.25 0 0.406 0.156 0.406 0.406v9.531c0 0.219-0.188 0.406-0.406 0.406h-2.719c-0.188 0-0.375-0.219-0.375-0.406z"></path>
                            </svg>
                    </div>
                    <div id="github-3-div">
                            <svg id="github-3" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" fill="none"/>
                            <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"/>
                            </svg>
                    </div>
                    <div id="site-3-div">
                            <svg id="site-3" width="800px" height="800px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M418.275,146h-46.667  c-5.365-22.513-12.324-43.213-20.587-61.514c15.786,8.776,30.449,19.797,43.572,32.921C403.463,126.277,411.367,135.854,418.275,146  z M452,256c0,17.108-2.191,33.877-6.414,50h-64.034c1.601-16.172,2.448-32.887,2.448-50s-0.847-33.828-2.448-50h64.034  C449.809,222.123,452,238.892,452,256z M256,452c-5.2,0-21.048-10.221-36.844-41.813c-6.543-13.087-12.158-27.994-16.752-44.187  h107.191c-4.594,16.192-10.208,31.1-16.752,44.187C277.048,441.779,261.2,452,256,452z M190.813,306  c-1.847-16.247-2.813-33.029-2.813-50s0.966-33.753,2.813-50h130.374c1.847,16.247,2.813,33.029,2.813,50s-0.966,33.753-2.813,50  H190.813z M60,256c0-17.108,2.191-33.877,6.414-50h64.034c-1.601,16.172-2.448,32.887-2.448,50s0.847,33.828,2.448,50H66.414  C62.191,289.877,60,273.108,60,256z M256,60c5.2,0,21.048,10.221,36.844,41.813c6.543,13.087,12.158,27.994,16.752,44.187H202.404  c4.594-16.192,10.208-31.1,16.752-44.187C234.952,70.221,250.8,60,256,60z M160.979,84.486c-8.264,18.301-15.222,39-20.587,61.514  H93.725c6.909-10.146,14.812-19.723,23.682-28.593C130.531,104.283,145.193,93.262,160.979,84.486z M93.725,366h46.667  c5.365,22.513,12.324,43.213,20.587,61.514c-15.786-8.776-30.449-19.797-43.572-32.921C108.537,385.723,100.633,376.146,93.725,366z   M351.021,427.514c8.264-18.301,15.222-39,20.587-61.514h46.667c-6.909,10.146-14.812,19.723-23.682,28.593  C381.469,407.717,366.807,418.738,351.021,427.514z"/></svg>
                    </div>
                    <div id="profile-3-div">
                        <img className="profile-3" src="https://s2.glbimg.com/iE9wE9lni7B8UA0OCGizEzpNH6E=/0x0:2115x1405/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/Q/s/Si3PO2TdGrIYeVpXZ1FA/2020-05-09t000000z-1874358627-rc25lg9vwuf5-rtrmadp-3-health-coronavirus-tesla.jpg" alt="" />
                    </div>
            </nav>
            <header className="header-1">
                <Link onClick={() => {getPosts(); getNotify()}} to={'/'}>
                <div className="logo">
                    <h1>SOCIAL</h1>
                    <h1>WEB</h1>
                </div>
                </Link>
                <div>
                    <form onSubmit={search} className="search">
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="1280.000000pt" height="1230.000000pt" viewBox="0 0 1280.000000 1230.000000"
                        preserveAspectRatio="xMidYMid meet">
                        <metadata>
                        Created by potrace 1.15, written by Peter Selinger 2001-2017
                        </metadata>
                        <g transform="translate(0.000000,1230.000000) scale(0.100000,-0.100000)"
                        fill="#8e97a3" stroke="none">
                        <path d="M4970 12294 c-25 -2 -106 -8 -180 -14 -1181 -95 -2334 -616 -3184
                        -1440 -317 -307 -568 -614 -792 -967 -449 -708 -709 -1478 -796 -2358 -17
                        -173 -17 -720 0 -900 69 -738 273 -1425 604 -2040 500 -928 1256 -1675 2189
                        -2164 919 -481 1996 -677 3049 -555 868 100 1728 430 2427 931 56 40 104 73
                        108 73 3 0 641 -588 1418 -1307 776 -718 1437 -1326 1467 -1350 72 -58 235
                        -138 335 -165 116 -31 355 -31 470 0 600 165 884 837 581 1375 -78 138 76 -8
                        -1913 1831 l-1080 998 84 142 c167 280 340 657 449 978 403 1187 368 2487 -98
                        3656 -388 976 -1074 1820 -1949 2402 -726 482 -1517 764 -2399 855 -144 15
                        -682 28 -790 19z m614 -1879 c656 -70 1247 -314 1771 -731 141 -112 406 -377
                        519 -519 594 -744 844 -1668 705 -2608 -183 -1239 -1087 -2308 -2284 -2700
                        -389 -128 -707 -174 -1138 -164 -268 6 -406 22 -632 72 -950 213 -1757 815
                        -2233 1666 -373 666 -506 1454 -372 2209 160 909 697 1723 1475 2236 455 300
                        954 479 1498 538 169 19 520 19 691 1z"/>
                        </g>
                        </svg>
                        <input onChange={(e) => verifySearchIcon(e.target.value)} placeholder="Pesquisar" id="search-i" type="text" />
                        <button id="search-button">Pesquisar</button>
                    </form>

                    {log === 'deslogado' && <button onClick={() => openPopup('login-div')} className="button-entrar">Entrar</button>}
                    {log === 'logado' &&
                    <div onClick={()=> openPopup('notification-div')} className="notify-div">
                        <svg width="40px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
                        <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"/>
                        </svg>

                        {statusNotification > 0 &&  <div className="notifications-number"><p>{statusNotification}</p></div>}
                       
                    </div>}

                    {log === 'logado' && <button onClick={()=> openPopup('sair-div')} className="button-entrar">Sair</button>}
                    
                </div>
            </header>
            <header className="header-2">
            <form className="search">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="1280.000000pt" height="1230.000000pt" viewBox="0 0 1280.000000 1230.000000"
                    preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,1230.000000) scale(0.100000,-0.100000)"
                    fill="#8e97a3" stroke="none">
                    <path d="M4970 12294 c-25 -2 -106 -8 -180 -14 -1181 -95 -2334 -616 -3184
                    -1440 -317 -307 -568 -614 -792 -967 -449 -708 -709 -1478 -796 -2358 -17
                    -173 -17 -720 0 -900 69 -738 273 -1425 604 -2040 500 -928 1256 -1675 2189
                    -2164 919 -481 1996 -677 3049 -555 868 100 1728 430 2427 931 56 40 104 73
                    108 73 3 0 641 -588 1418 -1307 776 -718 1437 -1326 1467 -1350 72 -58 235
                    -138 335 -165 116 -31 355 -31 470 0 600 165 884 837 581 1375 -78 138 76 -8
                    -1913 1831 l-1080 998 84 142 c167 280 340 657 449 978 403 1187 368 2487 -98
                    3656 -388 976 -1074 1820 -1949 2402 -726 482 -1517 764 -2399 855 -144 15
                    -682 28 -790 19z m614 -1879 c656 -70 1247 -314 1771 -731 141 -112 406 -377
                    519 -519 594 -744 844 -1668 705 -2608 -183 -1239 -1087 -2308 -2284 -2700
                    -389 -128 -707 -174 -1138 -164 -268 6 -406 22 -632 72 -950 213 -1757 815
                    -2233 1666 -373 666 -506 1454 -372 2209 160 909 697 1723 1475 2236 455 300
                    954 479 1498 538 169 19 520 19 691 1z"/>
                    </g>
                    </svg>
                    <input onChange={(e) => verifySearchIcon(e.target.value)} placeholder="Pesquisar" id="search-i" type="text" />
                    <div id="submit-button">
                        <svg fill="#ffffff" height="60px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 492 492">
                        <g>
                            <g>
                                <path d="M484.128,104.478l-16.116-16.116c-5.064-5.068-11.816-7.856-19.024-7.856c-7.208,0-13.964,2.788-19.028,7.856
                                    L203.508,314.81L62.024,173.322c-5.064-5.06-11.82-7.852-19.028-7.852c-7.204,0-13.956,2.792-19.024,7.852l-16.12,16.112
                                    C2.784,194.51,0,201.27,0,208.47c0,7.204,2.784,13.96,7.852,19.028l159.744,159.736c0.212,0.3,0.436,0.58,0.696,0.836
                                    l16.12,15.852c5.064,5.048,11.82,7.572,19.084,7.572h0.084c7.212,0,13.968-2.524,19.024-7.572l16.124-15.992
                                    c0.26-0.256,0.48-0.468,0.612-0.684l244.784-244.76C494.624,132.01,494.624,114.966,484.128,104.478z"/>
                            </g>
                        </g>
                        </svg>
                    </div>
                    </form>
            </header>
        </header>
    )
}

export default Header