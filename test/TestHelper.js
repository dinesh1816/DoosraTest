import supertest from "supertest";
import { assert } from "chai";

const request = supertest("http://localhost:4000/v1");

export { request, assert };
