"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Поиск:', searchQuery);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#17153B]">
            <header className="bg-[#9400FF] p-4 w-full">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">Поиск по документам</h1>
                    <Link
                        href="/"
                        className="group inline-block text-center rounded-full bg-gradient-to-r from-[#070260] via-[#090979] to-[#00d4ff] p-[2px] hover:text-white focus:outline-none active:text-opacity-75 cursor-pointer select-none transition-transform active:scale-95"
                    >
                        <span className="block rounded-full bg-black px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium group-hover:bg-transparent">
                            <span className="text-white">
                                Вернуться на главную
                            </span>
                        </span>
                    </Link>  
                </div>
            </header>
            <main className="flex-grow w-full">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-4xl">
                            <label htmlFor="Search" className="sr-only">Поиск</label>

                            <input
                                type="text"
                                id="Search"
                                placeholder="Искать..."
                                className="w-full rounded-full p-4 focus:outline-none py-2.5 text-black"
                            />

                            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                <button type="button" className="text-gray-600 hover:text-gray-700">
                                    <span className="sr-only">Поиск</span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}