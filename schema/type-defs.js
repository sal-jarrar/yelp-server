import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    getCapmgrounds: [Campground]!
    campground(campId: ID): Campground
  }
  type Mutation {
    createCampground(input: CampgroundInput): Campground!
    updateCampground(input: UpdateCampgroundInput): Campground!
    deleteCampground(campId: ID): String!
    registerUser(input: RegisterUserInput): User!
    loginUser(input: LoginUserInput): User!
    addReview(input: ReviewInput): Review!
    updateReview(input: UpdateReviewInput): Review!
    deleteReview(reviewId: ID): String!
  }

  type Campground {
    camp_id: ID!
    title: String!
    description: String!
    image: String!
    location: String!
    price: Float!
    created_at: String!
    user: User!
    reviews: [Review]!
    rating: String!
  }

  type User {
    user_id: ID!
    name: String!
    email: String!
    token: String
  }
  type Review {
    user: User!
    camp_id: ID!
    user_id: ID!
    created_at: String!
    comment: String!
    rating: String!
    review_id: String!
  }

  input CampgroundInput {
    title: String!
    description: String!
    image: String!
    location: String!
    price: Float!
    created_at: String!
    user_id: ID!
  }
  input UpdateCampgroundInput {
    title: String!
    description: String!
    image: String!
    location: String!
    price: Float!
    user_id: ID!
    camp_id: ID!
  }
  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
  }
  input LoginUserInput {
    email: String!
    password: String!
  }
  input ReviewInput {
    camp_id: ID!
    user_id: ID!
    created_at: String!
    comment: String!
    rating: String!
  }
  input UpdateReviewInput {
    review_id: ID!
    comment: String!
    rating: String!
  }
`;

export default typeDefs;
