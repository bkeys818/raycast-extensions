import { useMemo } from "react";
import { ActionPanel, Icon, List, Action, showToast, Toast, Color } from "@raycast/api";
import { ExtensionContextProvider } from "./context/ExtensionContext";
import { useWorkspaces, useTags } from "./hooks";
import { Workspace, Tag, deleteTag } from "./api";
import TagForm from "./components/TagForm";

function ManageTags() {
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const { tags, isLoadingTags, revalidateTags } = useTags(workspaces);

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

  async function removeTag(tag: Tag) {
    const toast = await showToast({ title: "Deleting Tag", style: Toast.Style.Animated });
    try {
      await deleteTag(tag);
      revalidateTags();
      toast.style = Toast.Style.Success;
      toast.title = "Tag deleted";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Couldn't deleted tag";
      if (error instanceof Error) toast.message = error.message;
    }
  }

  return (
    <List isLoading={isLoadingWorkspaces || isLoadingTags}>
      <List.Item
        title="Create a new tag"
        icon={Icon.PlusCircle}
        actions={
          <ActionPanel>
            <Action.Push
              title="Create Tag"
              target={
                <ExtensionContextProvider>
                  <TagForm {...{ workspaces, revalidateTags }} />
                </ExtensionContextProvider>
              }
            />
          </ActionPanel>
        }
      />
      {tagGroups.map(({ workspace, tags }) => (
        <List.Section title={`${workspace.name} tags`} key={workspace.id}>
          {tags.map((tag) => (
            <List.Item
              title={tag.name}
              key={tag.id}
              actions={
                <ActionPanel>
                  <Action.Push
                    title="Edit Tag"
                    icon={Icon.Pencil}
                    shortcut={{ key: "e", modifiers: ["cmd"] }}
                    target={
                      <ExtensionContextProvider>
                        <TagForm {...{ workspaces, revalidateTags, tag }} />
                      </ExtensionContextProvider>
                    }
                  />
                  <Action
                    title="Delete Tag"
                    icon={{ source: Icon.Trash, tintColor: Color.Red }}
                    shortcut={{ key: "x", modifiers: ["ctrl"] }}
                    style={Action.Style.Destructive}
                    onAction={() => removeTag(tag)}
                  />
                </ActionPanel>
              }
            />
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
