import fetch from "node-fetch";
import { togglApiToken } from "../helpers/preferences";

const base64encode = (str: string) => {
  return Buffer.from(str).toString("base64");
};

const baseUrl = "https://api.track.toggl.com/api/v9";
const authHeader = { Authorization: `Basic ${base64encode(`${togglApiToken}:api_token`)}` };

export const get = async <T>(endpoint: string) => togglFetch<T>("GET", endpoint);
export const post = async <T>(endpoint: string, body: unknown) => togglFetch<T>("POST", endpoint, body);
export const patch = async <T>(endpoint: string, body: unknown) => togglFetch<T>("PATCH", endpoint, body);

const togglFetch = async <T>(method: string, endpoint: string, body?: unknown): Promise<T> => {
  const headers: Record<string, string> = authHeader;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(baseUrl + endpoint, {
    method: method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.ok) return (await res.json()) as T;
  else {
    let msg = `${res.status} ${res.statusText}`;
    const text = (await res.text()) as string;
    if (text) msg += ", " + text;
    throw new Error(msg);
  }
};
