import UserDB from '../../db/UserDB';
import {ARoute} from '../../middlewares/Resty';
import {RestyCallback} from '../../typings/resty.interface';
import {User} from "../../../commons/models/User";

class Resource extends ARoute {
   /**
    * GET Route
    * @param id
    * @param next
    */
   public get(id: string, next: RestyCallback): void {
      UserDB.getFullCached(id)
         .then((items: Array<User>) => {
            next(items);
         })
         .catch((err: Error) => {
            next(err);
         });
   }
}

class Collection extends ARoute {
   /**
    * GET Route
    * @param next
    */
   public get(next: RestyCallback): void {
      UserDB.getAll()
         .then((items: Array<User>) => {
            next(items);
         })
         .catch((err: Error) => {
            next(err);
         });
   }
}

module.exports.Resource = Resource;
module.exports.Collection = Collection;
