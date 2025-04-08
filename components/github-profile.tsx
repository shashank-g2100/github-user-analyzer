"use client"

import { useEffect, useState } from "react"
import { ExternalLink, GitFork, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CommitsChart } from "@/components/commits-chart"

interface GitHubUser {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
}

interface CommitActivity {
  days: number[]
  total: number
  week: number
}

export function GitHubProfile({ username }: { username: string }) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`)
        if (!userResponse.ok) {
          throw new Error(`User not found: ${userResponse.statusText}`)
        }
        const userData = await userResponse.json()
        setUser(userData)

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
        if (!reposResponse.ok) {
          throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`)
        }
        const reposData = await reposResponse.json()
        setRepos(reposData)

        // Fetch commit activity for the first repository if available
        if (reposData.length > 0) {
          const commitResponse = await fetch(
            `https://api.github.com/repos/${username}/${reposData[0].name}/stats/commit_activity`,
          )
          if (commitResponse.ok) {
            const commitData = await commitResponse.json()
            setCommitActivity(commitData)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <p className="mt-2">Please try another username.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src={user.avatar_url || "/placeholder.svg"}
              alt={`${username}'s avatar`}
              className="rounded-full w-24 h-24 object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <p className="text-muted-foreground mb-2">@{user.login}</p>
              {user.bio && <p className="mb-4">{user.bio}</p>}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div>
                  <p className="font-medium">{user.public_repos}</p>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </div>
                <div>
                  <p className="font-medium">{user.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-medium">{user.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-sm text-primary hover:underline"
              >
                View on GitHub <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repositories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="commits">Commit Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="repositories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Repositories</CardTitle>
              <CardDescription>Latest public repositories</CardDescription>
            </CardHeader>
            <CardContent>
              {repos.length === 0 ? (
                <p className="text-center text-muted-foreground">No public repositories found.</p>
              ) : (
                <div className="space-y-4">
                  {repos.map((repo) => (
                    <div key={repo.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center"
                            >
                              {repo.name} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </h3>
                          {repo.description && <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full bg-primary"></span>
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="commits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Commit Activity</CardTitle>
              <CardDescription>Weekly commit activity over the last year</CardDescription>
            </CardHeader>
            <CardContent>
              {commitActivity.length > 0 ? (
                <CommitsChart data={commitActivity} />
              ) : (
                <p className="text-center text-muted-foreground">No commit activity data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="rounded-full w-24 h-24" />
            <div className="flex-1 space-y-2 w-full">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repositories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="commits">Commit Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="repositories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Repositories</CardTitle>
              <CardDescription>Latest public repositories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full max-w-sm" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="commits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Commit Activity</CardTitle>
              <CardDescription>Weekly commit activity over the last year</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

