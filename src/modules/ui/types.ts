import { z } from 'zod'

export const filterSchema = z.object({
  name: z.string().toLowerCase(),
  filter: z.string(),
  icon: z.union([z.string().url(), z.string().emoji()]),
  displayName: z.string().max(20),
})

export type Filter = z.infer<typeof filterSchema>

export const filtersSchema = z.record(filterSchema)

export type Filters = z.infer<typeof filtersSchema>

export const filtersByIDSchema = z.record(z.string())

export type FiltersByID = z.infer<typeof filtersByIDSchema>
