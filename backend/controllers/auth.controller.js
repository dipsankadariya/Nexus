import express from 'express';

export const signup = async (req, res) => {
    res.json({
        data: "Hitted signup endpoint",
    });
};

export const login = async (req, res) => {
    res.json({
        data: "Hitted login endpoint",
    });
};

export const logout = async (req, res) => {
    res.json({
        data: "Hitted logout endpoint",
    });
};
