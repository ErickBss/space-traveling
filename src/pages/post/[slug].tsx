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
import { useRouter } from 'next/router';

interface Post {
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
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const [formattedPost, setFormattedPost] = useState<Post>();
  const router = useRouter();

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }

  useEffect(() => {
    const formattingPostData = {
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        banner: {
          url: post.data.banner.url,
        },
        author: post.data.author,
        content: [
          {
            heading: post.data.content[0].heading,
            body: [
              {
                text: RichText.asHtml(post.data.content[0].body[0].text),
              },
            ],
          },
        ],
      },
    };

    setFormattedPost(formattingPostData);
  }, []);

  const calcRawEstimatedNumber = Math.ceil(
    formattedPost?.data.content[0].body[0].text.length / 200
  );
  const estimatedTime = calcRawEstimatedNumber + ' min';

  return (
    <>
      <img className={styles.banner} src={formattedPost?.data.banner.url} />

      <main className={styles.container}>
        <h1>{formattedPost?.data.title}</h1>

        <section className={styles.infoContent}>
          <div>
            <i>
              <AiOutlineCalendar />
            </i>

            <time>{formattedPost?.first_publication_date}</time>
          </div>

          <div>
            <i>
              <FiUser />
            </i>
            <p>{formattedPost?.data.author}</p>
          </div>
          <div>
            <i>
              <AiOutlineClockCircle />
            </i>

            <time>{estimatedTime}</time>
          </div>
        </section>

        <article className={styles.postContent}>
          <h1>{formattedPost?.data.content[0].heading}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: formattedPost?.data.content[0].body[0].text,
            }}
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
    first_publication_date: postResponse.first_publication_date,
    data: {
      title: postResponse.data.title,
      banner: {
        url: postResponse.data.banner.url,
      },
      author: postResponse.data.author,
      content: [
        {
          heading: postResponse.data.content[0].heading,
          body: [
            {
              text: postResponse.data.content[0].body,
            },
          ],
        },
      ],
    },
  };

  return {
    props: {
      post: rawPostData,
    },
  };
};
