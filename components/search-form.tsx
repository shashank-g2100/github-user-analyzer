"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  onSearch: (username: string) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSearch(username.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md mx-auto mb-10 space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter GitHub username"
          className="pl-10"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <Button type="submit">Analyze</Button>
    </form>
  )
}

