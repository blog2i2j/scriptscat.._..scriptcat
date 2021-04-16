import { db, Model } from '@App/model/model';
import { Value } from './do/value';

export class ValueModel extends Model<Value> {

    public tableName: string = "value";

    constructor() {
        super();
        this.table = db.table(this.tableName);
    }

}

