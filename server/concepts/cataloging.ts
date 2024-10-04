import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ItemDoc extends BaseDoc {
  userId: ObjectId;
  name: string;
  category: string;
  photoUrl?: string;
}

/**
 * concept: Cataloging
 */
export default class CatalogingConcept {
  public readonly catalog: DocCollection<ItemDoc>;

  /**
   * Make an instance of Cataloging.
   */
  constructor(collectionName: string) {
    this.catalog = new DocCollection<ItemDoc>(collectionName);

    // Create an index on userId to make queries for user catalogs more performant
    void this.catalog.collection.createIndex({ userId: 1 });
  }

  /**
   * adds a new item to a user's catalog
   */
  async addToCatalog(userId: ObjectId, name: string, category: string, photoUrl?: string) {
    const _id = await this.catalog.createOne({ userId, name, category, photoUrl });
    return { msg: "Item added to catalog successfully!", item: await this.catalog.readOne({ _id }) };
  }

  /**
   * removes a given item from a user's catalog
   */
  async removeFromCatalog(userId: ObjectId, itemId: ObjectId) {
    const item = await this.catalog.readOne({ _id: itemId, userId });
    if (!item) {
      throw new NotFoundError("Item not found in the user's catalog.");
    }

    await this.catalog.deleteOne({ _id: itemId });
    return { msg: "Item removed from catalog." };
  }

  /**
   * retrieves & returns all items in a user's catalog
   */
  async getCatalog(userId: ObjectId) {
    const items = await this.catalog.readMany({ userId });
    return items;
  }

  /**
   * retrieves an individual item in a user's catalog
   */
  async getItem(userId: ObjectId, itemId: ObjectId) {
    // make sure that the itemId belongs to the provided userId
    const item = await this.catalog.readOne({ _id: itemId, userId });
    if (!item) {
      throw new NotFoundError("Item not found in the user's catalog.");
    }
    return item;
  }

  /**
   * updates an item in the user's catalog
   */
  async updateItem(userId: ObjectId, itemId: ObjectId, name?: string, category?: string, photoUrl?: string) {
    const item = await this.catalog.readOne({ _id: itemId, userId });
    if (!item) {
      throw new NotFoundError("Item not found in the user's catalog.");
    }

    const updates: Partial<ItemDoc> = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (photoUrl) updates.photoUrl = photoUrl;

    await this.catalog.partialUpdateOne({ _id: itemId }, updates);
    return { msg: "Item updated successfully!", item: await this.catalog.readOne({ _id: itemId }) };
  }

  /**
   * ensure item exists and belongs to the user
   */
  async assertItemExists(userId: ObjectId, itemId: ObjectId) {
    const item = await this.catalog.readOne({ _id: itemId, userId });
    if (!item) {
      throw new NotFoundError("Item not found in the user's catalog.");
    }
  }
}