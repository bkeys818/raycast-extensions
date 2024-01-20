import { get, post, put, remove } from "./togglClient";

export function getClients(workspaceId: number) {
  return get<Client[] | null>(`/workspaces/${workspaceId}/clients`);
}

export function createClient(workspaceId: number, name: string) {
  return post<Client>(`/workspaces/${workspaceId}/clients`, { name, wid: workspaceId });
}

export function updateClient(workspaceId: number, clientId: number, name: string) {
  return put<Client>(`/workspaces/${workspaceId}/clients/${clientId}`, { name, wid: workspaceId });
}

export function deleteClient(workspaceId: number, clientId: number) {
  return remove(`/workspaces/${workspaceId}/clients/${clientId}`);
}

// https://developers.track.toggl.com/docs/api/clients#response
export interface Client {
  id: number;
  name: string;
  wid: number;
}
