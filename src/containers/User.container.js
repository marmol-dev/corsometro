import { PersistMixin } from "../utils/PersistedContainer";
import uuid from 'react-native-uuid'
import moment from 'moment'
import { Container } from 'unstated'

export class BaseUserContainer extends Container {
    state = {
        isLogged: false
    }
}

export class UserContainer extends PersistMixin(BaseUserContainer) {
    static get instance() {
        if (!this._instance) {
            this._instance = new UserContainer('user' + (__DEV__ ? '_dev' : ''))
        }

        return this._instance
    }
}