import { useMemo, useState } from "react";
import { useNavigation, Form, ActionPanel, Action, Icon, showToast, Toast, clearSearchBar } from "@raycast/api";
import { createTimeEntry, Workspace, Client, Project, Tag, Task } from "../api";
import { useMe, useWorkspaces, useClients, useProjects, useTags, useTasks } from "../hooks";

interface CreateTimeEntryFormProps {
  description?: string;
  defaultWorkspace?: Workspace;
  defaultProject?: Project;
  defaultTags?: Tag[];
  defaultTask?: Task;
  meData?: ReturnType<typeof useMe>;
  workspacesData?: Omit<ReturnType<typeof useWorkspaces>, `${string}Error` | `revalidate${string}`>;
  clientsData?: Omit<ReturnType<typeof useClients>, `${string}Error` | `revalidate${string}`>;
  projectsData?: Omit<ReturnType<typeof useProjects>, `${string}Error` | `revalidate${string}`>;
  tagsData?: Omit<ReturnType<typeof useTags>, `${string}Error` | `revalidate${string}`>;
  tasksData?: Omit<ReturnType<typeof useTasks>, `${string}Error` | `revalidate${string}`>;
  revalidateRunningTimeEntry?: () => void;
}

export default function CreateTimeEntryForm({
  description,
  defaultWorkspace,
  defaultProject,
  defaultTags,
  defaultTask,
  meData,
  workspacesData,
  clientsData,
  projectsData,
  tagsData,
  tasksData,
  revalidateRunningTimeEntry,
}: CreateTimeEntryFormProps) {
  const { me, isLoadingMe } = meData ?? useMe();
  const { workspaces, isLoadingWorkspaces } = workspacesData ?? useWorkspaces();
  const { clients, isLoadingClients } = clientsData ?? useClients(workspaces);
  const { projects, isLoadingProjects } = projectsData ?? useProjects(workspaces);
  const { tags, isLoadingTags } = tagsData ?? useTags(workspaces);
  const { tasks, isLoadingTasks } = tasksData ?? useTasks(workspaces);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | undefined>(
    defaultWorkspace?.id ?? me.default_workspace_id ?? workspaces.length === 1 ? workspaces[0].id : undefined,
  );
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(defaultProject);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(defaultTags?.map((tag) => tag.id) ?? []);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(defaultTask?.id);
  const [billable, setBillable] = useState<boolean>(defaultWorkspace?.projects_billable_by_default ?? false);

  const navigation = useNavigation();

  async function handleSubmit(values: { description: string }) {
    const toast = await showToast(Toast.Style.Animated, "Starting time entry...");
    if (!selectedWorkspaceId) {
      toast.title = "Failed to start time entry";
      toast.style = Toast.Style.Failure;
      return;
    }

    try {
      await createTimeEntry({
        projectId: selectedProject?.id,
        workspaceId: selectedWorkspaceId,
        description: values.description,
        tagIds: selectedTagIds,
        taskId: selectedTaskId,
        billable,
      });
      toast.style = Toast.Style.Success;
      toast.title = "Started time entry";
      navigation.pop();
      revalidateRunningTimeEntry?.();
      await clearSearchBar();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to start time entry";
    }
  }

  const { clientlessProjects, groupedProjects } = useMemo(() => {
    const clientlessProjects: Project[] = [];
    const groupedProjects: Record<number, { client: Client; projects: Project[] }> = {};
    for (const project of projects) {
      if (selectedWorkspaceId && project.workspace_id !== selectedWorkspaceId) continue;
      if (project.client_id === null) clientlessProjects.push(project);
      else if (project.client_id in groupedProjects) groupedProjects[project.client_id].projects.push(project);
      else groupedProjects[project.client_id] = { client: clients.find((client) => client.id)!, projects: [project] };
    }
    return { clientlessProjects, groupedProjects: Object.values(groupedProjects) };
  }, [projects, clients, selectedWorkspaceId]);
  const workspaceTags = useMemo(() => {
    if (!selectedWorkspaceId) return tags;
    return tags.filter((tag) => tag.workspace_id === selectedWorkspaceId);
  }, [tags, selectedWorkspaceId]);
  const projectTasks = useMemo<Task[]>(
    () => tasks.filter((task) => task.project_id == selectedProject?.id),
    [tasks, selectedProject],
  );

  const handleWorkspaceChange = (idStr: string) => setSelectedWorkspaceId(parseInt(idStr));
  const handleProjectChange = (idStr: string) => {
    const projectId = parseOptionalInt(idStr);
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
    if (selectedWorkspaceId === undefined && project) {
      setSelectedWorkspaceId(project.workspace_id);
    }
  };
  const handleTagsChange = (idStrs: string[]) => {
    const tagIds = idStrs.map(parseInt);
    setSelectedTagIds(tagIds);
    if (selectedWorkspaceId === undefined && tagIds.length === 1) {
      const tag = projects.find((p) => p.id === tagIds[0])!;
      setSelectedWorkspaceId(tag.workspace_id);
    }
  };
  const handleTaskChange = (idStr: string) => setSelectedTaskId(parseOptionalInt(idStr));

  return (
    <Form
      isLoading={
        isLoadingMe || isLoadingWorkspaces || isLoadingClients || isLoadingProjects || isLoadingTags || isLoadingTasks
      }
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Time Entry" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="description" title="Description" defaultValue={description} />

      {workspaces.length > 1 && (
        <Form.Dropdown
          id="workspace"
          title="Workspace"
          defaultValue={defaultWorkspace?.id.toString()}
          onChange={handleWorkspaceChange}
        >
          {workspaces.map((workspace) => (
            <Form.Dropdown.Item key={workspace.id} value={workspace.id.toString()} title={workspace.name} />
          ))}
        </Form.Dropdown>
      )}

      <Form.Dropdown
        id="projects"
        title="Projects"
        defaultValue={selectedProject?.id.toString() ?? "-1"}
        onChange={handleProjectChange}
      >
        <Form.Dropdown.Item key="-1" value="-1" title={"No Project"} icon={{ source: Icon.Circle }} />
        {clientlessProjects.map((project) => (
          <Form.Dropdown.Item
            key={project.id}
            value={project.id.toString()}
            title={project.name}
            icon={{ source: Icon.Circle, tintColor: project.color }}
          />
        ))}
        {groupedProjects.map(({ client, projects }) => (
          <Form.Dropdown.Section key={client.id} title={client.name + " Projects"}>
            {projects.map((project) => (
              <Form.Dropdown.Item
                key={project.id}
                value={project.id.toString()}
                title={project.name}
                icon={{ source: Icon.Circle, tintColor: project.color }}
              />
            ))}
          </Form.Dropdown.Section>
        ))}
      </Form.Dropdown>

      <Form.TagPicker
        id="tags"
        title="Tags"
        onChange={handleTagsChange}
        defaultValue={selectedTagIds.map((id) => id.toString())}
      >
        {workspaceTags.map((tag) => (
          <Form.TagPicker.Item key={tag.id} value={tag.id.toString()} title={tag.name} />
        ))}
      </Form.TagPicker>

      {projectTasks.length > 0 && (
        <Form.Dropdown
          id="tasks"
          title="Tasks"
          defaultValue={selectedTaskId?.toString() ?? "-1"}
          onChange={handleTaskChange}
        >
          <Form.Dropdown.Item key="-1" value="-1" title={"No Task"} />
          {projectTasks.map((task) => (
            <Form.Dropdown.Item key={task.id} value={task.id.toString()} title={task.name} />
          ))}
        </Form.Dropdown>
      )}

      {selectedProject?.billable && (
        <Form.Checkbox id="billable" label="" title="Billable" value={billable} onChange={setBillable} />
      )}
    </Form>
  );
}

const parseOptionalInt = (idStr: string) => {
  const id = parseInt(idStr);
  return id == -1 ? undefined : id;
};
