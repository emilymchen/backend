import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

/**
 * Interface for a favorited item
 */
export interface FavoriteDoc extends BaseDoc {
  userId: ObjectId;
  itemId: ObjectId;
}

/**
 * concept: Favoriting
 */
export default class FavoritingConcept {
  public readonly favorites: DocCollection<FavoriteDoc>;

  /**
   * Make an instance of Favoriting.
   */
  constructor(collectionName: string) {
    this.favorites = new DocCollection<FavoriteDoc>(collectionName);

    // Create an index on userId for efficient lookups
    void this.favorites.collection.createIndex({ userId: 1 });
  }

  /**
   * adds an item to the user's list of favorite items
   */
  async favoriteItem(userId: ObjectId, itemId: ObjectId) {
    // Check if the item is already favorited
    const alreadyFavorited = await this.favorites.readOne({ userId, itemId });
    if (alreadyFavorited) {
      return { msg: "Item is already in favorites." };
    }

    const _id = await this.favorites.createOne({ userId, itemId });
    return { msg: "Item favorited successfully!", favorite: await this.favorites.readOne({ _id }) };
  }

  /**
   * removes an item from a user's list of favorite items
   */
  async unfavoriteItem(userId: ObjectId, itemId: ObjectId) {
    const favorite = await this.favorites.readOne({ userId, itemId });
    if (!favorite) {
      throw new NotFoundError("Item not found in the user's favorites.");
    }

    await this.favorites.deleteOne({ _id: favorite._id });
    return { msg: "Item removed from favorites." };
  }

  /**
   * retrieves all items the user has favorited
   */
  async getFavoritedItems(userId: ObjectId) {
    const favorites = await this.favorites.readMany({ userId });
    return favorites;
  }

  /**
   * retrieves whether an item is favorited by the user
   */
  async isFavorited(userId: ObjectId, itemId: ObjectId) {
    const favorite = await this.favorites.readOne({ userId, itemId });
    return favorite !== null;
  }
}
