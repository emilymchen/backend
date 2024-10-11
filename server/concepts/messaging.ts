import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

// Message document structure
export interface MessageDoc extends BaseDoc {
  sender: ObjectId; // The user who sends the message
  recipient: ObjectId; // The user who receives the message
  content: string; // The message content
  timestamp: Date; // The time the message was sent
}

/**
 * concept: Messaging
 */
export default class MessagingConcept {
  public readonly messages: DocCollection<MessageDoc>;

  /**
   * Make an instance of Messaging.
   */
  constructor(collectionName: string) {
    this.messages = new DocCollection<MessageDoc>(collectionName);
  }

  /**
   * Send a message from one user to another.
   */
  async sendMessage(sender: ObjectId, recipient: ObjectId, content: string) {
    if (!content) {
      throw new NotAllowedError("Message content cannot be empty.");
    }

    const _id = await this.messages.createOne({
      sender,
      recipient,
      content,
      timestamp: new Date(), // Record the time the message is sent
    });

    return { msg: "Message sent successfully!", message: await this.messages.readOne({ _id }) };
  }

  /**
   * Get all messages sent or received by a user.
   */
  async getMessages(userId: ObjectId) {
    return await this.messages.readMany(
      {
        $or: [{ sender: userId }, { recipient: userId }],
      },
      {
        sort: { timestamp: -1 }, // Sort messages by timestamp (most recent first)
      },
    );
  }

  /**
   * Get messages between two users.
   */
  async getMessagesBetween(user1: ObjectId, user2: ObjectId) {
    const messages = await this.messages.readMany(
      {
        $or: [
          { sender: user1, recipient: user2 },
          { sender: user2, recipient: user1 },
        ],
      },
      {
        sort: { timestamp: 1 }, // Sort by timestamp, earliest to latest
      },
    );

    if (!messages.length) {
      throw new NotFoundError(`No messages found between users ${user1} and ${user2}`);
    }

    return messages;
  }

  /**
   * Delete a specific message.
   */
  async deleteMessage(userId: ObjectId, messageId: ObjectId) {
    const message = await this.messages.readOne({ _id: messageId });

    if (!message) {
      throw new NotFoundError(`Message ${messageId} not found.`);
    }

    // Only the sender or recipient can delete a message
    if (!message.sender.equals(userId) && !message.recipient.equals(userId)) {
      throw new NotAllowedError("You do not have permission to delete this message.");
    }

    await this.messages.deleteOne({ _id: messageId });
    return { msg: "Message deleted successfully!" };
  }

  /**
   * Get a specific message by its ID.
   */
  async getMessageById(messageId: ObjectId) {
    const message = await this.messages.readOne({ _id: messageId });

    if (!message) {
      throw new NotFoundError(`Message ${messageId} not found.`);
    }

    return message;
  }
}
