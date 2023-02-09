import fs from "fs";

class Store {
    constructor() {
        this.name = this.constructor.name.toLowerCase().replace("store", "");
        if (!fs.existsSync("data.json")) this.data = {};
        else this.data = JSON.parse(fs.readFileSync("data.json"))?.[this.name] ?? {};
    }

    save() {
        const oldData = fs.existsSync("data.json") ? JSON.parse(fs.readFileSync("data.json")) : {};
        fs.writeFileSync("data.json", JSON.stringify({ ...oldData, [this.name]: this.data }, null, 4));
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

/**
 * @typedef {string} GUILD_ID
 * @typedef {string} TICKET_ID
 * @typedef {{id: string, createdAt: number, user: string}} TICKET
 * @typedef {TICKET[]} TICKETS
 */
export class TicketStore extends Store {
    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {TICKET_ID} key
     * @returns {TICKET}
     */
    getTicket(GUILD_ID, key) {
        return this.getTickets(GUILD_ID).find(ticket => ticket.id === key);
    }

    /**
     * @param {GUILD_ID} GUILD_ID
     * @returns {TICKETS}
     */
    getTickets(GUILD_ID) {
        return this.data[GUILD_ID] ?? [];
    }

    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {TICKET} ticket
     * @returns {void}
     */
    addTicket(GUILD_ID, ticket) {
        this.data[GUILD_ID] = [...this.data[GUILD_ID] ?? [], ticket];
        this.save();
    }

    /**
     * @param {GUILD_ID} GUILD_ID
     * @param {TICKET_ID} key
     * @returns {void}
     */
    delete(GUILD_ID, key) {
        const tickets = this.data[GUILD_ID];
        if (!tickets) return;
        delete tickets[key];
        this.data[GUILD_ID] = tickets;
        this.save();
    }
}
