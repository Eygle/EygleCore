export enum EPermission {
   SeeHome = 'seeHome',
   SeeLastAdded = 'seeLastAdded',
   SeeSoonToBeRemoved = 'seeSoonToBeRemoved',
   SeeTVShows = 'seeTVShows',
   EditTVShows = 'editTVShows',
   DeleteTVShows = 'deleteTVShows',
   SeeMovies = 'seeMovies',
   EditMovies = 'editMovies',
   DeleteMovies = 'deleteMovies',
   AddSubtitles = 'addSubtitles',
   RemoveSubtitles = 'removeSubtitles',
   SeeFiles = 'seeFiles',
   EditFiles = 'editFiles',
   DeleteFiles = 'deleteFiles',
   IdentifyMedia = 'identifyMedia',
   SeeAccount = 'seeAccount',
   EditAccount = 'editAccount',
   SeeSettings = 'seeSettings',
   EditSettings = 'editSettings',
   DeleteAccount = 'deleteAccount',
   SeeAdminPanel = 'seeAdminPanel',
   SeeMultipleResults = 'seeMultipleResults',
   ManageMultipleResults = 'manageMultipleResults',
   SeeUsers = 'seeUsers',
   EditUsers = 'editUsers',
   SeeStats = 'seeStats',
   ManageCron = 'manageCron'
}

export enum ERole {
   Public = 'public',
   Guest = 'guest',
   User = 'user',
   Contributor = 'contributor',
   Admin = 'admin'
}

export enum ECronJobAction {
   Run = 'run',
   Schedule = 'schedule',
   UnSchedule = 'un-schedule',
}

export enum ELoggerLvl {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    LOG = 3,
    WARN = 4,
    ERROR = 5,
    OFF = 6,
}

export enum EEnv {
    Prod = 0,
    Preprod,
    Dev,
    Test
}