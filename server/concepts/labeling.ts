import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

// Predefined categories for labeling clothing items
export const CATEGORIES = ["tops", "bottoms", "shoes", "outerwear", "accessories"] as const;
export type Category = (typeof CATEGORIES)[number];

// LabelDoc interface represents a label applied to an item
export interface LabelDoc extends BaseDoc {
  itemId: ObjectId; // The ID of the item being labeled
  label: string; // The label applied (either custom or from predefined categories)
}

/**
 * concept: Labeling
 * Allows users to apply labels (either custom or predefined) to items in their catalog.
 */
export default class LabelingConcept {
  public readonly labels: DocCollection<LabelDoc>;

  /**
   * Create an instance of LabelingConcept.
   */
  constructor(collectionName: string) {
    this.labels = new DocCollection<LabelDoc>(collectionName);
  }

  // Add a label to an item, ensuring that it is either a custom label or a predefined category
  async addLabel(itemId: ObjectId, label: string) {
    this.assertValidLabel(label); // Ensure the label is valid
    const _id = await this.labels.createOne({ itemId, label });
    return { msg: "Label successfully added!", label: await this.labels.readOne({ _id }) };
  }

  // Remove a label from an item
  async removeLabel(itemId: ObjectId, label: string) {
    const result = await this.labels.deleteOne({ itemId, label });
    if (result.deletedCount === 0) {
      throw new NotFoundError(`Label ${label} not found for item ${itemId}`);
    }
    return { msg: "Label successfully removed!" };
  }

  // Get all labels associated with an item
  async getLabels(itemId: ObjectId) {
    return await this.labels.readMany({ itemId });
  }

  // Ensure that a label is valid (either a custom label or a predefined category)
  private assertValidLabel(label: string) {
    if (!label || (!CATEGORIES.includes(label as Category) && label.trim().length === 0)) {
      throw new NotAllowedError(`Invalid label: ${label}`);
    }
  }
}
