import React, { createContext, useState, useEffect } from 'react';

export const MainContext = createContext();

const MainProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [distributer, setDistributer] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [adminRole, setAdminRole] = useState("");
    const [adminName, setAdminName] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/category/fetch`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",

            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getUserRoleFromToken = () => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("adminToken="))
            ?.split("=")[1];

        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                role: payload.role || null,
                name: payload.name || null
            };
        } catch (error) {
            return null;
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/department/fetch`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",

            });

            if (response.ok) {
                const data = await response.json();
                setDepartments(data.departments);
            } else {
                console.error('Failed to fetch Departments');
            }
        } catch (error) {
            console.error('Error fetching Departments:', error);
        }
    };

    const fetchDistributor = async () => {
        try {

            const response = await fetch(`${BASE_URL}/distributer/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });

            if (!response.ok) {
                console.error('Failed to fetch distributors');
                return;
            }

            const data = await response.json();

            if (Array.isArray(data.distributors)) {
                setDistributer(data.distributors);
            } else {
                console.error('Unexpected data format:', data);
                setDistributer([]);
            }

        } catch (error) {
            console.error('Error fetching distributors:', error);
        }
    };


    useEffect(() => {
        const userInfo = getUserRoleFromToken();

        if (userInfo) {
            setAdminRole(userInfo.role);
            setAdminName(userInfo.name);
        }
        if (BASE_URL) {
            fetchCategories();
            fetchDistributor();
            fetchDepartments();
        }
    }, [BASE_URL]);

    return (
        <MainContext.Provider value={{ categories, adminRole, adminName, fetchCategories, setAdminRole, setAdminName, fetchDepartments, departments, fetchDistributor, distributer }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainProvider;
