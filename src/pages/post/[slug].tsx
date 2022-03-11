import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

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
  return (
    <>
      <img />

      <main>
        <h1></h1>

        <section>
          <time></time>
          <p></p>
          <time></time>
        </section>

        <div>
          <h1></h1>
          <p></p>
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

  const post = {
    slug: response.uid,
    image: response.data.banner.url,
    title: response.data.title,
    date: response.first_publication_date,
    author: response.data.author,
    heading: response.data.content[0].heading,
    content: RichText.asText(response.data.content[0].body),
  };
  console.log(post);

  return {
    props: {
      post,
    },
  };
};
