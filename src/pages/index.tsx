import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Head from 'next/head';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';
import { useEffect, useState } from 'react';

import styles from './home.module.scss';
import Post from './post/[slug]';

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
  const [postsList, setPostsList] = useState<Post[]>([]);

  useEffect(() => {
    const formatPosts = postsPagination.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPostsList(formatPosts);
  }, []);

  async function handleMorePosts() {
    const response: Post = await fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(post => {
        let dataWay = post.results[0];

        postsPagination.next_page = post.next_page;

        return {
          uid: dataWay.uid,
          first_publication_date: format(
            new Date(dataWay.first_publication_date),
            'dd MMM yyyy',
            {
              locale: ptBR,
            }
          ),
          data: {
            title: dataWay.data.title,
            subtitle: dataWay.data.subtitle,
            author: dataWay.data.author,
          },
        };
      });

    const updatedPostsList = [...postsList, response];

    setPostsList(updatedPostsList);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        {postsList.map(post => {
          return (
            <section key={post.uid} className={styles.articleBlocks}>
              <Link href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
              </Link>
              <h3>{post.data.subtitle}</h3>
              <div className={styles.infoContent}>
                <div>
                  <i>
                    <AiOutlineCalendar />
                  </i>
                  <time>{post.first_publication_date}</time>
                </div>

                <div>
                  <i>
                    <FiUser />
                  </i>
                  <p>{post.data.author}</p>
                </div>
              </div>
            </section>
          );
        })}
        <a onClick={handleMorePosts}>
          {postsPagination.next_page ? 'Carregar mais posts' : ''}
        </a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 2,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page: postsResponse.next_page,
      },
    },
  };
};
