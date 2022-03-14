import { RichText } from 'prismic-dom';

import { GetStaticPaths, GetStaticProps } from 'next';

import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import readingTime from 'reading-time';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import styles from './post.module.scss';
import { useEffect, useState } from 'react';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      };
    };
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const [treatedPostData, setTreatedPostData] = useState({});

  const { minutes } = readingTime(post.data.content.body.text);
  const estimatedTime = Math.ceil(minutes) + ' min';

  return (
    <>
      <img className={styles.banner} src={post.data.banner.url} />

      <main className={styles.container}>
        <h1>{post.data.title}</h1>

        <section className={styles.infoContent}>
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
          <div>
            <i>
              <AiOutlineClockCircle />
            </i>

            <time>{estimatedTime}</time>
          </div>
        </section>

        <article className={styles.postContent}>
          <h1>{post.data.content.heading}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: post.data.content.body.text }}
          />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 100,
    }
  );

  const slugPosts = postsResponse.results.map(uid => {
    return uid.uid;
  });

  return {
    paths: [
      {
        params: { slug: slugPosts[0] },
      },
      {
        params: { slug: slugPosts[1] },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const postResponse = await prismic.getByUID('post', String(params.slug), {});

  const rawPostData = {
    uid: postResponse.uid,
    first_publication_date: postResponse.first_publication_date,
    data: {
      title: postResponse.data.title,
      banner: {
        url: postResponse.data.banner.url,
      },
      author: postResponse.data.author,
      content: {
        heading: postResponse.data.content[0].heading,
        body: {
          text: RichText.asHtml(postResponse.data.content[0].body),
        },
      },
    },
  };

  return {
    props: {
      post: rawPostData,
    },
  };
};
