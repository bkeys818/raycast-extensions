import fetch from "node-fetch";
import { togglApiToken } from "../helpers/preferences";

const base64encode = (str: string) => {
  return Buffer.from(str).toString("base64");
};

const baseUrl = "https://api.track.toggl.com/api/v9";
const authHeader = { Authorization: `Basic ${base64encode(`${togglApiToken}:api_token`)}` };

export const get = <T>(endpoint: string) => togglFetch<T>("GET", endpoint);
export const post = <T>(endpoint: string, body: unknown) => togglFetch<T>("POST", endpoint, body);
export const patch = <T>(endpoint: string, body: unknown) => togglFetch<T>("PATCH", endpoint, body);
export const put = <T>(endpoint: string, body: unknown) => togglFetch<T>("put", endpoint, body);
export const remove = (endpoint: string) => togglFetch<void>("DELETE", endpoint);

const togglFetch = async <T>(method: string, endpoint: string, body?: unknown): Promise<T> => {
  const headers: Record<string, string> = authHeader;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(baseUrl + endpoint, {
    method: method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.ok) {
    // @ts-expect-error - Exepected to return T, but delete will never return anything.
    if (method == "DELETE") return;
    return (await res.json()) as T;
  } else {
    let msg = `${res.status} ${res.statusText}`;
    const text = (await res.text()) as string;
    if (text) msg += ", " + text;
    throw new Error(msg);
  }
};
