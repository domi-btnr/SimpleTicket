import fs from "fs";

class Store {
    constructor() {
        this.name = this.constructor.name.toLowerCase().replace("store", "");
        if (!fs.existsSync("data.json")) this.data = { settings: {} };
        else this.data = JSON.parse(fs.readFileSync("data.json"))?.[this.name] ?? { settings: {} };
    }

    save() {
        fs.writeFileSync("data.json", JSON.stringify({ [this.name]: { ...this.data, [this.name]: this.data[this.name] } }, null, 4));
    }
}

/**
 * @typedef {string} GUILD_ID
 * @typedef {("MAX_TICKETS_PER_USER" | "STAFF_ROLE")} SETTINGS_KEY
 * @typedef {(number | string)} SETTINGS_VALUE
 */
export class SettingsStore extends Store {
    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {SETTINGS_KEY} key
     * @returns {SETTINGS_VALUE}
     */
    get(GUILD_ID, key) {
        return this.data[GUILD_ID]?.[key];
    }

    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {SETTINGS_KEY} key
     * @param {SETTINGS_VALUE} value
     * @returns {void}
     */
    set(GUILD_ID, key, value) {
        this.data[GUILD_ID] = { ...this.data[GUILD_ID], [key]: value };
        this.save();
    }

    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {SETTINGS_KEY} key
     * @returns {void}
     */
    delete(GUILD_ID, key) {
        const settings = this.data[GUILD_ID];
        if (!settings) return;
        delete settings[key];
        this.data[GUILD_ID] = settings;
        this.save();
    }
}
