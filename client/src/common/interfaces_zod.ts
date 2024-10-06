import { z } from "zod";

export const IPreference = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const IUserData = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  canPostEvents: z.boolean(),
  isAdmin: z.boolean(),
  iat: z.number().int(),
  exp: z.number().int(),
});

export const IPhoto = z.object({
  id: z.number().int(),
  photo: z.string(),
  event_id: z.number().int(),
});

export const ILocation = z.object({
  id: z.number().int(),
  Address: z.string(),
  floor: z.number().int(),
  room: z.string(),
  loc_note: z.string().optional(),
  event_id: z.number().int(),
});

export const ITag = z.object({
  tag_id: z.number().int(),
  name: z.string(),
  color: z.string(),
  type_id: z.number().int(),
});

export const ITagType = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const IEvent = z.object({
  event_id: z.number().int(),
  post_time: z.string(),
  exp_time: z.string(),
  description: z.string(),
  qty: z.string(),
  done: z.boolean(),
  createdById: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  location: z.optional(ILocation),
  photos: z.array(IPhoto).optional(),
  tags: z.array(ITag).optional(),
});

export type IUserData = z.infer<typeof IUserData>;
export type IPhoto = z.infer<typeof IPhoto>;
export type ILocation = z.infer<typeof ILocation>;
export type ITag = z.infer<typeof ITag>;
export type IEvent = z.infer<typeof IEvent>;
