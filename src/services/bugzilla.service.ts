import BugzillaAPI from "bugzilla";

const BUGZILLA = process.env["BUGZILLA"] ?? "https://bugzilla.redhat.com/";
const USERNAME = process.env["USERNAME"] ?? "";
const PASSWORD = process.env["PASSWORD"] ?? "";

let api = new BugzillaAPI(BUGZILLA, USERNAME, PASSWORD);

export async function getBugzillaAPIVersion() {
    await api.version();
}
