import { gql } from "graphql-tag";

export const shopApiExtensions = gql`
  extend type Query {
    getAuthCodeUrl(redirectURI: String): String!
  }
`;
