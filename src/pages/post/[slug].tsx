import { GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

export default function Post() {
  return <h1>Hello World</h1>;
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

  console.log(response);

  return {
    props: {
      params,
    },
  };
};
