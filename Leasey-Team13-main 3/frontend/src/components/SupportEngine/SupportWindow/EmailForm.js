import React, { useState,useEffect } from "react"

import { styles } from "../styles"

import axios from 'axios'

import { LoadingOutlined } from '@ant-design/icons'

import Avatar from '../Avatar'

import { getUser } from "../../../requests"

const EmailForm = props => {    
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            getUser(token)
                .then(user => {
                    if (user) {
                        setUser(user);
                    } else {
                        console.error('No user data returned');
                    }
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                });
        }
    }, []);

    function getOrCreateUser(callback) {
        axios.put(
            'https://api.chatengine.io/users/',
            {username: email, email: email, secret: email},
            {headers: {"Private-Key": '941b864e-8e37-4bb3-bb9d-33cb8952d310'}}
        )
        .then(r => callback(r.data))
        .catch(e => console.log('Get or create user error', e))
    }

    function getOrCreateChat(callback) {
        axios.put(
            'https://api.chatengine.io/chats/',
            {usernames: [email, 'Gopi'], is_direct_chat: true},
            {headers: {
                "Project-ID": 'c85f78b0-dbe4-4c44-9fe1-ad7b1b8fb3ed',
                "User-Name": email,
                "User-Secret": email,
            }}
        )
        .then(r => callback(r.data))
        .catch(e => console.log('Get or create chat error', e))
    }

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true)

        console.log('Sending Email', email)
        console.log("API Key:", process.env.REACT_APP_CE_PRIVATE_KEY);

        getOrCreateUser(
            user => {
                props.setUser && props.setUser(user)
                getOrCreateChat(chat => {
                    setLoading(false)
                    props.setChat && props.setChat(chat)
                })
            }
        )
    }

    return (
        <div 
            style={{
                ...styles.emailFormWindow,
                ...{ 
                    height: props.visible ? '100%' : '0px',
                    opacity: props.visible ? '1' : '0'
                }
            }}
        >
            <div style={{ height: '0px' }}>
                <div style={styles.stripe} />
            </div>

            <div 
                className='transition-5'
                style={{
                    ...styles.loadingDiv,
                    ...{ 
                        zIndex: loading ? '10' : '-1',
                        opacity: loading ? '0.33' : '0',
                    }
                }}
            />
            <LoadingOutlined
                className='transition-5'
                style={{
                    ...styles.loadingIcon,
                    ...{ 
                        zIndex: loading ? '10' : '-1',
                        opacity: loading ? '1' : '0',
                        fontSize: '82px',
                        top: 'calc(50% - 41px)', 
                        left: 'calc(50% - 41px)',  
                    }
                }}
            />

            <div style={{ position: 'absolute', height: '100%', width: '100%', textAlign: 'center' }}>
                <Avatar 
                    style={{ 
                        position: 'relative',
                        left: 'calc(50% - 44px)',
                        top: '10%',
                    }}
                />

                <div style={styles.topText}>
                    Welcome to my <br /> Chat👋
                </div>

                <form 
                    onSubmit={e => handleSubmit(e)}
                    style={{ position: 'relative', width: '100%', top: '19.75%' }}
                >
                    <input 
                        placeholder='Your Email'
                        onChange={e => setEmail(e.target.value)}
                        style={styles.emailInput}
                    />
                </form>
                
                <div style={styles.bottomText}>
                    Enter your email <br /> 
                </div>
            </div>
        </div>
    )
}

export default EmailForm;
