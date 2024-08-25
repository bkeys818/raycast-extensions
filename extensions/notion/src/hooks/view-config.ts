import { LocalStorage, Cache, showToast, Toast } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useEffect } from "react";


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

export function useConvertDepreciatedViewConfig() {
  useEffect(() => {
    convertDepreciatedViewConfig();
  }, []);
}

/**
 * This function coverts the old view config format to the new one.
 * It should be deleted 6 months after implemention (February 2025).
 */
async function convertDepreciatedViewConfig() {
  const cache = new Cache();
  const viewConfigMigrationStatus = cache.get("viewConfigMigrationStatus");
  if (viewConfigMigrationStatus == "complete" || viewConfigMigrationStatus == "in progress") return;

  const jsonString = await LocalStorage.getItem<string>("DATABASES_VIEWS");
  if (!jsonString) return;

  cache.set("viewConfigMigrationStatus", "in progress");
  const toast = await showToast({ title: "Migrating view configuration format", style: Toast.Style.Animated });

  const viewConfigs = JSON.parse(jsonString) as Record<string, Partial<DepreciatedDatabaseView>>;

  for (const databaseId in viewConfigs) {
    const { kanban } = viewConfigs[databaseId];

    if (kanban)
      cache.set(
        `kanban_config-${databaseId}`,
        JSON.stringify({
          ...kanban,
          active: viewConfigs[databaseId].type == "kanban",
        } satisfies KanbanConfig),
      );

    // TOOD: Handle the rest of viewConfigs
  }

  toast.title = "View configurations migrated";
  toast.style = Toast.Style.Success;

  cache.set("viewConfigMigrationStatus", "complete");
}

export interface DepreciatedDatabaseView {
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // properties?: Record<string, any>;
  // create_properties?: string[];
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // sort_by?: Record<string, any>;
  type?: "kanban" | "list";
  kanban?: {
    property_id: string;
    backlog_ids: string[];
    not_started_ids: string[];
    started_ids: string[];
    completed_ids: string[];
    canceled_ids: string[];
  };
}
