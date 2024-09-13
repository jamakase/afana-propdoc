"use client";
import React, { useState } from "react";
import { Search as SearchIcon } from 'lucide-react';
import { useQuery } from 'react-query';
import ReactMarkdown, { Components } from 'react-markdown';

const S3_PREFIX = 'https://storage.yandexcloud.net/afana-propdoc-production/';

const searchDocuments = async (query: string) => {
  const response = await fetch('https://ml.banzai-team.ru/search/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: query }),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// Функция для добавления префикса к ссылкам на изображения
const processS3Links = (text: string) => {
  return text.replace(/\(s3:\/\/afana-propdoc-production\/[^)]+\)/g, (match) => {
    const link = match.slice(1, -1);
    const fullLink = S3_PREFIX + link;
    return `(${fullLink})`;
  });
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

  const customRenderers: Components = {
    a: ({ href, children }) => {
      if (href && href.startsWith(S3_PREFIX)) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{children}</a>;
      }
      return <a href={href}>{children}</a>;
    },
    img: ({ src, alt }) => {
      return <img src={src} alt={alt} style={{ maxWidth: '100%' }} />; // Ограничиваем ширину изображения
    },
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <header className="px-4 pt-4 md:py-5 md:px-10 w-full hidden md:block">
        <h1 className="text-md md:text-2xl font-bold text-black">
          Поиск по документам
        </h1>
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
                className="w-full bg-[#EFF0F3] rounded-full p-4 focus:outline-none py-2.5 text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
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
                  <ReactMarkdown className="prose" components={customRenderers}>
                    {processS3Links(result.content || result)}
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
