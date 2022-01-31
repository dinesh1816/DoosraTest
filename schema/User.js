export const LOGIN_QUERY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "LOGIN_QUERY",
  type: "object",
  properties: {},
};

export const LOGIN_BODY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "LOGIN_BODY",
  type: "object",
  properties: {
    mobileNo: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
};

export const UPDATE_USER_DETAILS_BODY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "UPDATE_USER_DETAILS_BODY",
  type: "object",
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    email: {
      type: "string",
    },
    alternateMobileNo: {
      type: "string",
    },
  },
};

export const REGISTER_BODY = {
  $schema: "https://json-schema.org/draft-04/schema#",
  title: "REGISTER_BODY",
  type: "object",
  properties: {
    mobileNo: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    firstName: {
      type: "string",
      required: true,
    },
    lastName: {
      type: "string",
      required: true,
    },
  },
};
