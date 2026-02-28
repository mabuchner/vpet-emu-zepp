/**
 * Pre-loaded via --import to register the module hooks before any other
 * imports are resolved.
 */
import { register } from "node:module";
register("./hooks.mjs", import.meta.url);
