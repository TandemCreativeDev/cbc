import { revalidateTag } from "next/cache";
import type {
  CollectionConfig,
  GlobalAfterChangeHook,
} from "payload";

function expire(tag: string, context: Record<string, unknown>) {
  if (!context.skipRevalidate) revalidateTag(tag, { expire: 0 });
}

export const revalidateCollection = (
  tag: string
): NonNullable<CollectionConfig["hooks"]> => ({
  afterChange: [
    ({ doc, context }) => {
      expire(tag, context);
      return doc;
    },
  ],
  afterDelete: [
    ({ doc, context }) => {
      expire(tag, context);
      return doc;
    },
  ],
});

export const revalidateGlobal = (tag: string): GlobalAfterChangeHook[] => [
  ({ doc, context }) => {
    expire(tag, context);
    return doc;
  },
];
