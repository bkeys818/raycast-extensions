import { LocalStorage, Cache, showToast, Toast, open, popToRoot } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useEffect } from "react";

let key = "";

export function useVisibleDatabasePropIds(
  context: "list",
  databaseId: string | undefined,
): { visiblePropIds: string[]; setVisiblePropIds: (value: string[]) => void };
export function useVisibleDatabasePropIds(
  context: "form" | "page",
  databaseId: string | undefined,
  initialValue: string[],
): { visiblePropIds: string[]; setVisiblePropIds: (value: string[]) => void };
export function useVisibleDatabasePropIds(
  context: "list" | "page" | "form",
  databaseId: string | undefined,
  initialValue: string[] = [],
) {
  const [visiblePropIds, setVisiblePropIds] = useCachedState<string[]>(
    `visible_props-${databaseId ?? "no_database_id"}-${context}`,
    initialValue,
  );

  useEffect(() => {
    const newKey = `visible_props-${databaseId ?? "no_database_id"}-${context}`;
    if (newKey != key) {
      console.log(`key: %s\nvalue: %O\n`, newKey, visiblePropIds);
      key = newKey;
    }
  }, [databaseId, context, visiblePropIds]);

  return { visiblePropIds, setVisiblePropIds };
}

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

  try {
    const viewConfigs = JSON.parse(jsonString) as Record<string, Partial<DepreciatedDatabaseView>>;

    for (const databaseId in viewConfigs) {
      const { properties, create_properties, kanban, type } = viewConfigs[databaseId];
      if (properties) {
        console.log(`properties key: %s\nvalue: %O\n`, `visible_props-${databaseId}-list`);
        cache.set(`visible_props-${databaseId}-list`, JSON.stringify(Object.keys(properties)));
      }
      if (create_properties) {
        console.log(`create_properties key: %s\nvalue: %O\n`, `visible_props-${databaseId}-form`);
        cache.set(`visible_props-${databaseId}-form`, JSON.stringify(create_properties));
      }
      if (kanban)
        cache.set(
          `kanban_config-${databaseId}`,
          JSON.stringify({
            ...kanban,
            active: type == "kanban",
          } satisfies KanbanConfig),
        );
    }

    await LocalStorage.removeItem("DATABASES_VIEWS");

    toast.title = "View configurations migrated";
    toast.style = Toast.Style.Success;
    cache.set("viewConfigMigrationStatus", "complete");
    popToRoot(); // Don't love this, but it's the only way I can think to update state. It will only run once.
  } catch (error) {
    console.warn(error);
    toast.title = "Migrated failed";
    toast.message = "Please open an issue.\n" + String(error);
    toast.primaryAction = {
      title: "Open Issue",
      onAction: () =>
        open(
          "https://github.com/raycast/extensions/issues/new?template=extension_bug_report.yml&title=%5BNotion%5D+Migration+of+view+configurations+failed&extension-url=https%3A%2F%2Fwww.raycast.com%2Fnotion%2Fnotion",
        ),
    };
  }
}

export interface DepreciatedDatabaseView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>;
  create_properties?: string[];
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
