import { NextResponse } from 'next/server';
import type { GenerateRequest } from '@/lib/types';
import { generateHavrutaQuestions } from '@/lib/gemini';
import { ERROR_MESSAGES, MIN_ARTICLE_LENGTH } from '@/constants';

function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchArticleFromUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error('URL_FETCH_FAILED');
  }

  const html = await response.text();

  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  if (articleMatch) {
    const text = extractTextFromHtml(articleMatch[0]);
    if (text.length >= MIN_ARTICLE_LENGTH) return text;
  }

  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (mainMatch) {
    const text = extractTextFromHtml(mainMatch[0]);
    if (text.length >= MIN_ARTICLE_LENGTH) return text;
  }

  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  const text = extractTextFromHtml(bodyMatch ? bodyMatch[0] : html);
  return text;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.article || body.article.trim().length === 0) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_ARTICLE },
        { status: 400 }
      );
    }

    const input = body.article.trim();
    let articleText: string;

    if (isUrl(input)) {
      try {
        articleText = await fetchArticleFromUrl(input);
      } catch {
        return NextResponse.json(
          { error: ERROR_MESSAGES.URL_FETCH_FAILED },
          { status: 400 }
        );
      }

      if (articleText.length < MIN_ARTICLE_LENGTH) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.URL_CONTENT_TOO_SHORT },
          { status: 400 }
        );
      }
    } else {
      if (input.length < MIN_ARTICLE_LENGTH) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.SHORT_ARTICLE },
          { status: 400 }
        );
      }
      articleText = input;
    }

    const result = await generateHavrutaQuestions({
      article: articleText,
      ageGroup: body.ageGroup,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'API_KEY_MISSING') {
        return NextResponse.json(
          { error: ERROR_MESSAGES.API_KEY_MISSING },
          { status: 500 }
        );
      }
      if (error.message === 'PARSE_FAILED') {
        return NextResponse.json(
          { error: ERROR_MESSAGES.PARSE_FAILED },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.GEMINI_FAILED },
      { status: 502 }
    );
  }
}
