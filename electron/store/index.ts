import { IStore } from "../../interfaces";
import Store, { Schema } from "electron-store";
import { is } from "electron-util";

const schema: Schema<IStore> = {
  theme: {
    type: "string",
    enum: ["system", "light", "dark"],
    default: "system",
  },
  lastWindowState: {
    type: "object",
    properties: {
      x: {
        type: "number",
      },
      y: {
        type: "number",
      },
      width: {
        type: "number",
      },
      height: {
        type: "number",
      },
      isMaximized: {
        type: "boolean",
      },
    },
    default: {
      x: undefined,
      y: undefined,
      width: 800,
      height: 600,
      isMaximized: false,
    },
  },
  userSettings: {
    type: "object",
    properties: {
      userName: {
        type: "string",
      },
    },
  },
};

function updateThemeSetting(store: Store<IStore>): void {
  const darkMode = store.get("darkMode");
  const followSystemAppearance = store.get("followSystemAppearance");

  if (is.macos && followSystemAppearance) {
    store.set("theme", "system");
  } else if (typeof darkMode !== "undefined") {
    store.set("theme", darkMode ? "dark" : "light");
  } else if (!store.has("theme")) {
    store.set("theme", "system");
  }

  if (typeof darkMode !== 'undefined') {
    // @ts-expect-error
    store.delete('darkMode');
}

if (typeof followSystemAppearance !== 'undefined') {
    // @ts-expect-error
    store.delete('followSystemAppearance');
}
}

function migrate(store: Store<IStore>): void {
  updateThemeSetting(store);
}

const store = new Store<IStore>({ schema });
migrate(store);

export default store;
