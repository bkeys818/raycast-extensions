import { useMemo } from "react";
import { List } from "@raycast/api";
import { ExtensionContextProvider } from "./context/ExtensionContext";
import { useWorkspaces, useTags } from "./hooks";
import { Workspace, Tag } from "./api";

function ManageTags() {
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const { tags, isLoadingTags } = useTags(workspaces);

  type TagGroup = { workspace: Workspace; tags: Tag[] };
  const tagGroups = useMemo(() => {
    const tagGroupMap = tags.reduce<Record<string, TagGroup>>((tagGroups, tag) => {
      if (tag.workspace_id in tagGroups) tagGroups[tag.workspace_id].tags.push(tag);
      else {
        const workspace = workspaces.find((w) => w.id === tag.workspace_id);
        if (workspace) tagGroups[tag.workspace_id] = { workspace, tags: [tag] };
      }
      return tagGroups;
    }, {});
    return Object.values(tagGroupMap);
  }, [workspaces, tags]);

  return (
    <List isLoading={isLoadingWorkspaces || isLoadingTags}>
      {tagGroups.map(({ workspace, tags }) => (
        <List.Section title={`${workspace.name} tags`} key={workspace.id}>
          {tags.map((tag) => (
            <List.Item title={tag.name} key={tag.id} />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

export default function Command() {
  return (
    <ExtensionContextProvider>
      <ManageTags />
    </ExtensionContextProvider>
  );
}
