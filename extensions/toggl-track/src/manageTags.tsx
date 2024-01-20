import { useMemo, useState } from "react";
import { ActionPanel, Icon, List, Action, showToast, Toast, Color } from "@raycast/api";
import { ExtensionContextProvider } from "./context/ExtensionContext";
import { useWorkspaces, useTags } from "./hooks";
import { Tag, deleteTag } from "./api";
import TagForm from "./components/TagForm";
import CreateTimeEntryForm from "./components/CreateTimeEntryForm";

function ManageTags() {
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const { tags, isLoadingTags, revalidateTags } = useTags(workspaces);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number>(-1);

  const filteredTags = useMemo(() => {
    if (workspaces.length < 2 || selectedWorkspaceId == -1) return tags;
    else return tags.filter((tag) => tag.workspace_id === selectedWorkspaceId);
  }, [workspaces, tags, selectedWorkspaceId]);

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
    <List
      navigationTitle="Manage Tags"
      isLoading={isLoadingWorkspaces || isLoadingTags}
      searchBarAccessory={
        workspaces.length > 1 ? (
          <List.Dropdown
            tooltip="Selecte Workspace"
            storeValue={true}
            onChange={(newValue) => setSelectedWorkspaceId(parseInt(newValue))}
          >
            <List.Dropdown.Item title="All Workspaces" value="-1" key={-1} />
            {workspaces.map((workspace) => (
              <List.Dropdown.Item title={workspace.name} value={workspace.id.toString()} key={workspace.id} />
            ))}
          </List.Dropdown>
        ) : undefined
      }
    >
      {filteredTags.map((tag) => (
        <List.Item
          title={tag.name}
          key={tag.id}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
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
                <Action.Push
                  title="Create Time Entry With Tag"
                  icon={Icon.Clock}
                  shortcut={{ key: "n", modifiers: ["cmd", "shift"] }}
                  target={
                    <ExtensionContextProvider>
                      <CreateTimeEntryForm
                        {...{
                          workspacesData: { workspaces, isLoadingWorkspaces },
                          tagsData: { tags, isLoadingTags },
                          defaultTags: [tag],
                        }}
                      />
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
              </ActionPanel.Section>
              <Action.Push
                title="Create New Tag"
                icon={Icon.Plus}
                shortcut={{ key: "n", modifiers: ["cmd"] }}
                target={
                  <ExtensionContextProvider>
                    <TagForm {...{ workspaces, revalidateTags }} />
                  </ExtensionContextProvider>
                }
              />
            </ActionPanel>
          }
        />
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
