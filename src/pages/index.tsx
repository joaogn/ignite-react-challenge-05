import { useState } from 'react';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  async function loadMore(): Promise<void> {
    if (!nextPage) {
      return;
    }
    fetch(nextPage)
      .then(response => response.json())
      .then(response => {
        const newPosts = [...posts, ...response.results];

        setNextPage(response.next_page);

        setPosts(newPosts);
      });
  }
  return (
    <>
      <Head>
        <title>Inicio | Space Traveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <section>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <div>
                  <time>
                    <FiCalendar />
                    {format(
                      new Date(post.first_publication_date),
                      'dd LLL yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <p>
                    <FiUser />
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </section>
        {nextPage && (
          <section>
            <button type="button" onClick={loadMore}>
              <h3>Carregar mais posts</h3>
            </button>
          </section>
        )}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['title', 'subtitle', 'author'],
      pageSize: 1,
    }
  );

  const posts = postsResponse.results;

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
