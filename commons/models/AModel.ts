export class AModel {

   constructor(data: any = null) {
      if (data) {
         Object.assign(this, data);
      }

      this.formatDate('creationDate');
      this.formatDate('updateDate');
   }

  _id?: string;

  creationDate?: Date;
  updateDate?: Date;

  deleted?: boolean;

   /**
    * Format date for given key
    * @param {string} key
    */
   public formatDate(key: string) {
      if (this[key]) {
         this[key] = new Date(this[key]);
      }
   }
}
