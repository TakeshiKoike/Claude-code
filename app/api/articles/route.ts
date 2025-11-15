import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, createArticle } from '@/lib/articles';

// GET: すべての記事を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let articles;
    if (category) {
      const { getArticlesByCategory } = await import('@/lib/articles');
      articles = getArticlesByCategory(category);
    } else {
      articles = getAllArticles();
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST: 新しい記事を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, author, image_url } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const newArticle = createArticle({
      title,
      content,
      category,
      author,
      image_url,
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
