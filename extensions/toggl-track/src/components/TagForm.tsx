import { ActionPanel, Form, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { Workspace, Tag, updateTag, createTag } from "../api";

interface TagFormProps {
  workspaces: Workspace[];
  tag?: Tag;
  revalidateTags: () => void;
}

export default function TagForm({ workspaces, tag, revalidateTags }: TagFormProps) {
  const { pop } = useNavigation();

  async function handleSubmit({ name, workspace }: { name: string; workspace?: string }) {
    const toast = await showToast(Toast.Style.Animated, tag ? "Updating" : "Creating" + " Tag");
    try {
      if (tag) await updateTag(tag, name);
      else {
        const workspaceId = workspace ? parseInt(workspace) : workspaces[0].id;
        await createTag(workspaceId, name);
      }
      toast.style = Toast.Style.Success;
      toast.title = toast.title.replace("ing", "ed");
      pop();
      revalidateTags();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Couldn't " + toast.title.replace("ing", "e");
      if (error instanceof Error) {
        toast.message = error.message;
      }
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={tag ? "Update" : "Create" + " Tag"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" defaultValue={tag?.name} />
      {!tag && workspaces.length > 1 && (
        <Form.Dropdown id="workspace" title="Workspace">
          {workspaces.map((workspace) => (
            <Form.Dropdown.Item title={workspace.name} value={workspace.id.toString()} />
          ))}
        </Form.Dropdown>
      )}
    </Form>
  );
}
