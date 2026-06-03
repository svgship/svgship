import { NextResponse } from 'next/server';

interface SubmitBody {
  name: string;
  url: string;
  category: string;
  description: string;
  tags: string;
  email: string;
}

const VALID_CATEGORIES = ['icons', 'illustrations', 'tools', 'tutorials', 'inspiration'];

export async function POST(request: Request) {
  try {
    const body: SubmitBody = await request.json();
    const { name, url, category, description, tags, email } = body;

    // Validate required fields
    const missing: string[] = [];
    if (!name?.trim()) missing.push('name');
    if (!url?.trim()) missing.push('url');
    if (!category?.trim()) missing.push('category');
    if (!description?.trim()) missing.push('description');

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Must start with https://' },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // Build GitHub Issue body
    const issueBody = [
      '## 资源提交 / Resource Submission\n',
      `**站点名称 / Site Name:** ${name.trim()}`,
      `**站点地址 / Site URL:** ${url.trim()}`,
      `**分类 / Category:** ${category}`,
      `**描述 / Description:** ${description.trim()}`,
      tags?.trim() ? `**标签 / Tags:** ${tags.trim()}` : null,
      email?.trim() ? `**提交者邮箱 / Submitter Email:** ${email.trim()}` : null,
      '',
      '---',
      '> 自动创建于 SVGShip 提交页面',
    ]
      .filter(Boolean)
      .join('\n');

    const githubToken = process.env.GITHUB_PAT;
    if (!githubToken) {
      console.error('GITHUB_PAT environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    const githubResponse = await fetch('https://api.github.com/repos/svgship/svgship/issues', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SVGShip-Submit/1.0',
      },
      body: JSON.stringify({
        title: `[资源提交] ${name.trim()}`,
        body: issueBody,
        labels: ['submission'],
      }),
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error(`GitHub API error (${githubResponse.status}):`, errorText);
      return NextResponse.json(
        { error: 'Failed to create issue. Please try again later.' },
        { status: 502 }
      );
    }

    const issue = await githubResponse.json();

    return NextResponse.json({
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number,
    });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
