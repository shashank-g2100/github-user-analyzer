"use client"

import { useState } from "react"
import { GitHubProfile } from "@/components/github-profile"
import { SearchForm } from "@/components/search-form"

export default function Home() {
  const [username, setUsername] = useState<string>("")
  const [isSearched, setIsSearched] = useState<boolean>(false)

  const handleSearch = (searchUsername: string) => {
    setUsername(searchUsername)
    setIsSearched(true)
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">GitHub Profile Analyzer</h1>
      <SearchForm onSearch={handleSearch} />

      {isSearched && username && <GitHubProfile username={username} />}
    </main>
  )
}

