"use client";
import React, { useState } from "react";
import { Search as SearchIcon } from 'lucide-react';
import { useQuery } from 'react-query';
import ReactMarkdown from 'react-markdown';

const searchDocuments = async (query: string) => {
  const response = await fetch('http://localhost:8000/search/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: query }),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery(
    ['searchDocuments', searchQuery],
    () => searchDocuments(searchQuery),
    { enabled: false }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />

              <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-700"
                  onClick={handleSearch}
                >
                  <span className="sr-only">Поиск</span>
                  <SearchIcon className="size-4" />
                </button>
              </span>
            </div>
          </div>
          
          {isLoading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-center mt-4 text-red-500">Error: {(error as Error).message}</p>}
          {data && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              {data.output.map((result: any, index: number) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium mb-2">{result.title || `Result ${index + 1}`}</h3>
                  <ReactMarkdown className="prose">
                    {result.content || result}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
