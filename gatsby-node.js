const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    // Grab path to file from src/posts. (ex: /code/2020-02-20)
    const path = createFilePath({ node, getNode, basePath: 'src/posts/' });

    // Add a slug ('[blog]/[year-4-digits]-[month-2-digits]-[day-2-digits]')
    createNodeField({
      node,
      name: `path`,
      value: path,
    });

    // Pull the blog out of the slug (ex: '/adventure/2020-03-26' => 'adventure') and add as a field
    const blog = path.split('/')[1];
    createNodeField({
      node,
      name: 'blog',
      value: blog,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return graphql(
    `
      {
        allMdx {
          edges {
            node {
              id
              fields {
                path
                blog
              }
              frontmatter {
                title
              }
              body
            }
          }
        }
      }
    `,
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;

    posts.forEach((post) => {
      const template = path.resolve('./src/templates/post.tsx');

      createPage({
        path: post.node.fields.path,
        component: template,
        context: {
          slug: post.node.fields.slug,
        },
      });
    });
  });
};
