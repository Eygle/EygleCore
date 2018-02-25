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
//# sourceMappingURL=core.enums.js.map