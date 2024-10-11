import AuthenticatingConcept from "./concepts/authenticating";
import CatalogingConcept from "./concepts/cataloging";
import DonatingConcept from "./concepts/donating";
import FavoritingConcept from "./concepts/favoriting";
import FriendingConcept from "./concepts/friending";
import LabelingConcept from "./concepts/labeling";
import MessagingConcept from "./concepts/messaging";
import PostingConcept from "./concepts/posting";
import SessioningConcept from "./concepts/sessioning";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Cataloging = new CatalogingConcept("catalogs");
export const Favoriting = new FavoritingConcept("favorites");
export const Messaging = new MessagingConcept("messages");
export const Labeling = new LabelingConcept("labels");
export const Donating = new DonatingConcept("donations");
