export const GET_POST_QUERY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "GET_POST_QUERY",
  type: "object",
  properties: {
    postId: {
      type: "string",
      required: true,
    },
  },
};

export const GET_POST_BODY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "POST_BODY",
  type: "object",
  properties: {},
};

export const CREATE_POST_BODY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "CREATE_POST_BODY",
  type: "object",
  properties: {
    post: {
      type: "string",
      required: true,
    },
    tag: {
      type: "string",
      required: true,
    },
  },
};
