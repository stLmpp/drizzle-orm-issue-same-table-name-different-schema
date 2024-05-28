import { integer, pgSchema, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const schema1 = pgSchema('sch1');
export const schema2 = pgSchema('sch2');

export const sch1Table = schema1.table('table', {
  sch1Id: serial('sch1_id').primaryKey(),
  sch2Id: integer('sch2_id')
    .references(() => sch2Table.sch2Id)
    .notNull(),
});

export const sch1Relations = relations(sch1Table, ({ one }) => ({
  sch2Table: one(sch2Table, {
    references: [sch2Table.sch2Id],
    fields: [sch1Table.sch2Id],
  }),
}));

export const sch2Table = schema2.table('table', {
  sch2Id: serial('sch2_id').primaryKey(),
});

export const sch2Relations = relations(sch2Table, ({ many }) => ({
  sch1Table: many(sch1Table),
}));
