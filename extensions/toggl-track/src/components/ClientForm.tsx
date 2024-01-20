import { ActionPanel, Form, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { Workspace, Client, updateClient, createClient } from "../api";

interface TagFormProps {
  workspaces: Workspace[];
  client?: Client;
  revalidateClients: () => void;
}

export default function ClientForm({ workspaces, client, revalidateClients }: TagFormProps) {
  const { pop } = useNavigation();

  async function handleSubmit({ name, workspace }: { name: string; workspace?: string }) {
    const toast = await showToast(Toast.Style.Animated, (client ? "Updating" : "Creating") + " Client");
    try {
      if (client) await updateClient(client.wid, client.id, name);
      else {
        const workspaceId = workspace ? parseInt(workspace) : workspaces[0].id;
        await createClient(workspaceId, name);
      }
      toast.style = Toast.Style.Success;
      toast.title = toast.title.replace("ing", "ed");
      pop();
      revalidateClients();
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
          <Action.SubmitForm title={client ? "Update" : "Create" + " Client"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" defaultValue={client?.name} />
      {!client && workspaces.length > 1 && (
        <Form.Dropdown id="workspace" title="Workspace">
          {workspaces.map((workspace) => (
            <Form.Dropdown.Item title={workspace.name} value={workspace.id.toString()} key={workspace.id} />
          ))}
        </Form.Dropdown>
      )}
    </Form>
  );
}
