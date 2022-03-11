import { RichText } from 'prismic-dom';

import { GetStaticProps } from 'next';

import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import readingTime from 'reading-time';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

type PostProps = {
  post: {
    slug: string;
    image: string;
    title: string;
    date: string;
    author: string;
    heading: string;
    content: string;
  };
};

export default function Post({ post }: PostProps) {
  const { minutes } = readingTime(post.content);
  const estimatedTime = Math.ceil(minutes) + ' min';

  return (
    <>
      <img className={styles.banner} src={post.image} />

      <main className={styles.container}>
        <h1>{post.title}</h1>

        <section className={styles.infoContent}>
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
          <div>
            <i>
              <AiOutlineClockCircle />
            </i>

            <time>{estimatedTime}</time>
          </div>
        </section>

        <div className={styles.postContent}>
          <h1>{post.heading}</h1>
          <span>{post.content}</span>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = await getPrismicClient();

  const response = await prismic.getByUID('post', String(params.slug), {});

  const contentBlock = response.data.content;
  const content = contentBlock.map(contentData => {
    return RichText.asText(contentData.body);
  });
  console.log(response.data.content[0].body);

  const post = {
    slug: response.uid,
    image: response.data.banner.url,
    title: response.data.title,
    date: format(
      new Date(response.first_publication_date),
      "dd 'de' MMM yyyy",
      {
        locale: ptBR,
      }
    ),
    author: response.data.author,
    heading: response.data.content[0].heading,
    content: RichText.asText(response.data.content[0].body),
  };

  return {
    props: {
      post,
    },
  };
};
