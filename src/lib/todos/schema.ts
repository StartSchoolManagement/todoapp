import { z } from "zod";

/** Turns "" (what empty form fields submit) into undefined before validation. */
const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

export const TITLE_MAX = 200;
export const NOTES_MAX = 2000;

export const todoFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(TITLE_MAX, `Title must be ${TITLE_MAX} characters or fewer.`),
  notes: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(NOTES_MAX, `Notes must be ${NOTES_MAX} characters or fewer.`).optional(),
  ),
  due_date: z.preprocess(emptyToUndefined, z.iso.date("Due date must be a valid date.").optional()),
});

export type TodoFields = z.infer<typeof todoFieldsSchema>;

export const todoIdSchema = z.uuid("Invalid todo id.");

/** Pulls the three editable fields out of a FormData instance. */
export function todoFieldsFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    notes: formData.get("notes"),
    due_date: formData.get("due_date"),
  };
}
