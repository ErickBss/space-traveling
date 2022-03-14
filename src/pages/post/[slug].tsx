import { RichText } from 'prismic-dom';

import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

interface PreviousAndNextPost {
  uid: string;
  title: string;
}

interface PostProps {
  post: Post;
  previousPost?: PreviousAndNextPost;
  nextPost?: PreviousAndNextPost;
}

export default function Post({ post, previousPost, nextPost }: PostProps) {
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

  function handleRedirectPage(slug: string) {
    router.push(`/post/${slug}`);
    router.reload();
  }

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
        <hr className={styles.divisor} />

        <nav className={styles.navPosts}>
          <div>
            <p>{previousPost ? previousPost.title : ''}</p>
            <a onClick={() => handleRedirectPage(previousPost.uid)}>
              {previousPost ? 'Post anterior' : ''}
            </a>
          </div>

          <div>
            <p>{nextPost ? nextPost.title : ''}</p>

            <a onClick={() => handleRedirectPage(nextPost.uid)}>
              {nextPost ? 'Próximo post' : ''}
            </a>
          </div>
        </nav>
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

  const allPosts = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 100,
    }
  );

  const searchSelectedPostIndex = allPosts.results.findIndex(
    post => post.uid === params.slug
  );

  const getPreviousAndNextPost = {
    previousPost: {
      uid: allPosts.results[searchSelectedPostIndex - 1]?.uid,
      title: allPosts.results[searchSelectedPostIndex - 1]?.data.title,
    },
    nextPost: {
      uid: allPosts.results[searchSelectedPostIndex + 1]?.uid,
      title: allPosts.results[searchSelectedPostIndex + 1]?.data.title,
    },
  };

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
      previousPost: getPreviousAndNextPost.previousPost?.uid
        ? getPreviousAndNextPost.previousPost
        : null,
      nextPost: getPreviousAndNextPost.nextPost?.uid
        ? getPreviousAndNextPost.nextPost
        : null,
    },
  };
};
