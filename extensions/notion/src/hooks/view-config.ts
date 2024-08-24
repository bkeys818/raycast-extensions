import { useCachedState } from "@raycast/utils";

export function useKanbanViewConfig(databaseId: string) {
  const [kanbanConfig, setKanbanConfig] = useCachedState<KanbanConfig | undefined>(`kanban_config-${databaseId}`);
  return { kanbanConfig, setKanbanConfig };
}

export interface KanbanConfig {
  active: boolean;
  property_id: string;
  backlog_ids: string[];
  not_started_ids: string[];
  started_ids: string[];
  completed_ids: string[];
  canceled_ids: string[];
}
