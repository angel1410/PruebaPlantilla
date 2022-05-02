import { gql } from 'graphql-request'

export default {
  LOGIN: gql`
    query Login ($input: InputLogin!) {
      login(input: $input)
    }
  `,
  USER: gql`
    query User {
      user
    }
  `
}
