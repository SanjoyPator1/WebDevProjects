import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
export const NEW_NOTIFICATION = "NEW_NOTIFICATION";
export const NEW_MESSAGE = "NEW_MESSAGE";
export const SEEN_MESSAGE = "SEEN_MESSAGE";

export default pubsub;
