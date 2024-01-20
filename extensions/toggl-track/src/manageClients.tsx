import { useMemo, useState } from "react";
import { ActionPanel, Icon, List, Action, showToast, Toast, Color } from "@raycast/api";
import { ExtensionContextProvider } from "./context/ExtensionContext";
import { useWorkspaces, useClients } from "./hooks";
import { Client, deleteClient } from "./api";
import ClientForm from "./components/ClientForm";

function ManageClients() {
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const { clients, isLoadingClients, revalidateClients } = useClients(workspaces);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number>(-1);

  const filteredClients = useMemo(() => {
    if (workspaces.length < 2 || selectedWorkspaceId == -1) return clients;
    else return clients.filter((client) => client.wid === selectedWorkspaceId);
  }, [workspaces, clients, selectedWorkspaceId]);

  async function removeClient(client: Client) {
    const toast = await showToast({ title: "Deleting Client", style: Toast.Style.Animated });
    try {
      await deleteClient(client.wid, client.id);
      revalidateClients();
      toast.style = Toast.Style.Success;
      toast.title = "Client deleted";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Couldn't deleted client";
      if (error instanceof Error) toast.message = error.message;
    }
  }

  return (
    <List
      navigationTitle="Manage Clients"
      isLoading={isLoadingWorkspaces || isLoadingClients}
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
      {filteredClients.map((client) => (
        <List.Item
          title={client.name}
          key={client.id}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.Push
                  title="Edit Client"
                  icon={Icon.Pencil}
                  shortcut={{ key: "e", modifiers: ["cmd"] }}
                  target={
                    <ExtensionContextProvider>
                      <ClientForm {...{ workspaces, revalidateClients, client }} />
                    </ExtensionContextProvider>
                  }
                />
                <Action
                  title="Delete Client"
                  icon={{ source: Icon.Trash, tintColor: Color.Red }}
                  shortcut={{ key: "x", modifiers: ["ctrl"] }}
                  style={Action.Style.Destructive}
                  onAction={() => removeClient(client)}
                />
              </ActionPanel.Section>
              <Action.Push
                title="Create New Client"
                icon={Icon.Plus}
                shortcut={{ key: "n", modifiers: ["cmd"] }}
                target={
                  <ExtensionContextProvider>
                    <ClientForm {...{ workspaces, revalidateClients }} />
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
      <ManageClients />
    </ExtensionContextProvider>
  );
}
