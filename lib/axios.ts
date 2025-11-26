import { api } from "@/services/http";
import axios from "axios";

export const apiReqRes = api.create({
  baseURL: "https://reqres.in",
  headers: {
    "x-api-key": "reqres-free-v1",
  },
});

export const apiBooks = axios.create({
  baseURL: "https://api.booksapi.org/books",
});