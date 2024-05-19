
import React, { useState, useEffect } from 'react';

const UserContext = React.createContext({ email: '', auth: false, role: '' });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { email: '', auth: false, id: null, role: '' };
    });

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const loginContext = (email, token, id, role) => {
        setUser({ email: email, auth: true, token: token, id: id, role: role });
        console.log('User after login:', { email: email, auth: true, token: token, id: id, role: role });
      };
    
    const setToken = (token) => {
        setUser((user) => ({ ...user, token: token }));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser({ email: '', auth: false, role: '' });
    };

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };