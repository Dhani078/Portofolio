import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const username = 'Dhani078';
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 }
      }),
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 }
      })
    ]);
    
    if (!reposRes.ok || !userRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
    }
    
    const [reposData, userData] = await Promise.all([reposRes.json(), userRes.json()]);
    
    const repos = reposData.map((repo: any) => ({
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at
    }));
    
    return NextResponse.json({ 
      repos,
      user: {
        public_repos: userData.public_repos,
        followers: userData.followers
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
