import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';
import Prismic from '@prismicio/client';

import Header from '../components/Header';

import styles from './home.module.scss';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { useState } from 'react';

type Post = {
  nextPage?: string;
  slug: string;
  title: string;
  subTitle: string;
  author: string;
  date: string;
};
interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  const [morePosts, setMorePosts] = useState<Post[]>([]);
  const [nextPost, setNextPost] = useState(posts[0].nextPage);

  async function handleMorePosts() {
    const response = await fetch(nextPost)
      .then(response => response.json())
      .then(post => {
        let dataWay = post.results[0];

        setNextPost(post.next_page);
        return {
          slug: dataWay.slugs,
          title: dataWay.data.title,
          subTitle: dataWay.data.subtitle,
          author: dataWay.data.author,
          date: new Date(dataWay.first_publication_date).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }
          ),
        };
      });
    const listOfMorePosts = [...morePosts, response];
    setMorePosts(listOfMorePosts);
  }
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <Header />

      <main className={styles.container}>
        {posts.map(post => {
          return (
            <section key={post.slug} className={styles.articleBlocks}>
              <h1>{post.title}</h1>
              <h3>{post.subTitle}</h3>
              <div className={styles.infoContent}>
                <div>
                  <i>
                    <AiOutlineCalendar />
                  </i>
                  <time>{post.date}</time>
                </div>

                <div>
                  <i>
                    <FiUser />
                  </i>
                  <p>{post.author}</p>
                </div>
              </div>
            </section>
          );
        })}
        {morePosts.map(post => {
          return (
            <section key={post.slug} className={styles.articleBlocks}>
              <h1>{post.title}</h1>
              <h3>{post.subTitle}</h3>
              <div className={styles.infoContent}>
                <div>
                  <i>
                    <AiOutlineCalendar />
                  </i>
                  <time>{post.date}</time>
                </div>

                <div>
                  <i>
                    <FiUser />
                  </i>
                  <p>{post.author}</p>
                </div>
              </div>
            </section>
          );
        })}

        <a onClick={handleMorePosts}>{nextPost ? 'Carregar mais posts' : ''}</a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 1,
    }
  );

  const nextPage = response.next_page;

  const posts = response.results.map(post => {
    return {
      nextPage,
      slug: post.slugs,
      title: post.data.title,
      subTitle: post.data.subtitle,
      author: post.data.author,
      date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
