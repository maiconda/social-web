import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider(props) {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser !== null ? JSON.parse(storedUser) : {
      name: '',
      firstName: '',
      email: '',
      img: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const [log, setLog] = useState('')

  const [notifications, setNotifications] = useState([])

  const [allUsers, setAllUsers] = useState([])

  const [likes, setLikes] =  useState([])

  const [statusNotification, setStatusNotification] = useState(0)

  const [postOptions, setPostOptions] = useState({})

  const [commentOptions, setCommentOptions] = useState({})

  const [posts, setPosts] = useState([])

  const [profilePosts, setProfilePosts] = useState([])

  return (
    <UserContext.Provider value={{ user, setUser, log, setLog, notifications, setNotifications, allUsers, setAllUsers, likes, setLikes, statusNotification, setStatusNotification, postOptions, setPostOptions, commentOptions, setCommentOptions, posts, setPosts, profilePosts, setProfilePosts}}>
      {props.children}
    </UserContext.Provider>
  );
}
