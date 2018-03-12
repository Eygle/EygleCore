"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EPermission;
(function (EPermission) {
    EPermission["SeeHome"] = "seeHome";
    EPermission["SeeLastAdded"] = "seeLastAdded";
    EPermission["SeeSoonToBeRemoved"] = "seeSoonToBeRemoved";
    EPermission["SeeTVShows"] = "seeTVShows";
    EPermission["EditTVShows"] = "editTVShows";
    EPermission["DeleteTVShows"] = "deleteTVShows";
    EPermission["SeeMovies"] = "seeMovies";
    EPermission["EditMovies"] = "editMovies";
    EPermission["DeleteMovies"] = "deleteMovies";
    EPermission["AddSubtitles"] = "addSubtitles";
    EPermission["RemoveSubtitles"] = "removeSubtitles";
    EPermission["SeeFiles"] = "seeFiles";
    EPermission["EditFiles"] = "editFiles";
    EPermission["DeleteFiles"] = "deleteFiles";
    EPermission["IdentifyMedia"] = "identifyMedia";
    EPermission["SeeAccount"] = "seeAccount";
    EPermission["EditAccount"] = "editAccount";
    EPermission["SeeSettings"] = "seeSettings";
    EPermission["EditSettings"] = "editSettings";
    EPermission["DeleteAccount"] = "deleteAccount";
    EPermission["SeeAdminPanel"] = "seeAdminPanel";
    EPermission["SeeMultipleResults"] = "seeMultipleResults";
    EPermission["ManageMultipleResults"] = "manageMultipleResults";
    EPermission["SeeUsers"] = "seeUsers";
    EPermission["EditUsers"] = "editUsers";
    EPermission["SeeStats"] = "seeStats";
    EPermission["ManageCron"] = "manageCron";
})(EPermission = exports.EPermission || (exports.EPermission = {}));
var ERole;
(function (ERole) {
    ERole["Public"] = "public";
    ERole["Guest"] = "guest";
    ERole["User"] = "user";
    ERole["Contributor"] = "contributor";
    ERole["Admin"] = "admin";
})(ERole = exports.ERole || (exports.ERole = {}));
var ECronJobAction;
(function (ECronJobAction) {
    ECronJobAction["Run"] = "run";
    ECronJobAction["Schedule"] = "schedule";
    ECronJobAction["UnSchedule"] = "un-schedule";
})(ECronJobAction = exports.ECronJobAction || (exports.ECronJobAction = {}));
var ELoggerLvl;
(function (ELoggerLvl) {
    ELoggerLvl[ELoggerLvl["TRACE"] = 0] = "TRACE";
    ELoggerLvl[ELoggerLvl["DEBUG"] = 1] = "DEBUG";
    ELoggerLvl[ELoggerLvl["INFO"] = 2] = "INFO";
    ELoggerLvl[ELoggerLvl["LOG"] = 3] = "LOG";
    ELoggerLvl[ELoggerLvl["WARN"] = 4] = "WARN";
    ELoggerLvl[ELoggerLvl["ERROR"] = 5] = "ERROR";
    ELoggerLvl[ELoggerLvl["OFF"] = 6] = "OFF";
})(ELoggerLvl = exports.ELoggerLvl || (exports.ELoggerLvl = {}));
var EEnv;
(function (EEnv) {
    EEnv[EEnv["Prod"] = 0] = "Prod";
    EEnv[EEnv["Preprod"] = 1] = "Preprod";
    EEnv[EEnv["Dev"] = 2] = "Dev";
    EEnv[EEnv["Test"] = 3] = "Test";
})(EEnv = exports.EEnv || (exports.EEnv = {}));
//# sourceMappingURL=core.enums.js.map