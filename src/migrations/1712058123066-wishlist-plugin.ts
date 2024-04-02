import {MigrationInterface, QueryRunner} from "typeorm";

export class wishlistPlugin1712058123066 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "wishlist_item" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productVariantId" integer NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "customer_custom_fields_wishlist_items_wishlist_item" ("customerId" integer NOT NULL, "wishlistItemId" integer NOT NULL, PRIMARY KEY ("customerId", "wishlistItemId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fdea430617ba0dd9175210a297" ON "customer_custom_fields_wishlist_items_wishlist_item" ("customerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8a628531d6fda92f9667e316a9" ON "customer_custom_fields_wishlist_items_wishlist_item" ("wishlistItemId") `, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_wishlist_item" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productVariantId" integer NOT NULL, CONSTRAINT "FK_acb085dfe252134ae370f57fd4d" FOREIGN KEY ("productVariantId") REFERENCES "product_variant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_wishlist_item"("createdAt", "updatedAt", "id", "productVariantId") SELECT "createdAt", "updatedAt", "id", "productVariantId" FROM "wishlist_item"`, undefined);
        await queryRunner.query(`DROP TABLE "wishlist_item"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_wishlist_item" RENAME TO "wishlist_item"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fdea430617ba0dd9175210a297"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8a628531d6fda92f9667e316a9"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_customer_custom_fields_wishlist_items_wishlist_item" ("customerId" integer NOT NULL, "wishlistItemId" integer NOT NULL, CONSTRAINT "FK_fdea430617ba0dd9175210a2976" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8a628531d6fda92f9667e316a91" FOREIGN KEY ("wishlistItemId") REFERENCES "wishlist_item" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("customerId", "wishlistItemId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_customer_custom_fields_wishlist_items_wishlist_item"("customerId", "wishlistItemId") SELECT "customerId", "wishlistItemId" FROM "customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_customer_custom_fields_wishlist_items_wishlist_item" RENAME TO "customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fdea430617ba0dd9175210a297" ON "customer_custom_fields_wishlist_items_wishlist_item" ("customerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8a628531d6fda92f9667e316a9" ON "customer_custom_fields_wishlist_items_wishlist_item" ("wishlistItemId") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_8a628531d6fda92f9667e316a9"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fdea430617ba0dd9175210a297"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_custom_fields_wishlist_items_wishlist_item" RENAME TO "temporary_customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`CREATE TABLE "customer_custom_fields_wishlist_items_wishlist_item" ("customerId" integer NOT NULL, "wishlistItemId" integer NOT NULL, PRIMARY KEY ("customerId", "wishlistItemId"))`, undefined);
        await queryRunner.query(`INSERT INTO "customer_custom_fields_wishlist_items_wishlist_item"("customerId", "wishlistItemId") SELECT "customerId", "wishlistItemId" FROM "temporary_customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8a628531d6fda92f9667e316a9" ON "customer_custom_fields_wishlist_items_wishlist_item" ("wishlistItemId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fdea430617ba0dd9175210a297" ON "customer_custom_fields_wishlist_items_wishlist_item" ("customerId") `, undefined);
        await queryRunner.query(`ALTER TABLE "wishlist_item" RENAME TO "temporary_wishlist_item"`, undefined);
        await queryRunner.query(`CREATE TABLE "wishlist_item" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productVariantId" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "wishlist_item"("createdAt", "updatedAt", "id", "productVariantId") SELECT "createdAt", "updatedAt", "id", "productVariantId" FROM "temporary_wishlist_item"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_wishlist_item"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8a628531d6fda92f9667e316a9"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fdea430617ba0dd9175210a297"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_custom_fields_wishlist_items_wishlist_item"`, undefined);
        await queryRunner.query(`DROP TABLE "wishlist_item"`, undefined);
   }

}
