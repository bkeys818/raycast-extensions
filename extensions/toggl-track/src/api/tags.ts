import { get, post, put, remove } from "./togglClient";

export function getTags(workspaceId: number) {
  return get<Tag[] | null>(`/workspaces/${workspaceId}/tags`);
}

export function createTag(workspaceId: number, name: string) {
  return post<Tag[] | null>(`/workspaces/${workspaceId}/tags`, { workspace_id: workspaceId, name });
}

export function updateTag(tag: Tag, name: string) {
  return put<Tag[] | null>(`/workspaces/${tag.workspace_id}/tags/${tag.id}`, { workspace_id: tag.workspace_id, name });
}

export function deleteTag(tag: Tag) {
  return remove(`/workspaces/${tag.workspace_id}/tags/${tag.id}`);
}

// https://developers.track.toggl.com/docs/api/tags#response
export interface Tag {
  id: number;
  name: string;
  workspace_id: number;
}
