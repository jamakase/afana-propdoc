"use client";
import React, { useState } from "react";
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Поиск:", searchQuery);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* <header className="py-4 pl-16 pr-2 md:py-5 md:px-10 w-full rounded-b-[30px] fixed md:relative top-0 z-20"> */}
      <header className="px-4 pt-4 md:py-5 md:px-10 w-full hidden md:block">
        {/* <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center"> */}
          <h1 className="text-md md:text-2xl font-bold text-black  ">
            Поиск по документам
          </h1>

      </header>
      <main className="flex-grow w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-4xl">
              <label htmlFor="Search" className="sr-only">
                Поиск
              </label>

              <input
                type="text"
                id="Search"
                placeholder="Искать..."
                className="w-full bg-[#EFF0F3] rounded-full p-4 focus:outline-none py-2.5 text-black"
              />

              <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-700"
                >
                  <span className="sr-only">Поиск</span>

                  <SearchIcon className="size-4" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
