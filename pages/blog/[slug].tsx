import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage, NextPageContext } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<{ post: string }> = ({ post }) => {
  return <div className="blog-post-content " dangerouslySetInnerHTML={{__html: post}} />
};

export function getStaticPaths() {
  return {
    paths: readdirSync("./posts").map(file => {
      const [name, _] = file.split(".");
      return { params: {slug: name} };
    }), 
    fallback: true,
  }
}

export const getStaticProps:GetStaticProps = async ( ctx ) => {
  const {content} = matter.read(`./posts/${ctx.params?.slug}.md`);
  const {value} = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  return {
    props: {
      post: value
    },
  }
}

export default Post;