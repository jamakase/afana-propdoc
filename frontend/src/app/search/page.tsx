"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Здесь будет логика поиска
        console.log('Поиск:', searchQuery);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-black p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Поиск документов</h1>
                    <Link href="/main" className="px-4 py-2 bg-blue-500 rounded-2xl text-white rounded hover:bg-blue-600">
                        Вернуться на главную
                    </Link>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <div className="mb-8">
                    <div className="flex">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Введите запрос для поиска"
                            className="flex-grow p-2 border border-gray-300 rounded-l-2xl focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-r-2xl hover:bg-blue-600 focus:outline-none"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '24px', lineHeight: '15px', paddingTop: '10px' }}>
                                search
                            </span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}