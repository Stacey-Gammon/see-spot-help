
import DatabaseObject from './databaseobject';

export default class Photo extends DatabaseObject {
  public src: string = '';
  public comment: string = '';
  public thumbnailUrl: string = '';
  public fullSizeUrl: string = '';
  public midSizeUrl: string = '';
  public userId: string;
  public groupId: string;
  public animalId: string;
  public file: Blob|File;

  constructor() {
    super();

    this.mappingProperties.push('userId');
    this.mappingProperties.push('groupId');
    this.mappingProperties.push('animalId');
  }

  createInstance() { return new Photo(); }

}
